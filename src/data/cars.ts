export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  fuel: 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid';
  transmission: 'Manual' | 'Automatic' | 'AMT' | 'CVT' | 'DCT';
  mileage: string;
  engine: string;
  power: string;
  seating: number;
  image: string;
  featured: boolean;
  category: 'Hatchback' | 'Sedan' | 'SUV' | 'MUV' | 'Compact SUV';
}

export const cars: Car[] = [
  {
    id: '1',
    brand: 'Tata',
    model: 'Nexon EV',
    year: 2024,
    price: 1499000,
    fuel: 'Electric',
    transmission: 'Automatic',
    mileage: '312 km range',
    engine: '30.2 kWh Battery',
    power: '129 PS',
    seating: 5,
    image: 'https://images.unsplash.com/photo-1617886322168-72b886573c35?w=800&q=80',
    featured: true,
    category: 'Compact SUV'
  },
  {
    id: '2',
    brand: 'Maruti Suzuki',
    model: 'Brezza',
    year: 2024,
    price: 899000,
    fuel: 'Petrol',
    transmission: 'Manual',
    mileage: '17.38 km/l',
    engine: '1462 cc',
    power: '103 PS',
    seating: 5,
    image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80',
    featured: true,
    category: 'Compact SUV'
  },
  {
    id: '3',
    brand: 'Hyundai',
    model: 'Creta',
    year: 2024,
    price: 1199000,
    fuel: 'Diesel',
    transmission: 'Automatic',
    mileage: '21.4 km/l',
    engine: '1493 cc',
    power: '116 PS',
    seating: 5,
    image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&q=80',
    featured: true,
    category: 'SUV'
  },
  {
    id: '4',
    brand: 'Mahindra',
    model: 'Thar',
    year: 2024,
    price: 1399000,
    fuel: 'Diesel',
    transmission: 'Manual',
    mileage: '15.2 km/l',
    engine: '2184 cc',
    power: '130 PS',
    seating: 4,
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80',
    featured: true,
    category: 'SUV'
  },
  {
    id: '5',
    brand: 'Kia',
    model: 'Seltos',
    year: 2024,
    price: 1149000,
    fuel: 'Petrol',
    transmission: 'DCT',
    mileage: '16.8 km/l',
    engine: '1497 cc',
    power: '140 PS',
    seating: 5,
    image: 'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=800&q=80',
    featured: true,
    category: 'SUV'
  },
  {
    id: '6',
    brand: 'Toyota',
    model: 'Fortuner',
    year: 2024,
    price: 3599000,
    fuel: 'Diesel',
    transmission: 'Automatic',
    mileage: '14.4 km/l',
    engine: '2755 cc',
    power: '204 PS',
    seating: 7,
    image: 'https://images.unsplash.com/photo-1625231334168-25fa67a81c80?w=800&q=80',
    featured: false,
    category: 'SUV'
  },
  {
    id: '7',
    brand: 'Honda',
    model: 'City',
    year: 2024,
    price: 1199000,
    fuel: 'Petrol',
    transmission: 'CVT',
    mileage: '18.4 km/l',
    engine: '1498 cc',
    power: '121 PS',
    seating: 5,
    image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&q=80',
    featured: false,
    category: 'Sedan'
  },
  {
    id: '8',
    brand: 'Tata',
    model: 'Harrier',
    year: 2024,
    price: 1599000,
    fuel: 'Diesel',
    transmission: 'Automatic',
    mileage: '16.35 km/l',
    engine: '1956 cc',
    power: '170 PS',
    seating: 5,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80',
    featured: false,
    category: 'SUV'
  },
  {
    id: '9',
    brand: 'Maruti Suzuki',
    model: 'Swift',
    year: 2024,
    price: 649000,
    fuel: 'Petrol',
    transmission: 'AMT',
    mileage: '22.56 km/l',
    engine: '1197 cc',
    power: '90 PS',
    seating: 5,
    image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80',
    featured: false,
    category: 'Hatchback'
  },
  {
    id: '10',
    brand: 'Hyundai',
    model: 'i20',
    year: 2024,
    price: 749000,
    fuel: 'Petrol',
    transmission: 'Manual',
    mileage: '20.35 km/l',
    engine: '1197 cc',
    power: '88 PS',
    seating: 5,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
    featured: false,
    category: 'Hatchback'
  },
  {
    id: '11',
    brand: 'Mahindra',
    model: 'XUV700',
    year: 2024,
    price: 1399000,
    fuel: 'Diesel',
    transmission: 'Automatic',
    mileage: '16 km/l',
    engine: '2184 cc',
    power: '185 PS',
    seating: 7,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
    featured: true,
    category: 'SUV'
  },
  {
    id: '12',
    brand: 'Kia',
    model: 'Sonet',
    year: 2024,
    price: 799000,
    fuel: 'Diesel',
    transmission: 'AMT',
    mileage: '24.1 km/l',
    engine: '1493 cc',
    power: '100 PS',
    seating: 5,
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80',
    featured: false,
    category: 'Compact SUV'
  },
];

export const brands = ['All', 'Maruti Suzuki', 'Tata', 'Hyundai', 'Mahindra', 'Kia', 'Toyota', 'Honda'];
export const fuelTypes = ['All', 'Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'];
export const priceRanges = [
  { label: 'All', min: 0, max: Infinity },
  { label: 'Under ₹8 Lakh', min: 0, max: 800000 },
  { label: '₹8-12 Lakh', min: 800000, max: 1200000 },
  { label: '₹12-20 Lakh', min: 1200000, max: 2000000 },
  { label: 'Above ₹20 Lakh', min: 2000000, max: Infinity },
];

export const formatPrice = (price: number): string => {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)} Cr`;
  } else if (price >= 100000) {
    return `₹${(price / 100000).toFixed(2)} Lakh`;
  }
  return `₹${price.toLocaleString('en-IN')}`;
};
