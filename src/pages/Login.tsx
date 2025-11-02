import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('owner');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    console.log('Logging in with:', { email, password, userType });
    setTimeout(() => {
      console.log('Login successful!');
      setLoading(false);
      alert('Login successful! Redirecting to dashboard... (Simulation)');
      navigate('/dashboard/my-boardinghouse');
    }, 1500);
  };

  return (
    <div className="w-full">
      <h1 className="text-5xl md:text-6xl font-semibold text-black mb-12">Welcome Back!</h1>
      <form onSubmit={handleSubmit} noValidate className="space-y-6 md:space-y-8">
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
          <input
            type="password"
            id="password"
            placeholder="Password"
            className="w-full px-8 py-5 text-xl md:text-2xl bg-brand-off-white text-brand-gray-text placeholder-brand-gray-text rounded-full border-2 border-brand-cyan-border focus:outline-none focus:ring-2 focus:ring-brand-blue shadow-[0px_4px_4px_0px_rgba(85,225,247,0.25)]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="relative">
          <select
            id="userType"
            className="w-full px-8 py-5 text-xl md:text-2xl bg-brand-off-white text-black rounded-full border-2 border-brand-cyan-border focus:outline-none focus:ring-2 focus:ring-brand-blue appearance-none shadow-[0px_4px_4px_0px_rgba(85,225,247,0.25)]"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
          >
            <option value="owner">Owner</option>
            <option value="seeker">Seeker</option>
          </select>
          <ChevronDown className="absolute right-8 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={30} />
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
          <Link to="/register" className="hover:underline">Register Instead</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
