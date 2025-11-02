import React, { useState, useMemo } from 'react';
import { useBoardingHouses } from '../contexts/BoardingHouseContext';
import FilterSidebar from '../components/FilterSidebar';
import SeekerBoardingHouseCard from '../components/SeekerBoardingHouseCard';
import { Search } from 'lucide-react';

const FindBoardinghousePage: React.FC = () => {
  const { boardingHouses } = useBoardingHouses();
  const [filters, setFilters] = useState({
    searchTerm: '',
    priceMin: '',
    priceMax: '',
    inclusions: [] as string[],
  });

  const filteredHouses = useMemo(() => {
    return boardingHouses.filter(house => {
      // Search Term Filter
      const searchTermLower = filters.searchTerm.toLowerCase();
      const matchesSearch =
        searchTermLower === '' ||
        house.name.toLowerCase().includes(searchTermLower) ||
        house.address.toLowerCase().includes(searchTermLower) ||
        house.description.toLowerCase().includes(searchTermLower);

      if (!matchesSearch) return false;

      // Price Filter
      const priceMin = parseFloat(filters.priceMin);
      const priceMax = parseFloat(filters.priceMax);
      const matchesPrice = house.rooms.some(room => {
        const roomPrice = parseFloat(room.price);
        if (isNaN(roomPrice)) return false;
        const minMatch = isNaN(priceMin) || roomPrice >= priceMin;
        const maxMatch = isNaN(priceMax) || roomPrice <= priceMax;
        return minMatch && maxMatch;
      });
      // If no rooms, it can't match a price filter. If no price filter, it passes.
      if (house.rooms.length === 0 && (!isNaN(priceMin) || !isNaN(priceMax))) return false;
      if (house.rooms.length > 0 && !matchesPrice && (!isNaN(priceMin) || !isNaN(priceMax))) return false;

      // Inclusions Filter
      const matchesInclusions = filters.inclusions.every(requiredInc =>
        house.rooms.some(room => room.inclusions.includes(requiredInc))
      );
      if (filters.inclusions.length > 0 && !matchesInclusions) return false;
      
      return true;
    });
  }, [boardingHouses, filters]);

  return (
    <div className="bg-brand-light-gray">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-brand-dark-navy mb-8 text-center">
          Find Your Next Home
        </h1>
        <div className="flex flex-col md:flex-row gap-8">
          <FilterSidebar filters={filters} setFilters={setFilters} />
          <div className="w-full md:flex-1">
            <div className="mb-6 text-lg text-gray-600">
              Showing <span className="font-bold text-brand-blue">{filteredHouses.length}</span> of <span className="font-bold text-brand-dark-navy">{boardingHouses.length}</span> properties.
            </div>
            {filteredHouses.length > 0 ? (
              <div className="space-y-6">
                {filteredHouses.map(house => (
                  <SeekerBoardingHouseCard key={house.id} house={house} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl shadow-md flex flex-col items-center">
                <Search size={64} className="text-gray-300 mb-4" />
                <h3 className="text-2xl font-semibold text-brand-dark-navy">No Properties Found</h3>
                <p className="text-gray-500 mt-2 max-w-sm">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindBoardinghousePage;
