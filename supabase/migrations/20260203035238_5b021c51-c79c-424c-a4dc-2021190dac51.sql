-- Create a function to assign admin role to the first user who registers via admin flow
-- This checks if no admin exists and assigns the role

CREATE OR REPLACE FUNCTION public.assign_first_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_count INTEGER;
BEGIN
  -- Count existing admins
  SELECT COUNT(*) INTO admin_count FROM public.user_roles WHERE role = 'admin';
  
  -- If no admins exist, make this user an admin
  IF admin_count = 0 THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to run after a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created_assign_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_assign_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_first_admin();