import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBoardingHouses } from '../contexts/BoardingHouseContext';
import { BoardingHouse } from '../types';

interface BoardingHouseCardProps {
  house: BoardingHouse;
}

const BoardingHouseCard: React.FC<BoardingHouseCardProps> = ({ house }) => {
  const navigate = useNavigate();
  const { deleteBoardingHouse } = useBoardingHouses();

  const handleEdit = () => {
    navigate(`/dashboard/edit-listing/${house.id}`);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${house.name}"?`)) {
      deleteBoardingHouse(house.id);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8 transition-transform transform hover:scale-[1.02]">
      <img
        src={house.imageUrl}
        alt={house.name}
        className="w-full md:w-64 h-48 object-cover rounded-2xl shadow-md"
      />
      <div className="flex-1 text-center md:text-left">
        <h2 className="text-3xl font-bold text-brand-teal mb-2">{house.name}</h2>
        <p className="text-lg text-black mb-6">Available Rooms : {house.availableRooms}</p>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button 
          onClick={() => navigate(`/listing/${house.id}`)}
          className="bg-gradient-button text-white font-semibold text-md py-2 px-6 rounded-full hover:opacity-90 transition-opacity w-full sm:w-auto"
        >
          Details
        </button>
        <button 
          onClick={handleEdit}
          className="text-brand-cyan-border font-semibold text-md py-2 px-6 rounded-full border border-brand-gray-text hover:bg-gray-100 transition-colors w-full sm:w-auto"
        >
          Edit
        </button>
        <button 
          onClick={handleDelete}
          className="bg-red-500 text-white font-semibold text-md py-2 px-6 rounded-full hover:bg-red-600 transition-opacity w-full sm:w-auto"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default BoardingHouseCard;
