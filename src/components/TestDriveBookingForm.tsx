import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Phone, Loader2, CarFront } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TestDriveBookingFormProps {
  carId: string;
  carName: string;
}

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
];

export const TestDriveBookingForm = ({ carId, carName }: TestDriveBookingFormProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Get minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  // Get maximum date (30 days from now)
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to book a test drive.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (!preferredDate || !preferredTime || !phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const { error } = await supabase
      .from('test_drives')
      .insert({
        user_id: user.id,
        car_id: carId,
        car_name: carName,
        preferred_date: preferredDate,
        preferred_time: preferredTime,
        phone: phone,
        notes: notes || null,
      });

    if (error) {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Test Drive Booked!",
        description: "We'll contact you shortly to confirm your appointment.",
      });
      // Reset form
      setPreferredDate('');
      setPreferredTime('');
      setPhone('');
      setNotes('');
    }

    setIsLoading(false);
  };

  if (!user) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CarFront className="h-5 w-5 text-primary" />
            Book a Test Drive
          </CardTitle>
          <CardDescription>Experience this car firsthand</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground mb-4">Please login to book a test drive</p>
          <Button onClick={() => navigate('/login')}>
            Login to Book
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CarFront className="h-5 w-5 text-primary" />
          Book a Test Drive
        </CardTitle>
        <CardDescription>Experience the {carName} firsthand</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Preferred Date *
            </Label>
            <Input
              id="date"
              type="date"
              min={minDate}
              max={maxDateStr}
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              required
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Preferred Time *
            </Label>
            <select
              id="time"
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              required
              className="w-full h-10 px-3 rounded-md border border-input bg-background/50 text-foreground"
            >
              <option value="">Select a time slot</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Contact Number *
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any specific requirements or questions?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-background/50 min-h-[80px]"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Booking...
              </>
            ) : (
              'Book Test Drive'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
