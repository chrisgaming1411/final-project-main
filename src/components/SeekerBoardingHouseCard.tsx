import React from 'react';
import { MapPin, Tag, Users, CheckCircle, Heart, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BoardingHouse } from '../types';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AuthContext';

interface SeekerBoardingHouseCardProps {
  house: BoardingHouse;
}

const SeekerBoardingHouseCard: React.FC<SeekerBoardingHouseCardProps> = ({ house }) => {
  const { user } = useAuth();
  const { addFavorite, removeFavorite, isFavorite, loading } = useFavorites();
  const isFavorited = isFavorite(house.id);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorited) {
      removeFavorite(house.id);
    } else {
      addFavorite(house.id);
    }
  };

  const getPriceRange = () => {
    if (house.rooms.length === 0) {
      return 'N/A';
    }
    const prices = house.rooms.map(r => parseFloat(r.price)).filter(p => !isNaN(p));
    if (prices.length === 0) {
      return 'N/A';
    }
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    if (minPrice === maxPrice) {
      return `₱${minPrice.toLocaleString()}`;
    }
    return `₱${minPrice.toLocaleString()} - ₱${maxPrice.toLocaleString()}`;
  };

  const allInclusions = [...new Set(house.rooms.flatMap(r => r.inclusions))];

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 relative">
      {user?.type === 'seeker' && (
        <button
          onClick={handleToggleFavorite}
          disabled={loading}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors z-10 disabled:opacity-50 ${isFavorited ? 'bg-red-500 text-white' : 'bg-white/70 text-gray-600 hover:text-red-500'}`}
          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          {loading ? <Loader2 className="animate-spin" size={22} /> : <Heart fill={isFavorited ? 'currentColor' : 'none'} size={22} />}
        </button>
      )}
      <img
        src={house.imageUrl}
        alt={house.name}
        className="w-full md:w-1/3 h-56 md:h-auto object-cover"
      />
      <div className="p-6 flex flex-col flex-1">
        <div>
          <h2 className="text-2xl font-bold text-brand-teal mb-1">{house.name}</h2>
          <p className="flex items-center gap-2 text-gray-600 mb-4">
            <MapPin size={16} /> {house.address}
          </p>
          <p className="text-gray-700 mb-4 text-sm leading-relaxed">
            {house.description.length > 150 ? `${house.description.substring(0, 150)}...` : house.description}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mb-4 text-sm">
            <div className="flex items-center gap-2">
              <Tag size={16} className="text-brand-blue" />
              <span className="font-semibold">Price Range:</span> {getPriceRange()}
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} className="text-brand-blue" />
              <span className="font-semibold">{house.availableRooms} Room(s) Available</span>
            </div>
          </div>
          {allInclusions.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">Common Inclusions:</h4>
              <div className="flex flex-wrap gap-2">
                {allInclusions.slice(0, 4).map(inc => (
                  <span key={inc} className="bg-brand-light-cyan text-brand-teal text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle size={12}/> {inc}
                  </span>
                ))}
                {allInclusions.length > 4 && (
                    <span className="text-xs text-gray-500 self-center">+{allInclusions.length - 4} more</span>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="mt-auto pt-4 text-right">
          <Link to={`/listing/${house.id}`}>
            <button className="bg-gradient-button text-white font-semibold py-2 px-6 rounded-full shadow-md hover:opacity-90 transition-opacity">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SeekerBoardingHouseCard;
