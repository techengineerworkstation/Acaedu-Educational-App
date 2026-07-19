-- Phase 2+ extensions: holidays, schedule_instances, AI scheduler, AI summaries,
-- faculties, institutions, feature_access, billing, payments, departments fix, course_constraints

-- Helper to check if a column exists
CREATE OR REPLACE FUNCTION _check_column_exists(table_name text, col_name text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = $1
      AND column_name = $2
  );
END;
$$ LANGUAGE plpgsql;

-- Helper to check if a table exists
CREATE OR REPLACE FUNCTION _check_table_exists(table_name text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = $1
  );
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 1. holidays
-- ============================================================
DO $$
BEGIN
  IF NOT _check_table_exists('holidays') THEN
    CREATE TABLE holidays (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      date DATE NOT NULL,
      type TEXT NOT NULL DEFAULT 'public',
      created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "holidays_select_auth" ON holidays
      FOR SELECT TO authenticated USING (true);

    CREATE POLICY "holidays_insert_admin" ON holidays
      FOR INSERT TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );

    CREATE POLICY "holidays_update_admin" ON holidays
      FOR UPDATE TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );

    CREATE POLICY "holidays_delete_admin" ON holidays
      FOR DELETE TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- ============================================================
-- 2. schedule_instances
-- ============================================================
DO $$
BEGIN
  IF NOT _check_table_exists('schedule_instances') THEN
    CREATE TABLE schedule_instances (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      schedule_id UUID NOT NULL,
      instance_date DATE NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      is_cancelled BOOLEAN NOT NULL DEFAULT false,
      cancel_reason TEXT,
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    ALTER TABLE schedule_instances ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "schedule_instances_select_auth" ON schedule_instances
      FOR SELECT TO authenticated USING (true);

    CREATE POLICY "schedule_instances_insert_admin" ON schedule_instances
      FOR INSERT TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );

    CREATE POLICY "schedule_instances_update_admin" ON schedule_instances
      FOR UPDATE TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );

    CREATE POLICY "schedule_instances_delete_admin" ON schedule_instances
      FOR DELETE TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- ============================================================
-- 3. ai_scheduler_suggestions
-- ============================================================
DO $$
BEGIN
  IF NOT _check_table_exists('ai_scheduler_suggestions') THEN
    CREATE TABLE ai_scheduler_suggestions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      course_id UUID NOT NULL,
      suggested_day TEXT NOT NULL,
      suggested_start TIME NOT NULL,
      suggested_end TIME NOT NULL,
      suggested_venue_id UUID,
      score NUMERIC(5,2) DEFAULT 0,
      reason TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    ALTER TABLE ai_scheduler_suggestions ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "ai_scheduler_suggestions_select_auth" ON ai_scheduler_suggestions
      FOR SELECT TO authenticated USING (true);

    CREATE POLICY "ai_scheduler_suggestions_insert_admin" ON ai_scheduler_suggestions
      FOR INSERT TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );

    CREATE POLICY "ai_scheduler_suggestions_update_admin" ON ai_scheduler_suggestions
      FOR UPDATE TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );

    CREATE POLICY "ai_scheduler_suggestions_delete_admin" ON ai_scheduler_suggestions
      FOR DELETE TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- ============================================================
-- 4. ai_summaries
-- ============================================================
DO $$
BEGIN
  IF NOT _check_table_exists('ai_summaries') THEN
    CREATE TABLE ai_summaries (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      course_id UUID NOT NULL,
      video_id UUID,
      summary_text TEXT NOT NULL,
      key_points JSONB DEFAULT '[]'::jsonb,
      word_count INTEGER DEFAULT 0,
      generated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    ALTER TABLE ai_summaries ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "ai_summaries_select_auth" ON ai_summaries
      FOR SELECT TO authenticated USING (true);

    CREATE POLICY "ai_summaries_insert_admin" ON ai_summaries
      FOR INSERT TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );

    CREATE POLICY "ai_summaries_update_admin" ON ai_summaries
      FOR UPDATE TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );

    CREATE POLICY "ai_summaries_delete_admin" ON ai_summaries
      FOR DELETE TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- ============================================================
-- 5. faculties
-- ============================================================
DO $$
BEGIN
  IF NOT _check_table_exists('faculties') THEN
    CREATE TABLE faculties (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      code TEXT NOT NULL UNIQUE,
      dean_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    ALTER TABLE faculties ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "faculties_select_auth" ON faculties
      FOR SELECT TO authenticated USING (true);

    CREATE POLICY "faculties_insert_admin" ON faculties
      FOR INSERT TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );

    CREATE POLICY "faculties_update_admin" ON faculties
      FOR UPDATE TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );

    CREATE POLICY "faculties_delete_admin" ON faculties
      FOR DELETE TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- ============================================================
