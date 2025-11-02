import React from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

const ALL_INCLUSIONS = ["Bed", "Cabinet", "Aircon", "Wi-Fi", "Private CR"];

interface FilterSidebarProps {
  filters: {
    searchTerm: string;
    priceMin: string;
    priceMax: string;
    inclusions: string[];
  };
  setFilters: React.Dispatch<React.SetStateAction<any>>;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, setFilters }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleInclusionChange = (inclusion: string) => {
    setFilters((prev: any) => {
      const newInclusions = prev.inclusions.includes(inclusion)
        ? prev.inclusions.filter((i: string) => i !== inclusion)
        : [...prev.inclusions, inclusion];
      return { ...prev, inclusions: newInclusions };
    });
  };
  
  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      priceMin: '',
      priceMax: '',
      inclusions: [],
    });
  };

  return (
    <aside className="w-full md:w-80 lg:w-96 bg-white p-6 rounded-2xl shadow-lg h-fit">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-brand-dark-navy flex items-center gap-2">
          <SlidersHorizontal size={24} />
          Filters
        </h2>
        <button onClick={resetFilters} className="text-sm text-brand-blue hover:underline flex items-center gap-1">
          <RotateCcw size={14}/>
          Reset
        </button>
      </div>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-1">
            Search by Name or Location
          </label>
          <input
            type="text"
            name="searchTerm"
            id="searchTerm"
            placeholder="e.g., 'Urban Nest' or 'Cebu City'"
            value={filters.searchTerm}
            onChange={handleInputChange}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price Range (per month)</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              name="priceMin"
              placeholder="Min"
              value={filters.priceMin}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              name="priceMax"
              placeholder="Max"
              value={filters.priceMax}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Room Inclusions</label>
          <div className="grid grid-cols-2 gap-2">
            {ALL_INCLUSIONS.map(item => (
              <label key={item} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.inclusions.includes(item)}
                  onChange={() => handleInclusionChange(item)}
                  className="h-4 w-4 rounded text-brand-blue focus:ring-brand-blue"
                />
                <span className="text-sm">{item}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
