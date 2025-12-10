import React from 'react';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../utils/Auth';

const MovieCard = ({ movie, source, showStatus = false }) => {
  const navigate = useNavigate();
  const userLoggedIn = isLoggedIn();

  const handleClick = () => {
    if (movie.isCinemaMovie) {
      const effectiveSource = (source === 'NOW_SHOWING' && !userLoggedIn) ? 'UPCOMING' : source;
      navigate(`/movie/${movie.id}`, { state: { source: effectiveSource } });
    } else {
      navigate(`/movie/${movie.id}`, { state: { fromAddMovie: true } });
    }
  };

  const formatUpcomingDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getButtonText = () => {
    if (!movie.isCinemaMovie) return 'See Details';
    if (movie.status === 'UPCOMING') return 'See Details';
    if (movie.status === 'NOW_SHOWING' && !userLoggedIn) return 'Login to Book';
    return 'Book Now';
  };

  return (
    <div className='group relative cursor-pointer overflow-hidden rounded-lg bg-gray-900 shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/20'>
      <div className='relative aspect-[2/3] overflow-hidden'>
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-110'
          loading='lazy'
        />

        <div className='absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
          <div className='absolute bottom-0 left-0 right-0 p-4'>
            <button 
              className='w-full px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full font-semibold text-sm hover:from-red-500 hover:to-red-600 transition-all duration-300 transform hover:scale-105'
              onClick={handleClick} 
            >
              {getButtonText()}
            </button>
          </div>
        </div>

        {movie.vote_average && (
          <div className='absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1'>
            <span className='text-yellow-400 text-xs'>⭐</span>
            <span className='text-white text-xs font-bold'>
              {movie.vote_average.toFixed(1)}
            </span>
          </div>
        )}

        {movie.isCinemaMovie && movie.status === 'UPCOMING' && movie.upcomingReleaseDate && (
          <div className='absolute bottom-2 left-2 right-2 upcoming-release-info'>
            <div className='bg-blue-600/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full text-center'>
              In Cinema: {formatUpcomingDate(movie.upcomingReleaseDate)}
            </div>
          </div>
        )}
      </div>

      <div className='p-3 bg-gray-900'>
        <h3 className='text-white font-semibold text-sm mb-1 line-clamp-1 group-hover:text-red-500 transition-colors duration-300'>
          {movie.title}
        </h3>
        
        {movie.release_date && (
          <p className='text-gray-400 text-xs'>
            {new Date(movie.release_date).getFullYear()}
          </p>
        )}
      </div>
    </div>
  );
};

export default MovieCard;