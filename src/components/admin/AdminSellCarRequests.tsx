import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Car, Eye, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/components/ui/sonner';

interface SellCarRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: number;
  mileage: string;
  condition: string;
  asking_price: number;
  description: string | null;
  photos: string[] | null;
  status: string;
  created_at: string;
}

const statusOptions = ['pending', 'reviewing', 'offer_made', 'accepted', 'rejected'];

const getStatusBadge = (status: string) => {
  const variants: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    reviewing: 'bg-blue-100 text-blue-800',
    offer_made: 'bg-purple-100 text-purple-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };
  return <Badge className={variants[status] || ''}>{status.replace('_', ' ')}</Badge>;
};

export const AdminSellCarRequests = () => {
  const [requests, setRequests] = useState<SellCarRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from('sell_car_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setRequests(data as SellCarRequest[]);
    setLoading(false);
  };

  useEffect(() => { fetchRequests(); }, []);

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    const { error } = await supabase.from('sell_car_requests').update({ status }).eq('id', id);
    if (error) {
      toast.error('Failed to update status');
    } else {
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      toast.success('Status updated');
    }
    setUpdatingId(null);
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sell Car Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No sell car requests yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-medium">{req.vehicle_year} {req.vehicle_make} {req.vehicle_model}</TableCell>
                    <TableCell>{req.name}</TableCell>
                    <TableCell>₹{Number(req.asking_price).toLocaleString('en-IN')}</TableCell>
                    <TableCell>{req.condition}</TableCell>
                    <TableCell>{getStatusBadge(req.status)}</TableCell>
                    <TableCell>{format(new Date(req.created_at), 'MMM dd, yyyy')}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Select value={req.status} onValueChange={(v) => updateStatus(req.id, v)} disabled={updatingId === req.id}>
                        <SelectTrigger className="w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((s) => (
                            <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon"><Eye className="h-4 w-4" /></Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>{req.vehicle_year} {req.vehicle_make} {req.vehicle_model}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-3 text-sm">
                            <p><strong>Seller:</strong> {req.name} — {req.email} — {req.phone}</p>
                            <p><strong>Mileage:</strong> {req.mileage}</p>
                            <p><strong>Condition:</strong> {req.condition}</p>
                            <p><strong>Asking Price:</strong> ₹{Number(req.asking_price).toLocaleString('en-IN')}</p>
                            {req.description && <p><strong>Description:</strong> {req.description}</p>}
                            {req.photos && req.photos.length > 0 && (
                              <div>
                                <strong>Photos:</strong>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {req.photos.map((url, i) => (
                                    <img key={i} src={url} alt={`Photo ${i + 1}`} className="w-24 h-24 object-cover rounded-lg border border-border" />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
