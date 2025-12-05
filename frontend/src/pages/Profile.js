import React, { useState, useEffect } from 'react';
import { isLoggedIn } from '../utils/Auth';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = isLoggedIn();
    if (!loggedInUser) {
      navigate('/');
    } else {
      setUser(loggedInUser);
    }
  }, [navigate]);

  if (!user) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center'>
        <div className='text-white text-xl'>Loading...</div>
      </div>
    );
  }

  const userDetails = [
    { label: 'First name', value: user.userName},
    { label: 'Last name', value: user.surname},
    { label: 'Email', value: user.email },
    { label: 'Role', value: user.role === 'CINEMA_OWNER' ? 'Cinema Owner' : 
      user.role === 'ADMIN' ? 'Admin' : "User" },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-12'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl md:text-5xl font-bold text-white mb-4'>My Profile</h1>
          <div className='h-1 w-20 bg-gradient-to-r from-red-600 to-red-800 rounded mx-auto'></div>
        </div>

        <div className='max-w-2xl mx-auto'>
          <div className='bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-red-900/30 shadow-2xl'>
            
            <div className='text-center mb-8'>
              <div className='inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-red-600 to-red-800 text-white font-bold text-4xl border-4 border-red-500 mb-4'>
                {user.userName?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>

            <div className='space-y-4'>
              {userDetails.map((detail) => (
                <div key={detail.label} className='bg-black/40 rounded-xl p-4 border border-gray-800 flex justify-between'>
                  <span className='text-gray-400 font-medium'>{detail.label}</span>
                  <span className='text-white font-semibold'>{detail.value}</span>
                </div>
              ))}
            </div>

            <div className='mt-8 flex gap-4'>
              <button
                onClick={() => navigate('/settings')}
                className='flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-500 transition-all duration-300'
              >
                Edit Profile
              </button>

              <button
                onClick={() => navigate('/')}
                className='flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:from-red-500 hover:to-red-600 transition-all duration-300'
              >
                Back to Home
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;