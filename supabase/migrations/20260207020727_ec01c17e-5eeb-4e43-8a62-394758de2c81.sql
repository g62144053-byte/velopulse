-- Create table to track admin login attempts
CREATE TABLE public.admin_login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  success BOOLEAN NOT NULL DEFAULT false,
  ip_address TEXT,
  user_agent TEXT,
  failure_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_login_attempts ENABLE ROW LEVEL SECURITY;

-- Admins can view all login attempts
CREATE POLICY "Admins can view login attempts"
ON public.admin_login_attempts
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Allow inserting login attempts (for logging before auth)
CREATE POLICY "Anyone can insert login attempts"
ON public.admin_login_attempts
FOR INSERT
WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX idx_admin_login_attempts_email ON public.admin_login_attempts(email);
CREATE INDEX idx_admin_login_attempts_created_at ON public.admin_login_attempts(created_at DESC);

-- Create a function to check if account is locked (5+ failed attempts in last 15 minutes)
CREATE OR REPLACE FUNCTION public.is_account_locked(check_email TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*) >= 5
  FROM public.admin_login_attempts
  WHERE email = check_email
    AND success = false
    AND created_at > now() - interval '15 minutes'
$$;

-- Create a function to get lockout time remaining
CREATE OR REPLACE FUNCTION public.get_lockout_remaining(check_email TEXT)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT GREATEST(0, 
    EXTRACT(EPOCH FROM (
      (SELECT MAX(created_at) FROM public.admin_login_attempts 
       WHERE email = check_email AND success = false AND created_at > now() - interval '15 minutes')
      + interval '15 minutes' - now()
    ))::INTEGER
  )
$$;