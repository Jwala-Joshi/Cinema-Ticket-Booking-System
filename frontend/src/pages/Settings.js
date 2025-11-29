import React, { useState, useEffect } from 'react';
import { isLoggedIn } from '../utils/Auth';
import { useNavigate } from 'react-router-dom';

function Settings() {
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
            ⚙️ Settings
          </h1>
          <p className='text-gray-400 mb-4'>
            Manage your account preferences
          </p>
          <div className='h-1 w-20 bg-gradient-to-r from-red-600 to-red-800 rounded mx-auto'></div>
        </div>

        <div className='max-w-2xl mx-auto space-y-6'>
          
          <div className='bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-red-900/30 shadow-2xl'>
            <h2 className='text-xl font-bold text-white mb-4 flex items-center gap-2'>
              <span>👤</span> Account Settings
            </h2>
            <div className='space-y-4'>
              <div className='flex justify-between items-center p-4 bg-black/40 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors'>
                <div>
                  <p className='text-white font-semibold'>Email Notifications</p>
                  <p className='text-gray-400 text-sm'>Receive booking confirmations via email</p>
                </div>
                <label className='relative inline-flex items-center cursor-pointer'>
                  <input type='checkbox' className='sr-only peer' defaultChecked />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              <div className='flex justify-between items-center p-4 bg-black/40 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors'>
                <div>
                  <p className='text-white font-semibold'>SMS Notifications</p>
                  <p className='text-gray-400 text-sm'>Get text updates about your bookings</p>
                </div>
                <label className='relative inline-flex items-center cursor-pointer'>
                  <input type='checkbox' className='sr-only peer' />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div className='bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-red-900/30 shadow-2xl'>
            <h2 className='text-xl font-bold text-white mb-4 flex items-center gap-2'>
              <span>🔒</span> Privacy & Security
            </h2>
            <div className='space-y-3'>
              <button className='w-full text-left p-4 bg-black/40 rounded-lg border border-gray-800 hover:border-red-600 transition-all text-white hover:bg-black/60'>
                Change Password
              </button>
              <button className='w-full text-left p-4 bg-black/40 rounded-lg border border-gray-800 hover:border-red-600 transition-all text-white hover:bg-black/60'>
                Two-Factor Authentication
              </button>
              <button className='w-full text-left p-4 bg-black/40 rounded-lg border border-gray-800 hover:border-red-600 transition-all text-white hover:bg-black/60'>
                Privacy Settings
              </button>
            </div>
          </div>

          <div className='bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-red-900/30 shadow-2xl'>
            <h2 className='text-xl font-bold text-white mb-4 flex items-center gap-2'>
              <span>🎨</span> Preferences
            </h2>
            <div className='space-y-4'>
              <div className='p-4 bg-black/40 rounded-lg border border-gray-800'>
                <label className='text-white font-semibold block mb-2'>Language</label>
                <select className='w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-red-600 focus:outline-none'>
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>

              <div className='p-4 bg-black/40 rounded-lg border border-gray-800'>
                <label className='text-white font-semibold block mb-2'>Theme</label>
                <select className='w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-red-600 focus:outline-none'>
                  <option>Dark (Default)</option>
                  <option>Light</option>
                  <option>Auto</option>
                </select>
              </div>
            </div>
          </div>

          <div className='bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-red-900/50 shadow-2xl'>
            <h2 className='text-xl font-bold text-red-500 mb-4 flex items-center gap-2'>
              <span>⚠️</span> Danger Zone
            </h2>
            <div className='space-y-3'>
              <button className='w-full text-left p-4 bg-red-900/20 rounded-lg border border-red-800 hover:border-red-600 transition-all text-red-400 hover:bg-red-900/30'>
                Delete Account
              </button>
            </div>
          </div>

          <div className='text-center pt-6'>
            <button
              onClick={() => navigate('/')}
              className='px-8 py-3 bg-transparent border-2 border-gray-700 text-white rounded-full font-semibold hover:border-red-600 hover:bg-red-600/10 transition-all duration-300'
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;