import React, { useState, useEffect } from 'react';
import { isLoggedIn } from '../utils/Auth';
import { useNavigate } from 'react-router-dom';
import MovieList from '../components/MovieList';

function AddMovie() {
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = isLoggedIn();
    if (!loggedInUser) {
      navigate('/');
    } else if (
      loggedInUser.role !== 'CINEMA_OWNER' &&
      loggedInUser.role !== 'ADMIN'
    ) {
      navigate('/');
    } else {
      setUser(loggedInUser);
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <div className='min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-12'>
      <div className='container mx-auto px-4'>
        <div className='mb-8'>
          <h1 className='text-left text-4xl md:text-5xl font-bold text-white mb-2'>
            Add Movie to Cinema
          </h1>
          <div className='h-1 w-20 bg-gradient-to-r from-red-600 to-red-800 rounded'></div>
        </div>

        <div>
          <MovieList />
        </div>

        <div className='text-center mt-8'>
          <button
            onClick={() => navigate('/')}
            className='px-8 py-3 bg-transparent border-2 border-gray-700 text-white rounded-full font-semibold hover:border-red-600 hover:bg-red-600/10 transition-all duration-300'
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddMovie;