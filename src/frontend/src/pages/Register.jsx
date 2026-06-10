import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    try {
      if (username && email && password) {
        await register(username, email, password);
        // On success, redirect to login so they can log in
        navigate('/login');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Brand Header */}
      <div className="mb-8 text-center">
        <h1 className="text-headline-xl font-bold tracking-tighter uppercase mb-2">
          IRON <span className="text-primary">AI</span>
        </h1>
        <p className="text-body-md text-on-surface-variant font-medium">
          New Operative Registration
        </p>
      </div>

      {/* Register Card */}
      <div className="w-full max-w-md bg-surface-container-lowest border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-8">
        <h2 className="text-headline-md font-bold mb-6 uppercase border-b-4 border-black pb-4">
          Create Account
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-error-container text-on-error-container border-2 border-error font-bold uppercase shadow-[2px_2px_0px_0px_rgba(186,26,26,1)]">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-label-bold uppercase" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-3 border-2 border-black bg-white focus:outline-none focus:border-4 focus:-m-[2px] focus:bg-primary-container transition-all"
              placeholder="Enter username"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-label-bold uppercase" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 border-2 border-black bg-white focus:outline-none focus:border-4 focus:-m-[2px] focus:bg-primary-container transition-all"
              placeholder="Enter email"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-label-bold uppercase" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 border-2 border-black bg-white focus:outline-none focus:border-4 focus:-m-[2px] focus:bg-primary-container transition-all"
              placeholder="Enter password"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-label-bold uppercase" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="p-3 border-2 border-black bg-white focus:outline-none focus:border-4 focus:-m-[2px] focus:bg-primary-container transition-all"
              placeholder="Confirm password"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-4 w-full py-4 bg-tertiary text-on-tertiary border-4 border-black font-bold text-label-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all hover:bg-tertiary-fixed-dim cursor-pointer"
          >
            Register Operative
          </button>
        </form>

        <div className="mt-6 text-center text-label-bold">
          <Link to="/login" className="text-on-surface-variant hover:text-primary transition-colors">
            ALREADY HAVE AN ACCOUNT? LOGIN
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
