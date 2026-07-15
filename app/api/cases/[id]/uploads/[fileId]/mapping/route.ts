import { NextResponse } from "next/server";
import { z } from "zod";
import { dataPackSlots, mappingDictionary } from "@/lib/data/data-pack";
import { isDatabaseConfigured, isSupabaseConfigured } from "@/lib/config/env";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/supabase/server";

const slotIds = dataPackSlots.map((slot) => slot.id) as [string, ...string[]];
const normalizedFields = mappingDictionary.map((item) => item.field) as [string, ...string[]];

const mappingSchema = z.object({
  slot: z.enum(slotIds),
  sourceSheet: z.string().trim().min(1).max(200),
  confidence: z.coerce.number().int().min(0).max(100),
  columnMapping: z.record(z.enum(normalizedFields).or(z.literal("")))
});

interface MappingRouteProps {
  params: Promise<{
    id: string;
    fileId: string;
  }>;
}

export async function POST(request: Request, { params }: MappingRouteProps) {
  const { id: caseId, fileId } = await params;
  const parsed = mappingSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid mapping payload" }, { status: 400 });
  }

  if (!isSupabaseConfigured() || !isDatabaseConfigured() || fileId.startsWith("demo_")) {
    return NextResponse.json({
      mode: "demo",
      persisted: false,
      reason: "Supabase or database env is not configured"
    });
  }

  const user = await getCurrentUser();
  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.userProfile.findUnique({
    where: { supabaseUserId: user.id },
    select: { id: true }
  });

  if (!profile) {
    return NextResponse.json({ error: "Founder profile not found" }, { status: 404 });
  }

  const uploadedFile = await prisma.uploadedFile.findFirst({
    where: {
      id: fileId,
      caseId,
      case: {
        ownerUserId: profile.id
      }
    },
    select: { id: true }
  });

  if (!uploadedFile) {
    return NextResponse.json({ error: "Uploaded file not found" }, { status: 404 });
  }

  const mappingProfile = await prisma.mappingProfile.create({
    data: {
      uploadedFileId: uploadedFile.id,
      slot: parsed.data.slot,
      sourceSheet: parsed.data.sourceSheet,
      columnMappingJson: JSON.stringify(parsed.data.columnMapping),
      confidence: parsed.data.confidence,
      status: "confirmed"
    }
  });

  return NextResponse.json({
    mode: "persistent",
    persisted: true,
    mappingProfile: {
      id: mappingProfile.id,
      slot: mappingProfile.slot,
      confidence: mappingProfile.confidence,
      status: mappingProfile.status
    }
  });
}
