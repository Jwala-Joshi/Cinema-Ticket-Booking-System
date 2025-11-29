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

  return (
    <div className='min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-12'>
      <div className='container mx-auto px-4'>
        
        <div className='text-center mb-12'>
          <h1 className='text-4xl md:text-5xl font-bold text-white mb-4'>
            My Profile
          </h1>
          <div className='h-1 w-20 bg-gradient-to-r from-red-600 to-red-800 rounded mx-auto'></div>
        </div>

        <div className='max-w-2xl mx-auto'>
          <div className='bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-red-900/30 shadow-2xl'>
            
            <div className='text-center mb-8'>
              <div className='inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-red-600 to-red-800 text-white font-bold text-4xl border-4 border-red-500 mb-4'>
                {user.userName?.[0]?.toUpperCase() || 'U'}
              </div>
              <h2 className='text-2xl font-bold text-white'>{user.userName}</h2>
              <p className='text-gray-400 text-sm mt-1'>Member since {new Date().getFullYear()}</p>
            </div>

            <div className='space-y-4'>
              <div className='bg-black/40 rounded-xl p-4 border border-gray-800'>
                <label className='text-gray-400 text-sm'>User ID</label>
                <p className='text-white font-semibold'>{user.userId}</p>
              </div>

              <div className='bg-black/40 rounded-xl p-4 border border-gray-800'>
                <label className='text-gray-400 text-sm'>Username</label>
                <p className='text-white font-semibold'>{user.userName}</p>
              </div>

              {user.email && (
                <div className='bg-black/40 rounded-xl p-4 border border-gray-800'>
                  <label className='text-gray-400 text-sm'>Email</label>
                  <p className='text-white font-semibold'>{user.email}</p>
                </div>
              )}

              {user.role && (
                <div className='bg-black/40 rounded-xl p-4 border border-gray-800'>
                  <label className='text-gray-400 text-sm'>Role</label>
                  <p className='text-white font-semibold capitalize'>
                    {user.role === 'CINEMA_OWNER' ? '🎬 Cinema Owner' : '👤 User'}
                  </p>
                </div>
              )}
            </div>

            <div className='mt-8 flex gap-4'>
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