"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { isDatabaseConfigured, isSupabaseConfigured } from "@/lib/config/env";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/supabase/server";

const createCaseSchema = z.object({
  companyName: z.string().trim().min(2).max(160),
  industry: z.string().trim().min(2).max(80),
  annualRevenue: z.coerce.number().positive(),
  employeesCount: z.coerce.number().int().nonnegative(),
  legalEntitiesCount: z.coerce.number().int().positive(),
  financeOwner: z.string().trim().min(2).max(80),
  hasDebt: z.enum(["true", "false"]).transform((value) => value === "true"),
  hasCapexPlan: z.enum(["true", "false"]).transform((value) => value === "true"),
  reportsAvailable: z.array(z.string()).default([])
});

export async function createFounderCase(formData: FormData) {
  const parsed = createCaseSchema.safeParse({
    companyName: formData.get("companyName"),
    industry: formData.get("industry"),
    annualRevenue: formData.get("annualRevenue"),
    employeesCount: formData.get("employeesCount"),
    legalEntitiesCount: formData.get("legalEntitiesCount"),
    financeOwner: formData.get("financeOwner"),
    hasDebt: formData.get("hasDebt"),
    hasCapexPlan: formData.get("hasCapexPlan"),
    reportsAvailable: formData.getAll("reportsAvailable")
  });

  if (!parsed.success) {
    redirect("/cases/new?error=invalid_case_profile");
  }

  if (!isSupabaseConfigured() || !isDatabaseConfigured()) {
    redirect("/cases/north-distribution-q2/upload?mode=demo");
  }

  const user = await getCurrentUser();
  if (!user?.email) {
    redirect("/login?next=/cases/new");
  }

  const profile = await prisma.userProfile.upsert({
    where: { supabaseUserId: user.id },
    update: {
      email: user.email,
      updatedAt: new Date()
    },
    create: {
      supabaseUserId: user.id,
      email: user.email,
      role: "founder",
      locale: "ru"
    }
  });

  const company = await prisma.company.create({
    data: {
      ownerUserId: profile.id,
      name: parsed.data.companyName,
      industry: parsed.data.industry,
      annualRevenue: parsed.data.annualRevenue,
      employeesCount: parsed.data.employeesCount,
      legalEntitiesCount: parsed.data.legalEntitiesCount
    }
  });

  const createdCase = await prisma.case.create({
    data: {
      ownerUserId: profile.id,
      companyId: company.id,
      companyName: parsed.data.companyName,
      industry: parsed.data.industry,
      annualRevenue: parsed.data.annualRevenue,
      employeesCount: parsed.data.employeesCount,
      legalEntitiesCount: parsed.data.legalEntitiesCount,
      hasDebt: parsed.data.hasDebt,
      hasCapexPlan: parsed.data.hasCapexPlan,
      financeOwner: parsed.data.financeOwner,
      reportsAvailableJson: JSON.stringify(parsed.data.reportsAvailable)
    }
  });

  redirect(`/cases/${createdCase.id}/upload`);
}
