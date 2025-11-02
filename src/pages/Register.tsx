import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('owner');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    
    setLoading(true);

    // Simulate storing user in localStorage
    setTimeout(() => {
      try {
        const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const userExists = existingUsers.some((user: any) => user.email === email);

        if (userExists) {
          setError('An account with this email already exists.');
          setLoading(false);
          return;
        }

        // In a real app, password would be hashed before storing.
        const newUser = { name, email, password, userType };
        existingUsers.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
        
        setLoading(false);
        alert('Registration successful! Redirecting to login...');
        navigate('/login');
      } catch (err) {
        setError('An error occurred during registration. Please try again.');
        setLoading(false);
      }
    }, 1000);
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
            <option value="owner">I'm an Owner</option>
            <option value="seeker">I'm a Seeker</option>
          </select>
          <ChevronDown className="absolute right-8 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={30} />
        </div>
        
        {error && <p className="text-red-500 text-center text-lg">{error}</p>}

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
