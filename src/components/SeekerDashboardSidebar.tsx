import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Heart, Search, Settings, LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const navLinks = [
  { name: 'Dashboard', href: '/seeker-dashboard', icon: LayoutDashboard },
  { name: 'Find a Place', href: '/seeker-dashboard/find', icon: Search },
  { name: 'My Favorites', href: '/seeker-dashboard/favorites', icon: Heart },
  { name: 'Account Settings', href: '/seeker-dashboard/settings', icon: Settings },
];

const SeekerDashboardSidebar: React.FC = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-80 bg-white text-black hidden md:flex flex-col shadow-2xl rounded-r-[50px]">
      <div className="p-8 flex-1 flex flex-col">
        <button onClick={() => navigate('/')} className="self-start mb-10 text-brand-gray-text hover:text-black">
          <ArrowLeft size={24} />
        </button>

        <div className="flex items-center space-x-4 mb-16">
          <img
            src="https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/72f7/1c48/1924a99473c91bfdac585c9cc9c2bc58?Expires=1762732800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=mJnJD9EzUMxuOGa0xzUEmYC0JQNIRhM704Zqs0bzBIsJ~XT-QNlVIkfzY9vZFBTayulfvYsx-2Xp~dBb3O3yYB905KQ6s0lCcnt7BaGeDk2xnx3Gp1giTw~f9AJ6Ce9t11JF4iZ2gZVd4kCv339PTlrWc~-wRUK0pS3iwo5lHuDFCFbFIHyJoj3LijnqmvnthP8QAH6Jg-5Ef8bfZKmzc~x8~LU5eMKsbqLw4UkZjmI6bWc1BW4hkxyC5rFNHICjX0w7kZFbmM92veRqLZYl5H9tLL1O-8s9WIJpKp4aRLRtAvhNeWpr6VayY8y3pdRBv9~IWhP~PPviMzw8x0lJww__"
            alt="User Avatar"
            className="w-20 h-20 rounded-full"
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
              end={link.href === '/seeker-dashboard'}
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
            onClick={handleLogout}
            className="flex items-center space-x-4 px-6 py-4 w-full rounded-full text-lg text-brand-gray-text hover:bg-brand-light-cyan transition-colors duration-300"
          >
            <LogOut className="w-6 h-6" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default SeekerDashboardSidebar;
