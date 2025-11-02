import React from 'react';

interface BoardingHouse {
  id: number;
  name: string;
  availableRooms: number;
  imageUrl: string;
}

interface BoardingHouseCardProps {
  house: BoardingHouse;
}

const BoardingHouseCard: React.FC<BoardingHouseCardProps> = ({ house }) => {
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
      <div className="flex items-center space-x-4">
        <button className="text-brand-cyan-border font-semibold text-lg py-2 px-10 rounded-full border border-brand-gray-text hover:bg-gray-100 transition-colors">
          Edit
        </button>
        <button className="bg-brand-cyan-border text-white font-semibold text-lg py-2 px-8 rounded-full hover:opacity-90 transition-opacity">
          Delete
        </button>
      </div>
    </div>
  );
};

export default BoardingHouseCard;
