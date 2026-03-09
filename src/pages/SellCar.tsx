import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, DollarSign, CheckCircle2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';

const sellCarSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Invalid email').max(255),
  phone: z.string().trim().min(10, 'Phone must be at least 10 digits').max(15),
  vehicle_make: z.string().trim().min(1, 'Make is required').max(50),
  vehicle_model: z.string().trim().min(1, 'Model is required').max(50),
  vehicle_year: z.coerce.number().min(1990, 'Year must be 1990 or later').max(new Date().getFullYear() + 1),
  mileage: z.string().trim().min(1, 'Mileage is required').max(20),
  condition: z.string().min(1, 'Select condition'),
  asking_price: z.coerce.number().min(1, 'Price is required'),
  description: z.string().trim().max(1000).optional(),
});

type SellCarFormData = z.infer<typeof sellCarSchema>;

const conditionOptions = ['Excellent', 'Good', 'Fair', 'Poor'];

const SellCar = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<SellCarFormData>({
    resolver: zodResolver(sellCarSchema),
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (photos.length + files.length > 5) {
      toast.warning('Maximum 5 photos allowed');
      return;
    }
    const validFiles = files.filter((f) => f.type.startsWith('image/') && f.size <= 5 * 1024 * 1024);
    if (validFiles.length !== files.length) toast.warning('Some files were skipped (max 5MB, images only)');
    setPhotos((prev) => [...prev, ...validFiles]);
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreviews((prev) => [...prev, ev.target?.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadPhotos = async (): Promise<string[]> => {
    const urls: string[] = [];
    for (const photo of photos) {
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${photo.name}`;
      const { data, error } = await supabase.storage.from('trade-in-photos').upload(fileName, photo);
      if (error) throw error;
      const { data: urlData } = supabase.storage.from('trade-in-photos').getPublicUrl(data.path);
      urls.push(urlData.publicUrl);
    }
    return urls;
  };

  const onSubmit = async (data: SellCarFormData) => {
    setIsSubmitting(true);
    try {
      let photoUrls: string[] = [];
      if (photos.length > 0) photoUrls = await uploadPhotos();

      const { error } = await supabase.from('sell_car_requests').insert({
        user_id: user?.id || null,
        name: data.name,
        email: data.email,
        phone: data.phone,
        vehicle_make: data.vehicle_make,
        vehicle_model: data.vehicle_model,
        vehicle_year: data.vehicle_year,
        mileage: data.mileage,
        condition: data.condition,
        asking_price: data.asking_price,
        description: data.description || null,
        photos: photoUrls,
      });

      if (error) throw error;

      // Send email notification (best-effort, don't block on failure)
      try {
        await supabase.functions.invoke('send-sell-car-notification', {
          body: {
            sellerName: data.name,
            sellerEmail: data.email,
            sellerPhone: data.phone,
            vehicleMake: data.vehicle_make,
            vehicleModel: data.vehicle_model,
            vehicleYear: data.vehicle_year,
            askingPrice: data.asking_price,
            mileage: data.mileage,
            condition: data.condition,
          },
        });
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
      }

      setIsSuccess(true);
      reset();
      setPhotos([]);
      setPhotoPreviews([]);
      toast.success('Your car listing request has been submitted!');
    } catch (error) {
      console.error('Sell car error:', error);
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-foreground mb-3">Sell Your Car</h1>
          <p className="text-muted-foreground text-lg">Fill in your vehicle details and we'll connect you with potential buyers.</p>
        </div>

        {isSuccess ? (
          <div className="text-center py-16">
            <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-2">Request Submitted!</h3>
            <p className="text-muted-foreground mb-6">Our team will review your listing and get in touch soon.</p>
            <Button onClick={() => setIsSuccess(false)}>Submit Another</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-card border border-border rounded-xl p-6 md:p-8">
            {/* Contact Info */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sell-name">Full Name *</Label>
                <Input id="sell-name" placeholder="Your name" {...register('name')} className={errors.name ? 'border-destructive' : ''} />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="sell-email">Email *</Label>
                <Input id="sell-email" type="email" placeholder="you@example.com" {...register('email')} className={errors.email ? 'border-destructive' : ''} />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="sell-phone">Phone *</Label>
                <Input id="sell-phone" placeholder="Your phone number" {...register('phone')} className={errors.phone ? 'border-destructive' : ''} />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
              </div>
            </div>

            {/* Vehicle Info */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sell-make">Make *</Label>
                <Input id="sell-make" placeholder="e.g. Maruti Suzuki" {...register('vehicle_make')} className={errors.vehicle_make ? 'border-destructive' : ''} />
                {errors.vehicle_make && <p className="text-sm text-destructive">{errors.vehicle_make.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="sell-model">Model *</Label>
                <Input id="sell-model" placeholder="e.g. Swift" {...register('vehicle_model')} className={errors.vehicle_model ? 'border-destructive' : ''} />
                {errors.vehicle_model && <p className="text-sm text-destructive">{errors.vehicle_model.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="sell-year">Year *</Label>
                <Input id="sell-year" type="number" placeholder="e.g. 2020" {...register('vehicle_year')} className={errors.vehicle_year ? 'border-destructive' : ''} />
                {errors.vehicle_year && <p className="text-sm text-destructive">{errors.vehicle_year.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="sell-mileage">Mileage *</Label>
                <Input id="sell-mileage" placeholder="e.g. 45,000 km" {...register('mileage')} className={errors.mileage ? 'border-destructive' : ''} />
                {errors.mileage && <p className="text-sm text-destructive">{errors.mileage.message}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Condition *</Label>
                <Select onValueChange={(v) => setValue('condition', v)}>
                  <SelectTrigger className={errors.condition ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditionOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.condition && <p className="text-sm text-destructive">{errors.condition.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="sell-price">Asking Price (₹) *</Label>
                <Input id="sell-price" type="number" placeholder="e.g. 500000" {...register('asking_price')} className={errors.asking_price ? 'border-destructive' : ''} />
                {errors.asking_price && <p className="text-sm text-destructive">{errors.asking_price.message}</p>}
              </div>
            </div>

            {/* Photos */}
            <div className="space-y-2">
              <Label>Photos (max 5)</Label>
              <div className="flex flex-wrap gap-2">
                {photoPreviews.map((src, i) => (
                  <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-border">
                    <img src={src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removePhoto(i)} className="absolute top-0 right-0 p-0.5 bg-destructive text-destructive-foreground rounded-bl">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {photos.length < 5 && (
                  <label className="w-16 h-16 flex items-center justify-center border border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <input type="file" accept="image/*" multiple onChange={handlePhotoChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sell-desc">Description</Label>
              <Textarea id="sell-desc" placeholder="Any additional details about your vehicle..." rows={3} {...register('description')} />
            </div>

            <Button type="submit" size="lg" disabled={isSubmitting} className="w-full md:w-auto">
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</>
              ) : (
                <><DollarSign className="w-4 h-4 mr-2" />Submit Listing</>
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SellCar;
