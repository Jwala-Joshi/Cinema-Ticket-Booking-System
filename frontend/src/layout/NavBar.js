import React, { useState, useEffect } from 'react';
import LoginForm from '../components/LoginForm';
import RegistrationForm from '../components/RegistrationForm';
import Search from '../components/Search';
import { logout } from '../utils/Auth';

function NavBar({ user, onSearch, onLogin, onLogout }) {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
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

            <div className='hidden lg:flex flex-1 max-w-xl mx-8'>
              <Search onSearch={onSearch} />
            </div>

            <div className='hidden lg:flex items-center gap-3'>
              {user ? (
                <div className='flex items-center gap-3'>
                  <div className='flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-800 text-white font-bold border-2 border-transparent hover:border-red-500 transition-all duration-300 cursor-pointer'>
                    {user.userName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className='text-white font-medium'>
                    {user.userName || 'User'}
                  </span>
                  <button
                    className='px-6 py-2 bg-transparent text-white border-2 border-white/30 rounded-full font-semibold hover:border-red-600 hover:text-red-600 hover:bg-red-600/10 transition-all duration-300'
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
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
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>
          </div>

          {isMobileMenuOpen && (
            <div className='lg:hidden pb-4 space-y-4 animate-fadeIn'>
              <div className='w-full'>
                <Search onSearch={onSearch} />
              </div>

              <div className='flex flex-col gap-2'>
                {user ? (
                  <>
                    <div className='flex items-center gap-3 text-white pb-2'>
                      <div 
                        className='flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-800 font-bold'
                        >
                        {user.userName?.[0]?.toUpperCase() || ''}
                      </div>
                      <span className='font-medium'>{user.userName || 'User'}</span>
                    </div>
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