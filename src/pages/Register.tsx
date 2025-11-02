import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState<'owner' | 'seeker'>('owner');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!name || !email) {
      setError('Please fill in all fields.');
      return;
    }
    
    setLoading(true);

    const { error: signUpError } = await signUp({
      email,
      name,
      type: userType,
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError);
    } else {
      setMessage('Registration successful! Redirecting to your dashboard...');
      setTimeout(() => {
        if (userType === 'owner') {
          navigate('/dashboard');
        } else {
          navigate('/seeker-dashboard');
        }
      }, 2000);
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-5xl md:text-6xl font-semibold text-black mb-12">Create Account</h1>
      <form onSubmit={handleSubmit} noValidate className="space-y-6 md:space-y-8">
        <div className="relative">
          <input
            type="text"
            id="name"
            placeholder="Full Name"
            className="w-full px-8 py-5 text-xl md:text-2xl bg-brand-off-white text-brand-gray-text placeholder-brand-gray-text rounded-full border-2 border-brand-cyan-border focus:outline-none focus:ring-2 focus:ring-brand-blue shadow-[0px_4px_4px_0px_rgba(85,225,247,0.25)]"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="relative">
          <input
            type="email"
            id="email"
            placeholder="Email Address"
            className="w-full px-8 py-5 text-xl md:text-2xl bg-brand-off-white text-brand-gray-text placeholder-brand-gray-text rounded-full border-2 border-brand-cyan-border focus:outline-none focus:ring-2 focus:ring-brand-blue shadow-[0px_4px_4px_0px_rgba(85,225,247,0.25)]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="relative">
          <select
            id="userType"
            className="w-full px-8 py-5 text-xl md:text-2xl bg-brand-off-white text-black rounded-full border-2 border-brand-cyan-border focus:outline-none focus:ring-2 focus:ring-brand-blue appearance-none shadow-[0px_4px_4px_0px_rgba(85,225,247,0.25)]"
            value={userType}
            onChange={(e) => setUserType(e.target.value as 'owner' | 'seeker')}
          >
            <option value="owner">I'm an Owner</option>
            <option value="seeker">I'm a Seeker</option>
          </select>
          <ChevronDown className="absolute right-8 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={30} />
        </div>
        
        {error && <p className="text-red-500 text-center text-lg">{error}</p>}
        {message && <p className="text-green-500 text-center text-lg">{message}</p>}

        <button
          type="submit"
          className="w-full bg-gradient-button text-white font-semibold text-2xl py-5 rounded-full shadow-lg hover:opacity-90 transition-opacity transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'CREATING ACCOUNT...' : 'REGISTER'}
        </button>

        <p className="text-center text-black text-xl pt-4">
          Already have an account? <Link to="/login" className="hover:underline font-semibold">Login Instead</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
