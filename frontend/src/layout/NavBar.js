import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import RegistrationForm from '../components/RegistrationForm';
import { logout } from '../utils/Auth';

function NavBar({ user, onSearch, onLogin, onLogout }) {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    logout();
    onLogout();
    setIsMenuOpen(false);
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  const handleMenuClick = () => {
    setIsMenuOpen(prev => !prev);
  };

  const handleOptionClick = (option) => {
    setIsMenuOpen(false);
    
    if (option === 'Profile') {
      navigate('/profile');
    } else if (option === 'Bookings') {
      navigate('/my-bookings');
    } else if (option === 'Settings') {
      navigate('/settings');
    } else if (option === 'AddMovie') {
      navigate('/add-movie');
    } else if(option === 'Users'){
      navigate('/users')
    } else if (option === 'Logout'){
      handleLogout();
    }
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || isMobileMenuOpen
            ? 'bg-black/95 backdrop-blur-lg shadow-lg' 
            : 'bg-gradient-to-b from-black/90 to-transparent'
        }`}
      >
        <div className='container mx-auto px-4 lg:px-8'>
          <div className='flex items-center justify-between py-4'>
           
            <div className='flex items-center'>
              <a
                className='text-2xl lg:text-3xl font-extrabold text-red-600 hover:text-red-500 transition-all duration-300 hover:scale-105'
                href='/'
              >
                🎬 CINEMA
              </a>
            </div>

            <div className='hidden lg:flex items-center gap-3'>
              {user ? (
                <div className='flex items-center gap-3 relative' ref={dropdownRef}>
                  <div 
                    className='flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-800 text-white font-bold border-2 border-transparent hover:border-red-500 transition-all duration-300 cursor-pointer'
                    onClick={handleMenuClick}
                  >
                    {user.userName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className='text-white font-medium'>
                    {user.userName || 'User'}
                  </span>

                  {isMenuOpen && (
                    <div className='absolute top-full right-0 mt-2 w-56 bg-gray-900 border-2 border-gray-700 rounded-lg shadow-2xl z-50 overflow-hidden animate-fadeIn'>
                      <ul className='list-none p-2'>
                        <li 
                          className='p-3 hover:bg-gray-800 cursor-pointer rounded text-white transition-colors duration-200 flex items-center gap-3' 
                          onClick={() => handleOptionClick('Profile')}
                        >
                          <span className='text-xl'>👤</span>
                          <span>Profile</span>
                        </li>
                        <li 
                          className='p-3 hover:bg-gray-800 cursor-pointer rounded text-white transition-colors duration-200 flex items-center gap-3' 
                          onClick={() => handleOptionClick('Bookings')}
                        >
                          <span className='text-xl'>🎫</span>
                          <span>My Bookings</span>
                        </li>
                        {user.role === 'CINEMA_OWNER' && (
                          <li 
                            className='p-3 hover:bg-gray-800 cursor-pointer rounded text-white transition-colors duration-200 flex items-center gap-3 border-t border-gray-700' 
                            onClick={() => handleOptionClick('AddMovie')}
                          >
                            <span className='text-xl'>➕</span>
                            <span>Add Movie</span>
                          </li>
                        )}
                        {user.role === 'ADMIN' && (
                          <>
                            <li 
                              className='p-3 hover:bg-gray-800 cursor-pointer rounded text-white transition-colors duration-200 flex items-center gap-3 border-t border-gray-700' 
                              onClick={() => handleOptionClick('AddMovie')}
                            >
                              <span className='text-xl'>➕</span>
                              <span>Add Movie</span>
                            </li>

                            <li 
                              className='p-3 hover:bg-gray-800 cursor-pointer rounded text-white transition-colors duration-200 flex items-center gap-3 border-t border-gray-700' 
                              onClick={() => handleOptionClick('Users')}
                            >
                              <span className='text-xl'>👥</span>
                              <span>User Data</span>
                            </li>
                          </>
                        )}
                        <li 
                          className='p-3 hover:bg-gray-800 cursor-pointer rounded text-white transition-colors duration-200 flex items-center gap-3' 
                          onClick={() => handleOptionClick('Settings')}
                        >
                          <span className='text-xl'>⚙️</span>
                          <span>Settings</span>
                        </li>
                        <li 
                          className='p-3 hover:bg-red-900 cursor-pointer rounded text-white transition-colors duration-200 flex items-center gap-3 border-t border-gray-700' 
                          onClick={handleLogout}
                        >
                          <span className='text-xl'>🚪</span>
                          <span>Logout</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    className='px-6 py-2 bg-transparent text-white border-2 border-white rounded-full font-semibold hover:bg-white hover:text-black transition-all duration-300'
                    onClick={() => setShowLoginForm(true)}
                  >
                    Login
                  </button>
                  <button
                    className='px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full font-semibold hover:from-red-500 hover:to-red-600 shadow-lg hover:shadow-red-500/50 transition-all duration-300 transform hover:-translate-y-0.5'
                    onClick={() => setShowRegistrationForm(true)}
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>

            <button
              className='lg:hidden flex flex-col gap-1.5 p-2'
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>
          </div>

          {isMobileMenuOpen && (
            <div className='lg:hidden pb-4 space-y-4 animate-fadeIn'>
              <div className='flex flex-col gap-2'>
                {user ? (
                  <>
                    <div className='flex items-center gap-3 text-white pb-2'>
                      <div className='flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-800 font-bold'>
                        {user.userName?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <span className='font-medium'>{user.userName || 'User'}</span>
                    </div>
                    
                    <button
                      className='w-full px-4 py-3 bg-transparent text-white border-2 border-white/30 rounded-lg font-semibold hover:border-red-600 hover:bg-red-600/10 transition-all duration-300 text-left flex items-center gap-3'
                      onClick={() => {
                        handleOptionClick('Profile');
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <span>👤</span> Profile
                    </button>
                    
                    <button
                      className='w-full px-4 py-3 bg-transparent text-white border-2 border-white/30 rounded-lg font-semibold hover:border-red-600 hover:bg-red-600/10 transition-all duration-300 text-left flex items-center gap-3'
                      onClick={() => {
                        handleOptionClick('Bookings');
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <span>🎫</span> My Bookings
                    </button>

                    {user.role === 'CINEMA_OWNER' && (
                      <button
                        className='w-full px-4 py-3 bg-transparent text-white border-2 border-white/30 rounded-lg font-semibold hover:border-red-600 hover:bg-red-600/10 transition-all duration-300 text-left flex items-center gap-3'
                        onClick={() => {
                          handleOptionClick('AddMovie');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <span>➕</span> Add Movie
                      </button>
                    )}

                    {user.role === 'ADMIN' && (
                      <>
                        <button
                          className='w-full px-4 py-3 bg-transparent text-white border-2 border-white/30 rounded-lg font-semibold hover:border-red-600 hover:bg-red-600/10 transition-all duration-300 text-left flex items-center gap-3'
                          onClick={() => {
                            handleOptionClick('AddMovie');
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <span>➕</span> Add Movie
                        </button>

                        <button
                          className='w-full px-4 py-3 bg-transparent text-white border-2 border-white/30 rounded-lg font-semibold hover:border-red-600 hover:bg-red-600/10 transition-all duration-300 text-left flex items-center gap-3'
                          onClick={() => {
                            handleOptionClick('Users');
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <span>👥</span> User Data
                        </button>
                      </>
                    )}
                    
                    <button
                      className='w-full px-4 py-3 bg-transparent text-white border-2 border-white/30 rounded-lg font-semibold hover:border-red-600 hover:bg-red-600/10 transition-all duration-300 text-left flex items-center gap-3'
                      onClick={() => {
                        handleOptionClick('Settings');
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <span>⚙️</span> Settings
                    </button>
                    
                    <button
                      className='w-full px-4 py-3 bg-transparent text-white border-2 border-white/30 rounded-lg font-semibold hover:border-red-600 hover:bg-red-600/10 transition-all duration-300'
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className='w-full px-4 py-3 bg-transparent text-white border-2 border-white rounded-lg font-semibold hover:bg-white hover:text-black transition-all duration-300'
                      onClick={() => {
                        setShowLoginForm(true);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Login
                    </button>
                    <button
                      className='w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:from-red-500 hover:to-red-600 transition-all duration-300'
                      onClick={() => {
                        setShowRegistrationForm(true);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
      
      <div className='h-20'></div>

      {(showLoginForm || showRegistrationForm) && (
        <div className='fixed inset-0 flex justify-center items-center z-50 bg-black/70 backdrop-blur-sm animate-fadeIn'>
          <div className='bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-red-900/30'>
            {showLoginForm && (
              <LoginForm
                onClose={() => setShowLoginForm(false)}
                onLogin={onLogin}
              />
            )}
            {showRegistrationForm && (
              <RegistrationForm
                onClose={() => setShowRegistrationForm(false)}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default NavBar;