-- 6. institutions
-- ============================================================
DO $$
BEGIN
  IF NOT _check_table_exists('institutions') THEN
    CREATE TABLE institutions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      code TEXT NOT NULL UNIQUE,
      address TEXT,
      phone TEXT,
      email TEXT,
      website TEXT,
      logo_url TEXT,
      motto TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "institutions_select_auth" ON institutions
      FOR SELECT TO authenticated USING (true);

    CREATE POLICY "institutions_insert_admin" ON institutions
      FOR INSERT TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );

    CREATE POLICY "institutions_update_admin" ON institutions
      FOR UPDATE TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );

    CREATE POLICY "institutions_delete_admin" ON institutions
      FOR DELETE TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- ============================================================
-- 7. feature_access
-- ============================================================
DO $$
BEGIN
  IF NOT _check_table_exists('feature_access') THEN
    CREATE TABLE feature_access (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      feature_name TEXT NOT NULL UNIQUE,
      plan_required TEXT NOT NULL DEFAULT 'free',
      is_enabled BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    ALTER TABLE feature_access ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "feature_access_select_auth" ON feature_access
      FOR SELECT TO authenticated USING (true);

    CREATE POLICY "feature_access_insert_admin" ON feature_access
      FOR INSERT TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );

    CREATE POLICY "feature_access_update_admin" ON feature_access
      FOR UPDATE TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );

    CREATE POLICY "feature_access_delete_admin" ON feature_access
      FOR DELETE TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- ============================================================
-- 8. billing_subscriptions
-- ============================================================
DO $$
BEGIN
  IF NOT _check_table_exists('billing_subscriptions') THEN
    CREATE TABLE billing_subscriptions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      plan TEXT NOT NULL DEFAULT 'free',
      amount NUMERIC(10,2) NOT NULL DEFAULT 0,
      currency TEXT NOT NULL DEFAULT 'NGN',
      payment_method TEXT,
      transaction_id TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      expires_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    ALTER TABLE billing_subscriptions ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "billing_subscriptions_select_own" ON billing_subscriptions
      FOR SELECT TO authenticated
      USING (user_id = auth.uid());

    CREATE POLICY "billing_subscriptions_insert_own" ON billing_subscriptions
      FOR INSERT TO authenticated
      WITH CHECK (user_id = auth.uid());

    CREATE POLICY "billing_subscriptions_update_own" ON billing_subscriptions
      FOR UPDATE TO authenticated
      USING (user_id = auth.uid());

    CREATE POLICY "billing_subscriptions_delete_admin" ON billing_subscriptions
      FOR DELETE TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- ============================================================
-- 9. payments
-- ============================================================
DO $$
BEGIN
  IF NOT _check_table_exists('payments') THEN
    CREATE TABLE payments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      amount NUMERIC(10,2) NOT NULL,
      currency TEXT NOT NULL DEFAULT 'NGN',
      payment_method TEXT,
      transaction_id TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      description TEXT,
      metadata JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "payments_select_own" ON payments
      FOR SELECT TO authenticated
      USING (user_id = auth.uid());

    CREATE POLICY "payments_insert_own" ON payments
      FOR INSERT TO authenticated
      WITH CHECK (user_id = auth.uid());

    CREATE POLICY "payments_update_own" ON payments
      FOR UPDATE TO authenticated
      USING (user_id = auth.uid());

    CREATE POLICY "payments_delete_admin" ON payments
      FOR DELETE TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- ============================================================
-- 10. departments: add faculty_id if missing
-- ============================================================
DO $$
BEGIN
  IF _check_table_exists('departments')
     AND NOT _check_column_exists('departments', 'faculty_id') THEN
    ALTER TABLE departments ADD COLUMN faculty_id UUID REFERENCES faculties(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ============================================================
-- 11. course_constraints (for AI scheduler)
-- ============================================================
DO $$
BEGIN
  IF NOT _check_table_exists('course_constraints') THEN
    CREATE TABLE course_constraints (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      course_id UUID NOT NULL,
      preferred_days TEXT[] DEFAULT '{}',
      preferred_times JSONB DEFAULT '[]'::jsonb,
      room_requirements TEXT,
      priority INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    ALTER TABLE course_constraints ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "course_constraints_select_auth" ON course_constraints
      FOR SELECT TO authenticated USING (true);

    CREATE POLICY "course_constraints_insert_admin" ON course_constraints
      FOR INSERT TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );

    CREATE POLICY "course_constraints_update_admin" ON course_constraints
      FOR UPDATE TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );

    CREATE POLICY "course_constraints_delete_admin" ON course_constraints
      FOR DELETE TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- Cleanup helper functions
DROP FUNCTION IF EXISTS _check_column_exists(text, text);
DROP FUNCTION IF EXISTS _check_table_exists(text);
