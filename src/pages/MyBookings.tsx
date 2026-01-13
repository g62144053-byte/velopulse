import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Phone, Car, Loader2, Trash2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface TestDrive {
  id: string;
  car_id: string;
  car_name: string;
  preferred_date: string;
  preferred_time: string;
  phone: string;
  notes: string | null;
  status: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  confirmed: 'bg-green-500/20 text-green-400 border-green-500/30',
  completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const MyBookings = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<TestDrive[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('test_drives')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
      } else {
        setBookings(data || []);
      }
      setIsLoading(false);
    };

    fetchBookings();
  }, [user]);

  const handleCancelBooking = async (bookingId: string) => {
    const { error } = await supabase
      .from('test_drives')
      .delete()
      .eq('id', bookingId);

    if (error) {
      toast({
        title: "Cancellation Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setBookings(bookings.filter(b => b.id !== bookingId));
      toast({
        title: "Booking Cancelled",
        description: "Your test drive booking has been cancelled.",
      });
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-4xl animate-fade-in">
        <div className="mb-8">
          <Link to="/profile" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Profile
          </Link>
          <h1 className="text-3xl font-bold text-foreground">My Test Drive Bookings</h1>
          <p className="text-muted-foreground mt-2">View and manage your scheduled test drives</p>
        </div>

        {bookings.length === 0 ? (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="text-center py-12">
              <Car className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Bookings Yet</h3>
              <p className="text-muted-foreground mb-6">You haven't booked any test drives yet.</p>
              <Button asChild>
                <Link to="/cars">Browse Cars</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{booking.car_name}</CardTitle>
                      <CardDescription>
                        Booked on {new Date(booking.created_at).toLocaleDateString('en-IN')}
                      </CardDescription>
                    </div>
                    <Badge className={statusColors[booking.status] || statusColors.pending}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>{formatDate(booking.preferred_date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{booking.preferred_time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>{booking.phone}</span>
                    </div>
                  </div>
                  
                  {booking.notes && (
                    <p className="text-sm text-muted-foreground mb-4">
                      <span className="font-medium">Notes:</span> {booking.notes}
                    </p>
                  )}

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/cars/${booking.car_id}`}>View Car</Link>
                    </Button>
                    
                    {booking.status === 'pending' && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm" className="flex items-center gap-2">
                            <Trash2 className="h-4 w-4" />
                            Cancel
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancel Test Drive?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to cancel your test drive for {booking.car_name}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleCancelBooking(booking.id)}>
                              Cancel Booking
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
