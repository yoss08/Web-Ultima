-- Migration to remove UNIQUE constraint on super_admin_id in clubs table
DO $$
DECLARE
    constraint_name text;
BEGIN
    -- Find the constraint name for UNIQUE(super_admin_id)
    SELECT conname INTO constraint_name
    FROM pg_constraint
    WHERE conrelid = 'clubs'::regclass
      AND contype = 'u'
      AND array_to_string(conkey, ',') = (
        SELECT array_to_string(array_agg(attnum), ',')
        FROM pg_attribute
        WHERE attrelid = 'clubs'::regclass
          AND attname = 'super_admin_id'
      );

    IF constraint_name IS NOT NULL THEN
        EXECUTE format('ALTER TABLE clubs DROP CONSTRAINT %I', constraint_name);
    END IF;
END $$;

-- If you know the constraint name, you can use:
-- ALTER TABLE clubs DROP CONSTRAINT clubs_super_admin_id_key;
