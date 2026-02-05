-- Create a function to sync emails from auth.users to profiles
-- This uses SECURITY DEFINER to access auth.users
CREATE OR REPLACE FUNCTION public.sync_profile_emails()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles p
  SET email = u.email
  FROM auth.users u
  WHERE p.user_id = u.id
    AND (p.email IS NULL OR p.email != u.email);
END;
$$;

-- Grant execute permission to authenticated users (admins will call this)
GRANT EXECUTE ON FUNCTION public.sync_profile_emails() TO authenticated;