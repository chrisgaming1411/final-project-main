import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Home, PlusCircle, Settings, LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ConfirmationModal from './ConfirmationModal';

const navLinks = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Boardinghouse', href: '/dashboard/my-boardinghouse', icon: Home },
  { name: 'Add New', href: '/dashboard/add-new', icon: PlusCircle },
  { name: 'Account Settings', href: '/dashboard/settings', icon: Settings },
];

const DashboardSidebar: React.FC = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const confirmLogout = async () => {
    await logout();
    setIsLogoutModalOpen(false);
    navigate('/login');
  };

  return (
    <>
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        confirmButtonText="Logout"
      />
      <aside className="w-80 bg-white text-black hidden md:flex flex-col shadow-2xl rounded-r-[50px]">
        <div className="p-8 flex-1 flex flex-col">
          <button onClick={() => navigate(-1)} className="self-start mb-10 text-brand-gray-text hover:text-black">
            <ArrowLeft size={24} />
          </button>

          <div className="flex items-center space-x-4 mb-16">
            <img
              src={user?.profilePicture || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.name || 'U'}`}
              alt="User Avatar"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <p className="font-black text-xl">{user?.name || 'User'}</p>
              <p className="text-md font-extralight capitalize">{user?.type || ''}</p>
            </div>
          </div>

          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                end={link.href === '/dashboard'}
                className={({ isActive }) =>
                  `flex items-center space-x-4 px-6 py-4 rounded-full text-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-brand-cyan-border text-white shadow-lg'
                      : 'text-brand-gray-text hover:bg-brand-light-cyan'
                  }`
                }
              >
                <link.icon className="w-6 h-6" />
                <span className="font-medium">{link.name}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto">
            <hr className="border-t border-gray-200 my-6" />
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="flex items-center space-x-4 px-6 py-4 w-full rounded-full text-lg text-brand-gray-text hover:bg-brand-light-cyan transition-colors duration-300"
            >
              <LogOut className="w-6 h-6" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
