import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, ShieldAlert, Trash2, Camera } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';

const AccountSettingsForm: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState('johndoe@example.com'); // Placeholder email
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setNewConfirmPassword] = useState('');

  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(user?.profilePicture || null);
  
  const [activeSection, setActiveSection] = useState<'profile' | 'password' | 'delete'>('profile');
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicFile(file);
      setProfilePicPreview(URL.createObjectURL(file));
      setFeedback({ type: '', message: '' }); // Clear previous feedback
    }
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would upload the file if profilePicFile is not null
    updateUser({ name, profilePicture: profilePicPreview || undefined });
    setFeedback({ type: 'success', message: 'Profile updated successfully!' });
    setProfilePicFile(null); // Reset file state after "upload"
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

  const confirmDeleteAccount = () => {
    alert('Account deleted successfully. Logging you out. (Simulation)');
    logout();
    navigate('/');
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
                  src={profilePicPreview || 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/72f7/1c48/1924a99473c91bfdac585c9cc9c2bc58?Expires=1762732800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=mJnJD9EzUMxuOGa0xzUEmYC0JQNIRhM704Zqs0bzBIsJ~XT-QNlVIkfzY9vZFBTayulfvYsx-2Xp~dBb3O3yYB905KQ6s0lCcnt7BaGeDk2xnx3Gp1giTw~f9AJ6Ce9t11JF4iZ2gZVd4kCv339PTlrWc~-wRUK0pS3iwo5lHuDFCFbFIHyJoj3LijnqmvnthP8QAH6Jg-5Ef8bfZKmzc~x8~LU5eMKsbqLw4UkZjmI6bWc1BW4hkxyC5rFNHICjX0w7kZFbmM92veRqLZYl5H9tLL1O-8s9WIJpKp4aRLRtAvhNeWpr6VayY8y3pdRBv9~IWhP~PPviMzw8x0lJww__'}
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
            <button onClick={() => setIsDeleteModalOpen(true)} className="bg-red-600 text-white font-bold py-3 px-8 rounded-full shadow-md hover:bg-red-700">
              I understand, delete my account
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default AccountSettingsForm;
