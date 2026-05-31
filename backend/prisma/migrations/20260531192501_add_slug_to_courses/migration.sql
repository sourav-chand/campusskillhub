-- Add slug column to courses table
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "slug" VARCHAR(255);
CREATE UNIQUE INDEX IF NOT EXISTS "courses_slug_key" ON "courses"("slug");
