import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, ShieldAlert, Trash2, Camera } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';
import { supabase } from '../supabaseClient';

const AccountSettingsForm: React.FC = () => {
  const { user, logout, updateUser, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setNewConfirmPassword] = useState('');

  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
  
  const [activeSection, setActiveSection] = useState<'profile' | 'password' | 'delete'>('profile');
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setProfilePicPreview(user.profilePicture || null);
    }
    const sessionUser = supabase.auth.getUser();
    sessionUser.then(res => {
      if (res.data.user) {
        setEmail(res.data.user.email || '');
      }
    });
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicFile(file);
      setProfilePicPreview(URL.createObjectURL(file));
      setFeedback({ type: '', message: '' });
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: '', message: '' });

    const { error } = await updateUser({ name, newAvatarFile: profilePicFile || undefined });
    
    setLoading(false);
    if (error) {
      setFeedback({ type: 'error', message: error });
    } else {
      setFeedback({ type: 'success', message: 'Profile updated successfully!' });
      setProfilePicFile(null);
    }
  };
  
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setFeedback({ type: 'error', message: 'New passwords do not match.' });
      return;
    }
    if (newPassword.length < 6) {
      setFeedback({ type: 'error', message: 'Password must be at least 6 characters.' });
      return;
    }
    setLoading(true);
    setFeedback({ type: '', message: '' });

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    
    setLoading(false);
    if (error) {
      setFeedback({ type: 'error', message: error.message });
    } else {
      setFeedback({ type: 'success', message: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setNewConfirmPassword('');
    }
  };

  const confirmDeleteAccount = async () => {
    setLoading(true);
    const { error } = await deleteAccount();
    setLoading(false);
    if (error) {
      setFeedback({ type: 'error', message: error });
    } else {
      alert('Account deleted successfully. Logging you out.');
      navigate('/');
    }
  };

  return (
    <>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteAccount}
        title="Delete Account"
        message="Are you absolutely sure you want to delete your account? This action is permanent and cannot be undone."
        confirmButtonText="Yes, Delete It"
        confirmButtonVariant="danger"
      />
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
            <div className="flex flex-col sm:flex-row items-center gap-6 border-b pb-8 mb-6">
              <div className="relative">
                <img
                  src={profilePicPreview || `https://api.dicebear.com/8.x/initials/svg?seed=${name || 'U'}`}
                  alt="Profile Avatar"
                  className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-brand-blue text-white p-2 rounded-full hover:bg-brand-darker-blue transition-colors shadow-md"
                  aria-label="Change profile picture"
                >
                  <Camera size={18} />
                </button>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-2xl font-bold text-brand-dark-navy">{user?.name || 'User'}</h3>
                <p className="text-gray-500 capitalize">{user?.type} Account</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/png, image/jpeg, image/gif"
                />
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" id="email" value={email} disabled className="w-full p-3 rounded-lg border border-gray-300 bg-gray-100 cursor-not-allowed" />
            </div>
            <div className="text-right">
              <button type="submit" className="bg-gradient-button text-white font-semibold py-3 px-8 rounded-full shadow-md hover:opacity-90 disabled:opacity-50" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

        {activeSection === 'password' && (
          <form onSubmit={handlePasswordChange} className="space-y-6">
            {/* Current password not needed for Supabase password update for security reasons */}
            <div>
              <label htmlFor="newPassword"  className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input type="password" id="newPassword" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
            </div>
            <div>
              <label htmlFor="confirmPassword"  className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input type="password" id="confirmPassword" value={confirmPassword} onChange={e => setNewConfirmPassword(e.target.value)} className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
            </div>
            <div className="text-right">
              <button type="submit" className="bg-gradient-button text-white font-semibold py-3 px-8 rounded-full shadow-md hover:opacity-90 disabled:opacity-50" disabled={loading}>
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        )}

        {activeSection === 'delete' && (
          <div className="p-6 border-2 border-red-300 bg-red-50 rounded-lg">
            <h3 className="text-xl font-bold text-red-800">Danger Zone</h3>
            <p className="text-red-700 mt-2 mb-6">Deleting your account is permanent and cannot be undone. All your data, including listings and favorites, will be permanently removed.</p>
            <button onClick={() => setIsDeleteModalOpen(true)} className="bg-red-600 text-white font-bold py-3 px-8 rounded-full shadow-md hover:bg-red-700 disabled:opacity-50" disabled={loading}>
              {loading ? 'Deleting...' : 'I understand, delete my account'}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default AccountSettingsForm;
