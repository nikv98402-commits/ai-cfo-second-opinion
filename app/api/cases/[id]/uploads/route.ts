import { NextResponse } from "next/server";
import { z } from "zod";
import { isDatabaseConfigured, isSupabaseConfigured, getRuntimeEnv } from "@/lib/config/env";
import { prisma } from "@/lib/db/prisma";
import { createSupabaseServerClient, getCurrentUser } from "@/lib/supabase/server";
import { dataPackSlots } from "@/lib/data/data-pack";

const slotIds = dataPackSlots.map((slot) => slot.id) as [string, ...string[]];

const uploadMetadataSchema = z.object({
  slot: z.enum(slotIds),
  sheetNamesJson: z.string().min(2).max(20_000),
  detectedColumnsJson: z.string().min(2).max(100_000),
  previewRowsJson: z.string().min(2).max(250_000)
});

interface UploadRouteProps {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: UploadRouteProps) {
  const { id: caseId } = await params;

  if (!isSupabaseConfigured() || !isDatabaseConfigured()) {
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

  const formData = await request.formData();
  const file = formData.get("file");
  const parsed = uploadMetadataSchema.safeParse({
    slot: formData.get("slot"),
    sheetNamesJson: formData.get("sheetNamesJson"),
    detectedColumnsJson: formData.get("detectedColumnsJson"),
    previewRowsJson: formData.get("previewRowsJson")
  });

  if (!(file instanceof File) || !parsed.success) {
    return NextResponse.json({ error: "Invalid upload payload" }, { status: 400 });
  }

  const profile = await prisma.userProfile.findUnique({
    where: { supabaseUserId: user.id },
    select: { id: true }
  });

  if (!profile) {
    return NextResponse.json({ error: "Founder profile not found" }, { status: 404 });
  }

  const ownedCase = await prisma.case.findFirst({
    where: {
      id: caseId,
      ownerUserId: profile.id
    },
    select: { id: true }
  });

  if (!ownedCase) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase client is not configured" }, { status: 500 });
  }

  const env = getRuntimeEnv();
  const uploadedFileId = createId("upl");
  const storageKey = buildStorageKey(user.id, caseId, uploadedFileId, file.name);
  const bytes = await file.arrayBuffer();

  const { error: storageError } = await supabase.storage
    .from(env.SUPABASE_STORAGE_BUCKET)
    .upload(storageKey, bytes, {
      contentType: file.type || "application/octet-stream",
      upsert: false
    });

  if (storageError) {
    return NextResponse.json({ error: storageError.message }, { status: 502 });
  }

  const uploadedFile = await prisma.uploadedFile.create({
    data: {
      id: uploadedFileId,
      caseId,
      slot: parsed.data.slot,
      originalName: file.name,
      mimeType: file.type || null,
      storageKey,
      sheetNamesJson: parsed.data.sheetNamesJson,
      detectedColumnsJson: parsed.data.detectedColumnsJson,
      previewRowsJson: parsed.data.previewRowsJson,
      status: "uploaded"
    }
  });

  return NextResponse.json({
    mode: "persistent",
    persisted: true,
    uploadedFile: {
      id: uploadedFile.id,
      slot: uploadedFile.slot,
      originalName: uploadedFile.originalName,
      storageKey: uploadedFile.storageKey,
      status: uploadedFile.status
    }
  });
}

function createId(prefix: string) {
  return `${prefix}_${crypto.randomUUID().replaceAll("-", "")}`;
}

function buildStorageKey(userId: string, caseId: string, uploadedFileId: string, originalName: string) {
  const safeName = originalName.replace(/[^\w.\-()[\]а-яА-ЯёЁ ]/g, "_").slice(0, 120);
  return `users/${userId}/cases/${caseId}/raw/${uploadedFileId}/${safeName || "upload.bin"}`;
}
