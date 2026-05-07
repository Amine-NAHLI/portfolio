-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)
-- Step 1: Add the status column with default 'pending'
ALTER TABLE testimonials
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending'
CHECK (status IN ('pending', 'approved', 'rejected'));

-- Step 2: Mark all existing testimonials as approved (they were already published)
UPDATE testimonials SET status = 'approved' WHERE status = 'pending';

-- Step 3: Enable Realtime on the testimonials table (run in Supabase Dashboard > Database > Replication)
-- or via SQL:
-- ALTER PUBLICATION supabase_realtime ADD TABLE testimonials;
