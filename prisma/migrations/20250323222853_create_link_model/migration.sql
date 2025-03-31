-- CreateTable
CREATE TABLE "Links" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "shortCode" TEXT NOT NULL,
    "description" TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clicks" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Links_shortCode_key" ON "Links"("shortCode");

-- CreateIndex
CREATE INDEX "Links_shortCode_idx" ON "Links"("shortCode");

-- CreateIndex
CREATE INDEX "Links_userId_idx" ON "Links"("userId");

-- AddForeignKey
ALTER TABLE "Links" ADD CONSTRAINT "Links_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
