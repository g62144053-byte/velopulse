import { Link } from 'react-router-dom';
import { ArrowLeft, X, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCompare } from '@/contexts/CompareContext';
import { formatPrice } from '@/data/cars';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const specRows = [
  { label: 'Price', key: 'price', format: (v: number) => formatPrice(v) },
  { label: 'Year', key: 'year', format: (v: number) => v },
  { label: 'Brand', key: 'brand', format: (v: string) => v },
  { label: 'Model', key: 'model', format: (v: string) => v },
  { label: 'Category', key: 'category', format: (v: string) => v },
  { label: 'Fuel', key: 'fuel', format: (v: string) => v },
  { label: 'Transmission', key: 'transmission', format: (v: string) => v },
  { label: 'Engine', key: 'engine', format: (v: string) => v },
  { label: 'Power', key: 'power', format: (v: string) => v },
  { label: 'Mileage', key: 'mileage', format: (v: string) => v },
  { label: 'Seating', key: 'seating', format: (v: number) => `${v} seats` },
];

const Compare = () => {
  const { compareList, removeFromCompare } = useCompare();

  if (compareList.length === 0) {
    return (
      <main className="min-h-screen bg-background pt-24 pb-12">
        <div className="container mx-auto px-4 text-center">
          <Scale className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">No Cars to Compare</h1>
          <p className="text-muted-foreground mb-8">
            Add cars to your compare list from the car listings page.
          </p>
          <Button variant="hero" asChild>
            <Link to="/cars">Browse Cars</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to="/cars" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Cars
            </Link>
          </Button>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Compare Cars
          </h1>
          <p className="text-muted-foreground mt-2">
            Side-by-side comparison of {compareList.length} car{compareList.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-gradient-card rounded-2xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border">
                  <TableHead className="w-40 bg-muted/50 font-semibold">Specification</TableHead>
                  {compareList.map((car) => (
                    <TableHead key={car.id} className="min-w-[200px] relative">
                      <div className="space-y-3">
                        <button
                          onClick={() => removeFromCompare(car.id)}
                          className="absolute top-2 right-2 p-1 rounded-full bg-muted hover:bg-destructive hover:text-destructive-foreground transition-colors"
                          aria-label={`Remove ${car.brand} ${car.model}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <img
                          src={car.image}
                          alt={`${car.brand} ${car.model}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div>
                          <p className="text-xs text-primary uppercase tracking-wider">{car.brand}</p>
                          <p className="font-display font-bold text-foreground">{car.model}</p>
                        </div>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {specRows.map((row) => (
                  <TableRow key={row.key} className="border-b border-border">
                    <TableCell className="font-medium text-muted-foreground bg-muted/30">
                      {row.label}
                    </TableCell>
                    {compareList.map((car) => {
                      const value = car[row.key as keyof typeof car];
                      return (
                        <TableCell key={car.id} className="text-foreground">
                          {row.format(value as never)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-center gap-4">
          <Button variant="heroOutline" asChild>
            <Link to="/cars">Add More Cars</Link>
          </Button>
          <Button variant="hero" asChild>
            <Link to="/contact">Get Quote</Link>
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Compare;
