import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Car } from '@/data/cars';
import { toast } from '@/components/ui/sonner';

const MAX_COMPARE = 3;

interface CompareContextType {
  compareList: Car[];
  addToCompare: (car: Car) => void;
  removeFromCompare: (carId: string) => void;
  clearCompare: () => void;
  isInCompare: (carId: string) => boolean;
  canAddMore: boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider = ({ children }: { children: ReactNode }) => {
  const [compareList, setCompareList] = useState<Car[]>([]);

  const isInCompare = useCallback(
    (carId: string) => compareList.some((c) => c.id === carId),
    [compareList]
  );

  const addToCompare = useCallback(
    (car: Car) => {
      if (isInCompare(car.id)) {
        toast.info('Already in compare list');
        return;
      }
      if (compareList.length >= MAX_COMPARE) {
        toast.warning(`You can compare up to ${MAX_COMPARE} cars`);
        return;
      }
      setCompareList((prev) => [...prev, car]);
      toast.success(`${car.brand} ${car.model} added to compare`);
    },
    [compareList, isInCompare]
  );

  const removeFromCompare = useCallback((carId: string) => {
    setCompareList((prev) => prev.filter((c) => c.id !== carId));
  }, []);

  const clearCompare = useCallback(() => {
    setCompareList([]);
  }, []);

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        canAddMore: compareList.length < MAX_COMPARE,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
};
