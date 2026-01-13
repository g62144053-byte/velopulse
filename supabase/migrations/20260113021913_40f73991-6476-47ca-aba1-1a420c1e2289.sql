-- Create test_drives table for booking appointments
CREATE TABLE public.test_drives (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  car_id TEXT NOT NULL,
  car_name TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL,
  phone TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.test_drives ENABLE ROW LEVEL SECURITY;

-- Users can view their own bookings
CREATE POLICY "Users can view their own test drives"
ON public.test_drives
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own bookings
CREATE POLICY "Users can create their own test drives"
ON public.test_drives
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own bookings
CREATE POLICY "Users can update their own test drives"
ON public.test_drives
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own bookings
CREATE POLICY "Users can delete their own test drives"
ON public.test_drives
FOR DELETE
USING (auth.uid() = user_id);

-- Add timestamp trigger
CREATE TRIGGER update_test_drives_updated_at
BEFORE UPDATE ON public.test_drives
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();