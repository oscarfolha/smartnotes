CREATE TABLE "FilterPreset" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "search" TEXT,
  "type" "NoteType",
  "priority" "Priority",
  "tagId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "FilterPreset_pkey" PRIMARY KEY ("id")
);
