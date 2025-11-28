import React, { useEffect, useState } from 'react';
import MovieCard from './MovieCard';

const UpcomingMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/movies/upcoming`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setMovies(data);
        } else {
          console.error('Failed to fetch upcoming movies');
        }
      } catch (error) {
        console.error('Error fetching upcoming movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcoming();
  }, [BASE_URL]);

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Section Header */}
      <div className='mb-6'>
        <h2 className='text-2xl text-left md:text-3xl font-bold text-white mb-2'>
          🔜 Coming Soon
        </h2>
        <p className='text-gray-400 text-sm mb-3'>
          Upcoming releases in our cinema
        </p>
        <div className='h-1 w-20 bg-gradient-to-r from-red-600 to-red-800 rounded'></div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className='flex justify-center items-center min-h-[400px]'>
          <div className='text-center'>
            <div className='inline-block w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4'></div>
            <p className='text-white text-lg'>Loading upcoming movies...</p>
          </div>
        </div>
      ) : movies.length === 0 ? (
        /* Empty State */
        <div className='flex flex-col justify-center items-center min-h-[400px] text-center'>
          <div className='text-6xl mb-4'>📅</div>
          <h3 className='text-2xl font-bold text-white mb-2'>No upcoming movies</h3>
          <p className='text-gray-400'>New releases will be announced soon!</p>
        </div>
      ) : (
        /* Movie Grid */
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6'>
          {movies.map((movie) => (
            <div
              key={movie.id}
              className='transform transition-all duration-300 hover:scale-105'
            >
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingMovies;