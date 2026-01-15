-- Add policy for admins to view all test drives
CREATE POLICY "Admins can view all test drives"
ON public.test_drives
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Add policy for admins to update all test drives
CREATE POLICY "Admins can update all test drives"
ON public.test_drives
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));