import React from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useBoardingHouses } from '../../contexts/BoardingHouseContext';
import SeekerBoardingHouseCard from '../../components/SeekerBoardingHouseCard';

const SeekerFavoritesPage: React.FC = () => {
  const { favoriteIds } = useFavorites();
  const { boardingHouses } = useBoardingHouses();

  const favoriteHouses = boardingHouses.filter(house => favoriteIds.includes(house.id));

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h1 className="text-4xl sm:text-5xl font-bold text-black mb-10">
        My Favorites
      </h1>
      
      {favoriteHouses.length > 0 ? (
        <div className="space-y-6">
          {favoriteHouses.map(house => (
            <SeekerBoardingHouseCard key={house.id} house={house} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl shadow-md flex flex-col items-center">
          <Heart size={64} className="text-gray-300 mb-4" />
          <h3 className="text-2xl font-semibold text-brand-dark-navy">No Favorites Yet</h3>
          <p className="text-gray-500 mt-2 max-w-sm">
            Click the heart icon on a listing to save it here for later.
          </p>
        </div>
      )}
    </div>
  );
};

export default SeekerFavoritesPage;
