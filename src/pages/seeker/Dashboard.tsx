import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const SeekerDashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h1 className="text-4xl sm:text-5xl font-bold text-black mb-4">
        Welcome, {user?.name || 'Seeker'}!
      </h1>
      <p className="text-lg text-gray-600 mb-10">
        Your journey to find the perfect boarding house starts here.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-brand-teal mb-4">Ready to Explore?</h2>
          <p className="text-gray-600 mb-6">
            Search, filter, and compare hundreds of listings to find your ideal home.
          </p>
          <Link to="/find">
            <button className="bg-gradient-button text-white font-semibold text-lg py-3 px-10 rounded-full shadow-lg hover:opacity-90 transition-opacity">
              Find a Place Now
            </button>
          </Link>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-brand-teal mb-4">Your Favorites</h2>
          <p className="text-gray-600 mb-6">
            Keep track of the places you love. Your saved listings will appear here.
          </p>
          <Link to="/seeker-dashboard/favorites">
            <button className="bg-gradient-add-button text-white font-semibold text-lg py-3 px-10 rounded-full shadow-lg hover:opacity-90 transition-opacity">
              View My Favorites
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SeekerDashboardPage;
