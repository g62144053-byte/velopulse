-- Create activity_logs table for tracking admin actions
CREATE TABLE public.activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_id UUID NOT NULL,
  action TEXT NOT NULL,
  target_user_id UUID,
  target_user_name TEXT,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view activity logs
CREATE POLICY "Admins can view activity logs"
ON public.activity_logs
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Only admins can insert activity logs
CREATE POLICY "Admins can insert activity logs"
ON public.activity_logs
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Create index for faster queries
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
CREATE INDEX idx_activity_logs_actor_id ON public.activity_logs(actor_id);
CREATE INDEX idx_activity_logs_action ON public.activity_logs(action);