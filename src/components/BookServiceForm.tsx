import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Wrench, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';

const serviceSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Invalid email').max(255),
  phone: z.string().trim().min(10, 'Phone must be at least 10 digits').max(15),
  service_type: z.string().min(1, 'Select a service type'),
  vehicle_details: z.string().trim().max(200).optional(),
  preferred_date: z.string().optional(),
  notes: z.string().trim().max(500).optional(),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

const serviceTypes = [
  'Periodic Maintenance',
  'Diagnostics & Repairs',
  'Detailing & Protection',
  'Wheel Alignment',
  'AC Service',
  'Battery Replacement',
  'Other',
];

export const BookServiceForm = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      service_type: '',
      vehicle_details: '',
      preferred_date: '',
      notes: '',
    },
  });

  const onSubmit = async (data: ServiceFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('service_requests').insert({
        user_id: user?.id || null,
        name: data.name,
        email: data.email,
        phone: data.phone,
        service_type: data.service_type,
        vehicle_details: data.vehicle_details || null,
        preferred_date: data.preferred_date || null,
        notes: data.notes || null,
      });

      if (error) throw error;

      setIsSuccess(true);
      reset();
      toast.success('Service request submitted!');
    } catch (error: unknown) {
      console.error('Service request error:', error);
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-10">
        <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-foreground mb-2">Request Received!</h3>
        <p className="text-muted-foreground mb-6">We'll contact you shortly to confirm your service appointment.</p>
        <Button variant="hero" onClick={() => setIsSuccess(false)}>
          Book Another Service
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="service-name">Full Name *</Label>
          <Input
            id="service-name"
            placeholder="Your name"
            {...register('name')}
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="service-email">Email *</Label>
          <Input
            id="service-email"
            type="email"
            placeholder="you@example.com"
            {...register('email')}
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="service-phone">Phone *</Label>
          <Input
            id="service-phone"
            placeholder="Your phone number"
            {...register('phone')}
            className={errors.phone ? 'border-destructive' : ''}
          />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="service-type">Service Type *</Label>
          <Select onValueChange={(v) => setValue('service_type', v)}>
            <SelectTrigger className={errors.service_type ? 'border-destructive' : ''}>
              <SelectValue placeholder="Select service" />
            </SelectTrigger>
            <SelectContent>
              {serviceTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.service_type && <p className="text-sm text-destructive">{errors.service_type.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="vehicle-details">Vehicle Details</Label>
          <Input
            id="vehicle-details"
            placeholder="Make, Model, Year"
            {...register('vehicle_details')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferred-date">Preferred Date</Label>
          <Input
            id="preferred-date"
            type="date"
            {...register('preferred_date')}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="service-notes">Additional Notes</Label>
        <Textarea
          id="service-notes"
          placeholder="Any specific concerns or requests..."
          rows={3}
          {...register('notes')}
        />
      </div>

      <Button type="submit" variant="hero" size="lg" disabled={isSubmitting} className="w-full md:w-auto">
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Wrench className="w-4 h-4 mr-2" />
            Book Service
          </>
        )}
      </Button>
    </form>
  );
};
