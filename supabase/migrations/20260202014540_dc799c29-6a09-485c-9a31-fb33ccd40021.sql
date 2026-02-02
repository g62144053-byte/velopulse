-- Create service_requests table
CREATE TABLE public.service_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service_type TEXT NOT NULL,
  vehicle_details TEXT,
  preferred_date DATE,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

-- Policies for service_requests
CREATE POLICY "Anyone can create service requests"
  ON public.service_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own service requests"
  ON public.service_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all service requests"
  ON public.service_requests FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update service requests"
  ON public.service_requests FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete service requests"
  ON public.service_requests FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_service_requests_updated_at
  BEFORE UPDATE ON public.service_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trade_in_requests table
CREATE TABLE public.trade_in_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  vehicle_make TEXT NOT NULL,
  vehicle_model TEXT NOT NULL,
  vehicle_year INTEGER NOT NULL,
  mileage TEXT NOT NULL,
  condition TEXT NOT NULL,
  photos TEXT[] DEFAULT '{}',
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.trade_in_requests ENABLE ROW LEVEL SECURITY;

-- Policies for trade_in_requests
CREATE POLICY "Anyone can create trade-in requests"
  ON public.trade_in_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own trade-in requests"
  ON public.trade_in_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all trade-in requests"
  ON public.trade_in_requests FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update trade-in requests"
  ON public.trade_in_requests FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete trade-in requests"
  ON public.trade_in_requests FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_trade_in_requests_updated_at
  BEFORE UPDATE ON public.trade_in_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for trade-in photos
INSERT INTO storage.buckets (id, name, public) VALUES ('trade-in-photos', 'trade-in-photos', true);

-- Storage policies for trade-in photos
CREATE POLICY "Anyone can upload trade-in photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'trade-in-photos');

CREATE POLICY "Anyone can view trade-in photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'trade-in-photos');