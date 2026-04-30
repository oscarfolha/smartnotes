-- Add favorite marker to prioritize notes in UI views
ALTER TABLE "Note"
ADD COLUMN "favorite" BOOLEAN NOT NULL DEFAULT false;
