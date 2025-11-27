import React, { useState, useRef, useEffect } from 'react';
import Login from '../API/Login';

function LoginForm({ onClose, onLogin }) {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef(null);

  const handleClickOutside = (event) => {
    if (formRef.current && !formRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const userData = await Login(BASE_URL, formData.email, formData.password);

      if (userData) {
        setFormData({
          email: '',
          password: '',
        });
        onClose();
        onLogin(userData);
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      console.error(error);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='container mx-auto' ref={formRef}>
      <div className='text-center mb-6'>
        <h2 className='text-3xl font-bold text-white mb-2'>Welcome Back</h2>
        <p className='text-gray-400'>Sign in to continue booking</p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-5'>
        {error && (
          <div className='bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-center'>
            <p className='text-red-400 text-sm'>{error}</p>
          </div>
        )}

        <div>
          <label htmlFor='email' className='block text-gray-300 text-sm font-medium mb-2'>
            Email Address
          </label>
          <input
            type='email'
            id='email'
            name='email'
            placeholder='your.email@example.com'
            value={formData.email}
            onChange={handleChange}
            className='w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:bg-gray-800 transition-all duration-300'
            required
          />
        </div>

        <div>
          <label htmlFor='password' className='block text-gray-300 text-sm font-medium mb-2'>
            Password
          </label>
          <input
            type='password'
            id='password'
            name='password'
            placeholder='Enter your password'
            value={formData.password}
            onChange={handleChange}
            className='w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:bg-gray-800 transition-all duration-300'
            required
          />
        </div>

        <button
          type='submit'
          disabled={isLoading}
          className={`w-full py-3 rounded-lg font-bold text-white transition-all duration-300 ${
            isLoading
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-lg hover:shadow-red-500/50 transform hover:-translate-y-0.5'
          }`}
        >
          {isLoading ? (
            <span className='flex items-center justify-center gap-2'>
              <svg className='animate-spin h-5 w-5' viewBox='0 0 24 24'>
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                  fill='none'
                />
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                />
              </svg>
              Signing in...
            </span>
          ) : (
            'Login'
          )}
        </button>

        <button
          type='button'
          onClick={onClose}
          className='w-full py-3 bg-transparent border-2 border-gray-700 text-gray-300 rounded-lg font-semibold hover:border-gray-600 hover:bg-gray-800/50 transition-all duration-300'
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default LoginForm;