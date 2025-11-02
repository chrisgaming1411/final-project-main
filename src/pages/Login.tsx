import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.type === 'owner') {
        navigate('/dashboard');
      } else {
        navigate('/seeker-dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email) {
      setError('Please enter your email address.');
      setLoading(false);
      return;
    }
    
    const { error: loginError } = await login({ email });
    setLoading(false);

    if (loginError) {
      setError(loginError);
    }
    // Successful login is handled by the useEffect hook
  };

  return (
    <div className="w-full">
      <h1 className="text-5xl md:text-6xl font-semibold text-black mb-12">Welcome Back!</h1>
      <form onSubmit={handleSubmit} noValidate className="space-y-6 md:space-y-8">
        <div className="relative">
          <input
            type="email"
            id="email"
            placeholder="Email Address (this is your username)"
            className="w-full px-8 py-5 text-xl md:text-2xl bg-brand-off-white text-brand-gray-text placeholder-brand-gray-text rounded-full border-2 border-brand-cyan-border focus:outline-none focus:ring-2 focus:ring-brand-blue shadow-[0px_4px_4px_0px_rgba(85,225,247,0.25)]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        {error && <p className="text-red-500 text-center text-lg">{error}</p>}

        <button
          type="submit"
          className="w-full bg-gradient-button text-white font-semibold text-2xl py-5 rounded-full shadow-lg hover:opacity-90 transition-opacity transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'LOGGING IN...' : 'LOGIN'}
        </button>

        <p className="text-center text-black text-xl pt-4">
          Don't have an account? <Link to="/register" className="hover:underline font-semibold">Register Instead</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
