import { useState, useMemo, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { CarCard } from '@/components/CarCard';
import { Button } from '@/components/ui/button';
import { cars, brands, fuelTypes, priceRanges } from '@/data/cars';
import { cn } from '@/lib/utils';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const CARS_PER_PAGE = 9;

const Cars = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedFuel, setSelectedFuel] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);
  const [showFilters, setShowFilters] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsHeaderVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const matchesSearch =
        car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.model.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBrand = selectedBrand === 'All' || car.brand === selectedBrand;
      const matchesFuel = selectedFuel === 'All' || car.fuel === selectedFuel;
      const matchesPrice =
        car.price >= selectedPriceRange.min && car.price <= selectedPriceRange.max;

      return matchesSearch && matchesBrand && matchesFuel && matchesPrice;
    });
  }, [searchQuery, selectedBrand, selectedFuel, selectedPriceRange]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredCars.length / CARS_PER_PAGE);
  const startIndex = (currentPage - 1) * CARS_PER_PAGE;
  const paginatedCars = filteredCars.slice(startIndex, startIndex + CARS_PER_PAGE);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedBrand, selectedFuel, selectedPriceRange]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedBrand('All');
    setSelectedFuel('All');
    setSelectedPriceRange(priceRanges[0]);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery || selectedBrand !== 'All' || selectedFuel !== 'All' || selectedPriceRange.label !== 'All';

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 'ellipsis', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages);
      }
    }
    return pages;
  };

  return (
    <main className="min-h-screen bg-background pt-20">
      {/* Header */}
      <div
        ref={headerRef}
        className="bg-gradient-hero py-16 border-b border-border"
      >
        <div className="container mx-auto px-4">
          <div className={`transition-all duration-700 ${isHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-2">
              Our Collection
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Explore Our
              <span className="text-gradient-gold ml-3">Cars</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Browse through our extensive collection of premium Indian automobiles. Use filters to find your perfect match.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search and Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by brand or model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            />
          </div>

          {/* Filter Toggle (Mobile) */}
          <Button
            variant="heroOutline"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2"
          >
            <SlidersHorizontal className="w-5 h-5" />
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-primary" />
            )}
          </Button>
        </div>

        {/* Filters */}
        <div
          className={cn(
            'grid gap-4 mb-8 transition-all duration-300 overflow-hidden',
            showFilters ? 'max-h-96 opacity-100' : 'max-h-0 lg:max-h-96 opacity-0 lg:opacity-100',
            'lg:grid-cols-4'
          )}
        >
          {/* Brand Filter */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block uppercase tracking-wide">Brand</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 cursor-pointer"
            >
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          {/* Fuel Filter */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block uppercase tracking-wide">Fuel Type</label>
            <select
              value={selectedFuel}
              onChange={(e) => setSelectedFuel(e.target.value)}
              className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 cursor-pointer"
            >
              {fuelTypes.map((fuel) => (
                <option key={fuel} value={fuel}>
                  {fuel}
                </option>
              ))}
            </select>
          </div>

          {/* Price Filter */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block uppercase tracking-wide">Price Range</label>
            <select
              value={selectedPriceRange.label}
              onChange={(e) =>
                setSelectedPriceRange(priceRanges.find((r) => r.label === e.target.value) || priceRanges[0])
              }
              className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 cursor-pointer"
            >
              {priceRanges.map((range) => (
                <option key={range.label} value={range.label}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <Button
              variant="ghost"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className="w-full flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing <span className="text-foreground font-semibold">{startIndex + 1}-{Math.min(startIndex + CARS_PER_PAGE, filteredCars.length)}</span> of <span className="text-foreground font-semibold">{filteredCars.length}</span> vehicles
          </p>
        </div>

        {/* Car Grid */}
        {paginatedCars.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedCars.map((car, index) => (
                <div
                  key={car.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CarCard car={car} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                        className={cn(
                          "cursor-pointer",
                          currentPage === 1 && "pointer-events-none opacity-50"
                        )}
                      />
                    </PaginationItem>
                    
                    {getPageNumbers().map((page, index) => (
                      <PaginationItem key={index}>
                        {page === 'ellipsis' ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            onClick={() => handlePageChange(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                        className={cn(
                          "cursor-pointer",
                          currentPage === totalPages && "pointer-events-none opacity-50"
                        )}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No cars found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your filters or search query</p>
            <Button variant="hero" onClick={clearFilters}>
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Cars;
