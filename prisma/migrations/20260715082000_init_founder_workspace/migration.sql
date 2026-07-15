-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "supabaseUserId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT,
    "role" TEXT NOT NULL DEFAULT 'founder',
    "locale" TEXT NOT NULL DEFAULT 'ru',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "ownerUserId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "annualRevenue" DOUBLE PRECISION,
    "employeesCount" INTEGER,
    "legalEntitiesCount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Case" (
    "id" TEXT NOT NULL,
    "ownerUserId" TEXT,
    "companyId" TEXT,
    "companyName" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "annualRevenue" DOUBLE PRECISION NOT NULL,
    "employeesCount" INTEGER NOT NULL,
    "legalEntitiesCount" INTEGER NOT NULL,
    "hasDebt" BOOLEAN NOT NULL,
    "hasCapexPlan" BOOLEAN NOT NULL,
    "financeOwner" TEXT NOT NULL,
    "reportsAvailableJson" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Case_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UploadedFile" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "slot" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT,
    "storageKey" TEXT NOT NULL,
    "sheetNamesJson" TEXT NOT NULL,
    "detectedColumnsJson" TEXT NOT NULL,
    "previewRowsJson" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'uploaded',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UploadedFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MappingProfile" (
    "id" TEXT NOT NULL,
    "uploadedFileId" TEXT NOT NULL,
    "slot" TEXT NOT NULL,
    "sourceSheet" TEXT NOT NULL,
    "columnMappingJson" TEXT NOT NULL,
    "confidence" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MappingProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialInput" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "periodName" TEXT NOT NULL,
    "revenue" DOUBLE PRECISION NOT NULL,
    "cogs" DOUBLE PRECISION NOT NULL,
    "grossProfit" DOUBLE PRECISION NOT NULL,
    "commercialExpenses" DOUBLE PRECISION NOT NULL,
    "adminExpenses" DOUBLE PRECISION NOT NULL,
    "payroll" DOUBLE PRECISION NOT NULL,
    "rent" DOUBLE PRECISION NOT NULL,
    "ebitda" DOUBLE PRECISION NOT NULL,
    "depreciation" DOUBLE PRECISION NOT NULL,
    "ebit" DOUBLE PRECISION NOT NULL,
    "interestExpense" DOUBLE PRECISION NOT NULL,
    "netProfit" DOUBLE PRECISION NOT NULL,
    "operatingCashFlow" DOUBLE PRECISION NOT NULL,
    "capex" DOUBLE PRECISION NOT NULL,
    "financingCashFlow" DOUBLE PRECISION NOT NULL,
    "debtRepayment" DOUBLE PRECISION NOT NULL,
    "newDebt" DOUBLE PRECISION NOT NULL,
    "cashStart" DOUBLE PRECISION NOT NULL,
    "cashEnd" DOUBLE PRECISION NOT NULL,
    "cash" DOUBLE PRECISION NOT NULL,
    "accountsReceivable" DOUBLE PRECISION NOT NULL,
    "inventory" DOUBLE PRECISION NOT NULL,
    "fixedAssets" DOUBLE PRECISION NOT NULL,
    "accountsPayable" DOUBLE PRECISION NOT NULL,
    "shortTermDebt" DOUBLE PRECISION NOT NULL,
    "longTermDebt" DOUBLE PRECISION NOT NULL,
    "equity" DOUBLE PRECISION NOT NULL,
    "avgDebtRate" DOUBLE PRECISION,
    "wacc" DOUBLE PRECISION,
    "expectedCapexRoi" DOUBLE PRECISION,
    "dso" DOUBLE PRECISION,
    "dio" DOUBLE PRECISION,
    "dpo" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancialInput_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkingCapitalAging" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "periodName" TEXT NOT NULL,
    "partyName" TEXT NOT NULL,
    "partyType" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "bucket" TEXT NOT NULL,
    "sourceRef" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkingCapitalAging_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DebtSchedule" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "lender" TEXT NOT NULL,
    "facilityType" TEXT NOT NULL,
    "principal" DOUBLE PRECISION NOT NULL,
    "interestRate" DOUBLE PRECISION,
    "dueDate" TIMESTAMP(3),
    "nextPayment" DOUBLE PRECISION NOT NULL,
    "covenantNotes" TEXT,
    "sourceRef" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DebtSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CapexPlan" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "expectedRoi" DOUBLE PRECISION,
    "fundingSource" TEXT,
    "periodName" TEXT NOT NULL,
    "managementNote" TEXT,
    "sourceRef" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CapexPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesChannelMetric" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "periodName" TEXT NOT NULL,
    "channelName" TEXT NOT NULL,
    "revenue" DOUBLE PRECISION NOT NULL,
    "grossMargin" DOUBLE PRECISION,
    "discountRate" DOUBLE PRECISION,
    "logisticsCost" DOUBLE PRECISION,
    "marketplaceFee" DOUBLE PRECISION,
    "contributionMargin" DOUBLE PRECISION,
    "sourceRef" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SalesChannelMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvidenceItem" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "conclusion" TEXT NOT NULL,
    "sourceRef" TEXT NOT NULL,
    "formula" TEXT,
    "value" TEXT,
    "confidence" INTEGER NOT NULL,
    "evidenceType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EvidenceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalysisResult" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "riskScore" INTEGER NOT NULL,
    "riskLevel" TEXT NOT NULL,
    "executiveSummary" TEXT NOT NULL,
    "metricsJson" TEXT NOT NULL,
    "redFlagsJson" TEXT NOT NULL,
    "liquidityRisksJson" TEXT NOT NULL,
    "operatingLeverageRisksJson" TEXT NOT NULL,
    "capexRisksJson" TEXT NOT NULL,
    "debtRisksJson" TEXT NOT NULL,
    "workingCapitalRisksJson" TEXT NOT NULL,
    "financeMaturityJson" TEXT NOT NULL,
    "hiringRecommendationJson" TEXT NOT NULL,
    "questionsToFinanceTeamJson" TEXT NOT NULL,
    "ownerEducationBlock" TEXT NOT NULL,
    "nextActionsJson" TEXT NOT NULL,
    "markdownReport" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnalysisResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OwnerBrief" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "analysisResultId" TEXT,
    "title" TEXT NOT NULL,
    "confidence" INTEGER NOT NULL,
    "verdict" TEXT NOT NULL,
    "markdownBody" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OwnerBrief_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "provider" TEXT,
    "model" TEXT,
    "metadataJson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_supabaseUserId_key" ON "UserProfile"("supabaseUserId");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_email_key" ON "UserProfile"("email");

-- CreateIndex
CREATE INDEX "Company_ownerUserId_idx" ON "Company"("ownerUserId");

-- CreateIndex
CREATE INDEX "Case_ownerUserId_idx" ON "Case"("ownerUserId");

-- CreateIndex
CREATE INDEX "Case_companyId_idx" ON "Case"("companyId");

-- CreateIndex
CREATE INDEX "UploadedFile_caseId_idx" ON "UploadedFile"("caseId");

-- CreateIndex
CREATE INDEX "MappingProfile_uploadedFileId_idx" ON "MappingProfile"("uploadedFileId");

-- CreateIndex
CREATE INDEX "FinancialInput_caseId_idx" ON "FinancialInput"("caseId");

-- CreateIndex
CREATE INDEX "WorkingCapitalAging_caseId_idx" ON "WorkingCapitalAging"("caseId");

-- CreateIndex
CREATE INDEX "DebtSchedule_caseId_idx" ON "DebtSchedule"("caseId");

-- CreateIndex
CREATE INDEX "CapexPlan_caseId_idx" ON "CapexPlan"("caseId");

-- CreateIndex
CREATE INDEX "SalesChannelMetric_caseId_idx" ON "SalesChannelMetric"("caseId");

-- CreateIndex
CREATE INDEX "EvidenceItem_caseId_idx" ON "EvidenceItem"("caseId");

-- CreateIndex
CREATE INDEX "AnalysisResult_caseId_idx" ON "AnalysisResult"("caseId");

-- CreateIndex
CREATE INDEX "OwnerBrief_caseId_idx" ON "OwnerBrief"("caseId");

-- CreateIndex
CREATE INDEX "OwnerBrief_analysisResultId_idx" ON "OwnerBrief"("analysisResultId");

-- CreateIndex
CREATE INDEX "ChatMessage_caseId_idx" ON "ChatMessage"("caseId");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UploadedFile" ADD CONSTRAINT "UploadedFile_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MappingProfile" ADD CONSTRAINT "MappingProfile_uploadedFileId_fkey" FOREIGN KEY ("uploadedFileId") REFERENCES "UploadedFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialInput" ADD CONSTRAINT "FinancialInput_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceItem" ADD CONSTRAINT "EvidenceItem_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalysisResult" ADD CONSTRAINT "AnalysisResult_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnerBrief" ADD CONSTRAINT "OwnerBrief_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnerBrief" ADD CONSTRAINT "OwnerBrief_analysisResultId_fkey" FOREIGN KEY ("analysisResultId") REFERENCES "AnalysisResult"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;
