import React from 'react';
import { ArrowLeft, Plus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BoardingHouseCard from '../../components/BoardingHouseCard';
import { useBoardingHouses } from '../../contexts/BoardingHouseContext';
import { useAuth } from '../../contexts/AuthContext';

const MyBoardinghousePage: React.FC = () => {
  const navigate = useNavigate();
  const { boardingHouses, loading } = useBoardingHouses();
  const { user } = useAuth();

  const myBoardingHouses = boardingHouses.filter(house => house.ownerName === user?.name);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
        <div className="flex items-center space-x-4 mb-6 sm:mb-0">
          <button onClick={() => navigate(-1)} className="text-black hover:text-gray-600">
            <ArrowLeft size={32} />
          </button>
          <h1 className="text-4xl sm:text-5xl font-bold text-black">My Boardinghouse</h1>
        </div>
        <button 
          onClick={() => navigate('/dashboard/add-new')}
          className="bg-gradient-add-button text-white font-semibold text-lg py-4 px-8 rounded-full shadow-lg hover:opacity-90 transition-opacity flex items-center space-x-2"
        >
          <Plus size={24} />
          <span>Add</span>
        </button>
      </div>

      <div className="space-y-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-brand-blue" size={48} />
          </div>
        ) : myBoardingHouses.length > 0 ? (
          myBoardingHouses.map((house) => (
            <BoardingHouseCard key={house.id} house={house} />
          ))
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md">
            <h3 className="text-2xl font-semibold text-brand-dark-navy">No Boardinghouses Yet</h3>
            <p className="text-gray-500 mt-2">Click the "Add" button to create your first listing.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBoardinghousePage;
