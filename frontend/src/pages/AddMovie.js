import React, { useState, useEffect } from 'react';
import { isLoggedIn } from '../utils/Auth';
import { useNavigate } from 'react-router-dom';

function AddMovie() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN;

  useEffect(() => {
    const loggedInUser = isLoggedIn();
    if (!loggedInUser) {
      navigate('/');
    } else if (loggedInUser.role !== 'CINEMA_OWNER') {
      navigate('/');
    } else {
      setUser(loggedInUser);
    }
  }, [navigate]);

  const searchMovies = async () => {
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${ACCESS_TOKEN}&query=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        }
      );
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (err) {
      setError('Failed to search movies');
    } finally {
      setSearching(false);
    }
  };

  const handleAddMovie = async (e) => {
    e.preventDefault();
    if (!selectedMovie) return;

    setLoading(true);
    setError('');

    try {
      const movieData = {
        tmdbId: selectedMovie.id,
        title: selectedMovie.title,
        overview: selectedMovie.overview,
        posterPath: selectedMovie.poster_path,
        backdropPath: selectedMovie.backdrop_path,
        releaseDate: selectedMovie.release_date,
        voteAverage: selectedMovie.vote_average,
        status: document.getElementById('status').value,
        showingStartDate: document.getElementById('startDate').value || null,
        showingEndDate: document.getElementById('endDate').value || null,
      };

      const response = await fetch(`${BASE_URL}/movies/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movieData),
      });

      if (response.ok) {
        setSuccess(true);
        setSelectedMovie(null);
        setSearchQuery('');
        setSearchResults([]);
        setTimeout(() => {
          setSuccess(false);
          navigate('/');
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to add movie');
      }
    } catch (err) {
      setError('An error occurred while adding the movie');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className='min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-12'>
      <div className='container mx-auto px-4'>
        
        <div className='text-center mb-12'>
          <h1 className='text-4xl md:text-5xl font-bold text-white mb-4'>
            ➕ Add Movie to Cinema
          </h1>
          <p className='text-gray-400 mb-4'>
            Search and add movies to your cinema catalog
          </p>
          <div className='h-1 w-20 bg-gradient-to-r from-red-600 to-red-800 rounded mx-auto'></div>
        </div>

        {success && (
          <div className='max-w-2xl mx-auto mb-6 bg-green-500/10 border border-green-500/50 rounded-lg p-4 text-center'>
            <p className='text-green-400 font-semibold'>✓ Movie added successfully!</p>
          </div>
        )}

        {error && (
          <div className='max-w-2xl mx-auto mb-6 bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-center'>
            <p className='text-red-400'>{error}</p>
          </div>
        )}

        <div className='max-w-2xl mx-auto mb-8'>
          <div className='bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-red-900/30 shadow-2xl'>
            <h2 className='text-xl font-bold text-white mb-4'>🔍 Search Movie (TMDB)</h2>
            <div className='flex gap-2'>
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchMovies()}
                placeholder='Enter movie title...'
                className='flex-1 px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600'
              />
              <button
                onClick={searchMovies}
                disabled={searching}
                className='px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:from-red-500 hover:to-red-600 transition-all duration-300 disabled:opacity-50'
              >
                {searching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </div>

        {searchResults.length > 0 && !selectedMovie && (
          <div className='max-w-4xl mx-auto mb-8'>
            <div className='bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-red-900/30 shadow-2xl'>
              <h3 className='text-xl font-bold text-white mb-4'>Search Results</h3>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto'>
                {searchResults.slice(0, 12).map((movie) => (
                  <div
                    key={movie.id}
                    onClick={() => setSelectedMovie(movie)}
                    className='cursor-pointer group'
                  >
                    <div className='relative overflow-hidden rounded-lg border-2 border-gray-700 hover:border-red-600 transition-all'>
                      <img
                        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                        alt={movie.title}
                        className='w-full h-auto group-hover:scale-110 transition-transform duration-300'
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
                        }}
                      />
                      <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2'>
                        <p className='text-white text-sm font-semibold line-clamp-2'>{movie.title}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedMovie && (
          <div className='max-w-2xl mx-auto'>
            <div className='bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-red-900/30 shadow-2xl'>
              <h3 className='text-xl font-bold text-white mb-4'>Movie Details</h3>
              
              <div className='flex gap-4 mb-6'>
                <img
                  src={`https://image.tmdb.org/t/p/w200${selectedMovie.poster_path}`}
                  alt={selectedMovie.title}
                  className='w-32 rounded-lg'
                />
                <div>
                  <h4 className='text-xl font-bold text-white'>{selectedMovie.title}</h4>
                  <p className='text-gray-400 text-sm mt-2'>{selectedMovie.overview?.slice(0, 150)}...</p>
                  <p className='text-gray-500 text-sm mt-2'>Release: {selectedMovie.release_date}</p>
                </div>
              </div>

              <form onSubmit={handleAddMovie} className='space-y-4'>
                <div>
                  <label className='block text-white font-semibold mb-2'>Status</label>
                  <select
                    id='status'
                    required
                    className='w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600'
                  >
                    <option value='NOW_SHOWING'>Now Showing</option>
                    <option value='UPCOMING'>Upcoming</option>
                  </select>
                </div>

                <div>
                  <label className='block text-white font-semibold mb-2'>Showing Start Date (Optional)</label>
                  <input
                    type='date'
                    id='startDate'
                    className='w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600'
                  />
                </div>

                <div>
                  <label className='block text-white font-semibold mb-2'>Showing End Date (Optional)</label>
                  <input
                    type='date'
                    id='endDate'
                    className='w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600'
                  />
                </div>

                <div className='flex gap-4 pt-4'>
                  <button
                    type='button'
                    onClick={() => setSelectedMovie(null)}
                    className='flex-1 px-6 py-3 bg-transparent border-2 border-gray-700 text-white rounded-lg font-semibold hover:border-gray-600 transition-all duration-300'
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    disabled={loading}
                    className='flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-500 hover:to-green-600 transition-all duration-300 disabled:opacity-50'
                  >
                    {loading ? 'Adding...' : 'Add to Cinema'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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