import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, ShieldAlert, Trash2 } from 'lucide-react';

const AccountSettingsForm: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState('johndoe@example.com'); // Placeholder email
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setNewConfirmPassword] = useState('');
  
  const [activeSection, setActiveSection] = useState<'profile' | 'password' | 'delete'>('profile');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback({ type: 'success', message: 'Profile updated successfully! (Simulation)' });
    // In a real app, you would call an API here and update the AuthContext user
  };
  
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setFeedback({ type: 'error', message: 'New passwords do not match.' });
      return;
    }
    if (newPassword.length < 6) {
      setFeedback({ type: 'error', message: 'Password must be at least 6 characters.' });
      return;
    }
    setFeedback({ type: 'success', message: 'Password changed successfully! (Simulation)' });
    // Reset fields
    setCurrentPassword('');
    setNewPassword('');
    setNewConfirmPassword('');
  };
  
  const handleDeleteAccount = () => {
    if (window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deleted successfully. Logging you out. (Simulation)');
      logout();
      navigate('/');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
      <div className="flex flex-col md:flex-row border-b mb-8">
        <button onClick={() => setActiveSection('profile')} className={`flex-1 py-4 text-lg font-semibold flex items-center justify-center gap-2 border-b-4 ${activeSection === 'profile' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-gray-500 hover:text-black'}`}>
          <User /> Profile
        </button>
        <button onClick={() => setActiveSection('password')} className={`flex-1 py-4 text-lg font-semibold flex items-center justify-center gap-2 border-b-4 ${activeSection === 'password' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-gray-500 hover:text-black'}`}>
          <ShieldAlert /> Change Password
        </button>
        <button onClick={() => setActiveSection('delete')} className={`flex-1 py-4 text-lg font-semibold flex items-center justify-center gap-2 border-b-4 ${activeSection === 'delete' ? 'border-red-500 text-red-500' : 'border-transparent text-gray-500 hover:text-black'}`}>
          <Trash2 /> Delete Account
        </button>
      </div>

      {feedback.message && (
        <div className={`p-4 mb-6 rounded-lg text-center ${feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {feedback.message}
        </div>
      )}

      {activeSection === 'profile' && (
        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
          </div>
          <div className="text-right">
            <button type="submit" className="bg-gradient-button text-white font-semibold py-3 px-8 rounded-full shadow-md hover:opacity-90">
              Save Changes
            </button>
          </div>
        </form>
      )}

      {activeSection === 'password' && (
        <form onSubmit={handlePasswordChange} className="space-y-6">
          <div>
            <label htmlFor="currentPassword"  className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input type="password" id="currentPassword" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
          </div>
          <div>
            <label htmlFor="newPassword"  className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input type="password" id="newPassword" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
          </div>
          <div>
            <label htmlFor="confirmPassword"  className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input type="password" id="confirmPassword" value={confirmPassword} onChange={e => setNewConfirmPassword(e.target.value)} className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
          </div>
          <div className="text-right">
            <button type="submit" className="bg-gradient-button text-white font-semibold py-3 px-8 rounded-full shadow-md hover:opacity-90">
              Update Password
            </button>
          </div>
        </form>
      )}

      {activeSection === 'delete' && (
        <div className="p-6 border-2 border-red-300 bg-red-50 rounded-lg">
          <h3 className="text-xl font-bold text-red-800">Danger Zone</h3>
          <p className="text-red-700 mt-2 mb-6">Deleting your account is permanent and cannot be undone. All your data, including listings and favorites, will be permanently removed.</p>
          <button onClick={handleDeleteAccount} className="bg-red-600 text-white font-bold py-3 px-8 rounded-full shadow-md hover:bg-red-700">
            I understand, delete my account
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountSettingsForm;
