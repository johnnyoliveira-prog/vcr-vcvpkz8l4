CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user',
  allowed_routes JSONB DEFAULT '["/"]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fix RLS policies for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_select" ON public.profiles;
CREATE POLICY "authenticated_select" ON public.profiles
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "authenticated_insert" ON public.profiles;
CREATE POLICY "authenticated_insert" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_update" ON public.profiles;
CREATE POLICY "authenticated_update" ON public.profiles
  FOR UPDATE TO authenticated USING (id = auth.uid() OR current_setting('request.jwt.claims', true)::json->>'email' = 'johnnyoliveira@gmail.com');

DROP POLICY IF EXISTS "authenticated_delete" ON public.profiles;
CREATE POLICY "authenticated_delete" ON public.profiles
  FOR DELETE TO authenticated USING (id = auth.uid() OR current_setting('request.jwt.claims', true)::json->>'email' = 'johnnyoliveira@gmail.com');

-- Fix auth.users nulls
UPDATE auth.users
SET
  confirmation_token = COALESCE(confirmation_token, ''),
  recovery_token = COALESCE(recovery_token, ''),
  email_change_token_new = COALESCE(email_change_token_new, ''),
  email_change = COALESCE(email_change, ''),
  email_change_token_current = COALESCE(email_change_token_current, ''),
  phone_change = COALESCE(phone_change, ''),
  phone_change_token = COALESCE(phone_change_token, ''),
  reauthentication_token = COALESCE(reauthentication_token, '')
WHERE
  confirmation_token IS NULL OR recovery_token IS NULL
  OR email_change_token_new IS NULL OR email_change IS NULL
  OR email_change_token_current IS NULL
  OR phone_change IS NULL OR phone_change_token IS NULL
  OR reauthentication_token IS NULL;

-- Upsert admin user
DO $DO$
DECLARE
  admin_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'johnnyoliveira@gmail.com') THEN
    admin_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      admin_id,
      '00000000-0000-0000-0000-000000000000',
      'johnnyoliveira@gmail.com',
      crypt('#Ortabla6!', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Admin"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '',
      NULL,
      '', '', ''
    );
    
    INSERT INTO public.profiles (id, email, name, role, allowed_routes)
    VALUES (admin_id, 'johnnyoliveira@gmail.com', 'Admin', 'admin', '["*"]'::jsonb)
    ON CONFLICT (id) DO UPDATE SET 
      role = 'admin',
      allowed_routes = '["*"]'::jsonb;
  ELSE
    SELECT id INTO admin_id FROM auth.users WHERE email = 'johnnyoliveira@gmail.com';
    UPDATE auth.users 
    SET encrypted_password = crypt('#Ortabla6!', gen_salt('bf'))
    WHERE email = 'johnnyoliveira@gmail.com';
    
    INSERT INTO public.profiles (id, email, name, role, allowed_routes)
    VALUES (admin_id, 'johnnyoliveira@gmail.com', 'Admin', 'admin', '["*"]'::jsonb)
    ON CONFLICT (id) DO UPDATE SET 
      role = 'admin',
      allowed_routes = '["*"]'::jsonb;
  END IF;
END $DO$;
