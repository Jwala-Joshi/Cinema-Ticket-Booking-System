import React, { useState, useRef, useEffect } from 'react';
import Register from '../API/Register';

function RegistrationForm({ onClose }) {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
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
      const result = await Register(BASE_URL, formData);
      
      if (result) {
        setSuccess(true);
        setFormData({
          name: '',
          surname: '',
          email: '',
          phone: '',
          password: '',
        });
        
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='container mx-auto' ref={formRef}>
      <div className='text-center mb-6'>
        <h2 className='text-3xl font-bold text-white mb-2'>Join Cinema</h2>
        <p className='text-gray-400'>Create your account to start booking</p>
      </div>

      {success ? (
        <div className='text-center py-8'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4'>
            <svg className='w-8 h-8 text-green-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
            </svg>
          </div>
          <h3 className='text-2xl font-bold text-white mb-2'>Registration Successful!</h3>
          <p className='text-gray-400'>You can now login with your credentials</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className='space-y-4'>
          {error && (
            <div className='bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-center'>
              <p className='text-red-400 text-sm'>{error}</p>
            </div>
          )}

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label htmlFor='name' className='block text-gray-300 text-sm font-medium mb-2'>
                First Name
              </label>
              <input
                type='text'
                id='name'
                name='name'
                placeholder='John'
                value={formData.name}
                onChange={handleChange}
                className='w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:bg-gray-800 transition-all duration-300'
                required
              />
            </div>
            <div>
              <label htmlFor='surname' className='block text-gray-300 text-sm font-medium mb-2'>
                Last Name
              </label>
              <input
                type='text'
                id='surname'
                name='surname'
                placeholder='Doe'
                value={formData.surname}
                onChange={handleChange}
                className='w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:bg-gray-800 transition-all duration-300'
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor='email' className='block text-gray-300 text-sm font-medium mb-2'>
              Email Address
            </label>
            <input
              type='email'
              id='email'
              name='email'
              placeholder='john.doe@example.com'
              value={formData.email}
              onChange={handleChange}
              className='w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:bg-gray-800 transition-all duration-300'
              required
            />
          </div>

          <div>
            <label htmlFor='phone' className='block text-gray-300 text-sm font-medium mb-2'>
              Phone Number (Optional)
            </label>
            <input
              type='tel'
              id='phone'
              name='phone'
              placeholder='+977 98XXXXXXXX'
              value={formData.phone}
              onChange={handleChange}
              className='w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:bg-gray-800 transition-all duration-300'
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
              placeholder='Create a strong password'
              value={formData.password}
              onChange={handleChange}
              className='w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:bg-gray-800 transition-all duration-300'
              required
              minLength={6}
            />
            <p className='text-gray-500 text-xs mt-1'>Minimum 6 characters</p>
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
                Creating account...
              </span>
            ) : (
              'Create Account'
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
      )}
    </div>
  );
}

export default RegistrationForm;