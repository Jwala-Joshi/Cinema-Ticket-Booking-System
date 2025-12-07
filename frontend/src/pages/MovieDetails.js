import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import FetchMovieDetails from '../API/GetMovieDetails';
import AddMovieToDatabase from '../API/AddMovie';
import FormatDate from '../utils/formatDate';
import FormatRuntime from '../utils/formatRuntime';
import SeatPlan from '../components/SeatPlan';

const MovieDetails = ({ source = 'UPCOMING' }) => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const fromAddMovie = location.state?.fromAddMovie === true;
  const passedSource = location.state?.source || source;
  const [movie, setMovie] = useState(null);
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [status, setStatus] = useState('NOW_SHOWING');
  const [tempDate, setTempDate] = useState('');
  const [tempTime, setTempTime] = useState('');
  const [showDates, setShowDates] = useState([]);
  const [upcomingDate, setUpcomingDate] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);
  const [availableSessions, setAvailableSessions] = useState([]);
  const [upcomingReleaseDate, setUpcomingReleaseDate] = useState(null);

  const API_KEY = process.env.REACT_APP_API_KEY || '';

  useEffect(() => {
    const fetchData = async () => {
      const movieData = await FetchMovieDetails(id, API_KEY);
      setMovie(movieData);
      
      const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:8080/api/v1';
      if (passedSource === 'NOW_SHOWING') {
        try {
          const response = await fetch(`${BASE_URL}/movies/now-showing`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            const cinemaMovie = data.find(m => m.tmdbId === parseInt(id));
            
            if (cinemaMovie && cinemaMovie.showTimes) {
              const sessions = cinemaMovie.showTimes.map((showTime, index) => {
                const dateTime = new Date(showTime);
                return {
                  id: `${cinemaMovie.id}-${index}`,
                  movieDbId: cinemaMovie.id,
                  date: dateTime.toISOString().split('T')[0],
                  time: dateTime.toTimeString().slice(0, 5),
                  availableSeats: 50,
                  dateTime: showTime
                };
              });
              
              sessions.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
              setAvailableSessions(sessions);
            }
          }
        } catch (error) {
          console.error('Error fetching cinema movie data:', error);
        }
      }
      
      if (passedSource === 'UPCOMING') {
        try {
          const response = await fetch(`${BASE_URL}/movies/upcoming`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            const cinemaMovie = data.find(m => m.tmdbId === parseInt(id));
            
            if (cinemaMovie && cinemaMovie.upcomingReleaseDate) {
              setUpcomingReleaseDate(cinemaMovie.upcomingReleaseDate);
            }
          }
        } catch (error) {
          console.error('Error fetching upcoming movie data:', error);
        }
      }
    };
    fetchData();
  }, [id, API_KEY, passedSource]);

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 5000);
  };

  const handleAddShow = () => {
    if (tempDate && tempTime) {
      setShowDates([...showDates, { date: tempDate, time: tempTime }]);
      setTempDate('');
      setTempTime('');
    }
  };

  const handleRemoveShow = (index) => {
    const updated = [...showDates];
    updated.splice(index, 1);
    setShowDates(updated);
  };

  const handleSaveMovie = async () => {
    if (status === 'NOW_SHOWING' && showDates.length === 0) {
      showNotification('error', 'Please add at least one show date and time for NOW_SHOWING movies');
      return;
    }

    if (status === 'UPCOMING' && !upcomingDate) {
      showNotification('error', 'Please select an upcoming release date');
      return;
    }

    setIsSubmitting(true);

    const showTimes = showDates.map(show => {
      return `${show.date}T${show.time}:00`;
    });

    const movieData = {
      tmdbId: movie.id,
      title: movie.title,
      overview: movie.overview,
      posterPath: movie.poster_path,
      backdropPath: movie.backdrop_path,
      releaseDate: movie.release_date,
      voteAverage: movie.vote_average,
      status: status,
      showTimes: status === 'NOW_SHOWING' ? showTimes : [],
      upcomingReleaseDate: status === 'UPCOMING' ? upcomingDate : null,
    };

    console.log('Submitting movie data:', movieData);

    const result = await AddMovieToDatabase(movieData);

    setIsSubmitting(false);

    if (result.success) {
      showNotification('success', 'Movie added successfully to cinema!');
      setTimeout(() => {
        navigate('/add-movie');
      }, 2000);
    } else {
      showNotification('error', result.error || 'Failed to add movie. Please try again.');
    }
  };

  const handleSessionSelect = (session) => {
    setSelectedSession(session);
    setTimeout(() => {
      document.getElementById('seat-plan-section')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  if (!movie) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center'>
        <div className='text-center'>
          <div className='inline-block w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4'></div>
          <p className='text-white text-lg'>Loading movie details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-black via-gray-900 to-black'>
      {notification.show && (
        <div className='fixed top-4 right-4 z-50 animate-slideIn'>
          <div className={`px-6 py-4 rounded-lg shadow-lg ${notification.type === 'success'
              ? 'bg-green-600 text-white'
              : 'bg-red-600 text-white'
            }`}>
            <div className='flex items-center gap-3'>
              <span className='text-2xl'>
                {notification.type === 'success' ? '✓' : '✕'}
              </span>
              <p className='font-semibold'>{notification.message}</p>
            </div>
          </div>
        </div>
      )}

      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-6xl mx-auto'>
          <div className='movie-hero mb-12'>
            <div
              className='movie-backdrop'
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
              }}
            />

            <div className='flex flex-wrap justify-center items-start relative z-10'>
              <div className='w-full md:w-1/2 lg:w-1/3 flex justify-center mb-8 md:mb-0 px-4'>
                <div className='movie-poster-container'>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className='w-full h-auto rounded-lg shadow-2xl'
                  />
                </div>
              </div>

              <div className='w-full md:w-1/2 lg:w-2/3 px-6 text-left'>
                {!showAddOptions ? (
                  <div className='movie-details-info'>
                    <h1 className='movie-title text-4xl md:text-5xl font-bold text-white mb-2'>
                      {movie.title}
                    </h1>
                    {movie.tagline && (
                      <p className='movie-tagline text-gray-400 italic text-lg mb-4'>
                        "{movie.tagline}"
                      </p>
                    )}

                    <div className='flex items-center gap-4 mb-6'>
                      <span className='rating-badge bg-yellow-500 text-black px-3 py-1 rounded-full font-bold'>
                        ⭐ {movie.vote_average.toFixed(1)}
                      </span>
                      <span className='text-gray-300'>{FormatRuntime(movie.runtime)}</span>
                      <span className='text-gray-300'>{FormatDate(movie.release_date)}</span>
                    </div>

                    <div className='info-item mb-6'>
                      <span className='info-label text-red-500 font-bold text-lg block mb-2'>
                        Overview:
                      </span>
                      <p className='text-gray-200 leading-relaxed'>{movie.overview}</p>
                    </div>

                    <div className='info-item mb-6'>
                      <span className='info-label text-red-500 font-bold text-lg block mb-2'>
                        Genres:
                      </span>
                      <div className='flex flex-wrap gap-2'>
                        {movie.genres.map((genre) => (
                          <span
                            key={genre.id}
                            className='genre-pill bg-gray-800 text-gray-200 px-4 py-2 rounded-full text-sm border border-gray-700'
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                      <div className='info-item'>
                        <span className='info-label text-red-500 font-semibold block mb-1'>
                          Budget:
                        </span>
                        <span className='text-gray-200'>
                          {movie.budget ? `$${movie.budget.toLocaleString()}` : 'N/A'}
                        </span>
                      </div>

                      <div className='info-item'>
                        <span className='info-label text-red-500 font-semibold block mb-1'>
                          Revenue:
                        </span>
                        <span className='text-gray-200'>
                          {movie.revenue ? `$${movie.revenue.toLocaleString()}` : 'N/A'}
                        </span>
                      </div>

                      <div className='info-item'>
                        <span className='info-label text-red-500 font-semibold block mb-1'>
                          Production:
                        </span>
                        <span className='text-gray-200'>
                          {movie.production_companies
                            .slice(0, 3)
                            .map((company) => company.name)
                            .join(', ')}
                        </span>
                      </div>

                      <div className='info-item'>
                        <span className='info-label text-red-500 font-semibold block mb-1'>
                          Languages:
                        </span>
                        <span className='text-gray-200'>
                          {movie.spoken_languages.map((lang) => lang.english_name).join(', ')}
                        </span>
                      </div>
                    </div>

                    <div className='flex gap-4'>
                      {movie.homepage && (
                        <a
                          className='px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-full font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-300 inline-block'
                          href={movie.homepage}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          Visit Official Website
                        </a>
                      )}

                      {fromAddMovie && (
                        <button
                          className='px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full font-semibold hover:from-green-500 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-green-500/50'
                          onClick={() => setShowAddOptions(true)}
                        >
                          ➕ Add to Cinema
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className='add-movie-options p-8 bg-gray-900/80 backdrop-blur-sm rounded-2xl border-2 border-red-900/50 shadow-2xl'>
                    <h2 className='text-3xl font-bold text-white mb-6 flex items-center gap-3'>
                      <span className='text-red-500'>🎬</span>
                      Add Movie to Cinema
                    </h2>

                    <div className='mb-6'>
                      <label className='block text-white font-semibold mb-3 text-lg'>
                        Status <span className='text-red-500'>*</span>
                      </label>
                      <select
                        className='w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:border-red-500 focus:outline-none transition-colors'
                        value={status}
                        onChange={(e) => {
                          setStatus(e.target.value);
                          setShowDates([]);
                          setUpcomingDate('');
                        }}
                      >
                        <option value='NOW_SHOWING'>Now Showing</option>
                        <option value='UPCOMING'>Upcoming</option>
                      </select>
                    </div>

                    {status === 'NOW_SHOWING' && (
                      <div className='mb-6'>
                        <label className='block text-white font-semibold mb-3 text-lg'>
                          Show Dates & Times <span className='text-red-500'>*</span>
                        </label>
                        <div className='flex flex-wrap gap-2 mb-3'>
                          <input
                            type='date'
                            className='flex-1 min-w-[150px] px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:border-red-500 focus:outline-none'
                            value={tempDate}
                            onChange={(e) => setTempDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                          />
                          <input
                            type='time'
                            className='flex-1 min-w-[120px] px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:border-red-500 focus:outline-none'
                            value={tempTime}
                            onChange={(e) => setTempTime(e.target.value)}
                          />
                          <button
                            type='button'
                            className='px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed'
                            onClick={handleAddShow}
                            disabled={!tempDate || !tempTime}
                          >
                            Add
                          </button>
                        </div>

                        <div className='space-y-2 max-h-48 overflow-y-auto'>
                          {showDates.length === 0 ? (
                            <p className='text-gray-400 text-sm italic p-3 bg-gray-800/50 rounded-lg text-center'>
                              No show dates added yet. Add at least one showtime.
                            </p>
                          ) : (
                            showDates.map((show, index) => (
                              <div
                                key={index}
                                className='flex justify-between items-center p-3 bg-gray-800 rounded-lg border border-gray-700'
                              >
                                <span className='text-white'>
                                  📅 {show.date} - 🕐 {show.time}
                                </span>
                                <button
                                  type='button'
                                  className='px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-sm font-semibold transition-colors'
                                  onClick={() => handleRemoveShow(index)}
                                >
                                  ✕ Remove
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}

                    {status === 'UPCOMING' && (
                      <div className='mb-6'>
                        <label className='block text-white font-semibold mb-3 text-lg'>
                          Release Date <span className='text-red-500'>*</span>
                        </label>
                        <input
                          type='date'
                          className='w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:border-red-500 focus:outline-none'
                          value={upcomingDate}
                          onChange={(e) => setUpcomingDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                        />
                        {upcomingDate && (
                          <div className='mt-3 p-3 bg-gray-800 rounded-lg border border-green-600'>
                            <p className='text-white'>
                              <span className='text-green-500 font-semibold'>✓</span> Selected Release Date: {upcomingDate}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className='bg-gray-800/50 p-4 rounded-lg mb-6'>
                      <h3 className='text-white font-semibold mb-3 flex items-center gap-2'>
                        <span className='text-xl'>📋</span> Movie Summary
                      </h3>
                      <div className='space-y-2 text-sm'>
                        <p className='text-gray-300'>
                          <span className='text-red-400 font-semibold'>Title:</span> {movie.title}
                        </p>
                        <p className='text-gray-300'>
                          <span className='text-red-400 font-semibold'>Release Date:</span> {FormatDate(movie.release_date)}
                        </p>
                        <p className='text-gray-300'>
                          <span className='text-red-400 font-semibold'>Rating:</span> {movie.vote_average.toFixed(1)}/10
                        </p>
                        <p className='text-gray-300'>
                          <span className='text-red-400 font-semibold'>Status:</span> {status}
                        </p>
                        {status === 'NOW_SHOWING' && (
                          <p className='text-gray-300'>
                            <span className='text-red-400 font-semibold'>Showtimes:</span> {showDates.length} scheduled
                          </p>
                        )}
                        {status === 'UPCOMING' && upcomingDate && (
                          <p className='text-gray-300'>
                            <span className='text-red-400 font-semibold'>Releases On:</span> {upcomingDate}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className='flex gap-4 pt-4'>
                      <button
                        type='button'
                        className='flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-semibold transition-colors'
                        onClick={() => {
                          setShowAddOptions(false);
                          setShowDates([]);
                          setUpcomingDate('');
                        }}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </button>
                      <button
                        type='button'
                        className={`flex-1 px-6 py-3 rounded-lg text-white font-semibold transition-all ${isSubmitting
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 shadow-lg hover:shadow-green-500/50'
                          }`}
                        onClick={handleSaveMovie}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className='flex items-center justify-center gap-2'>
                            <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                            Adding...
                          </span>
                        ) : (
                          'Add Movie to Cinema'
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Session Selection Section - Only for NOW_SHOWING movies */}
          {passedSource === 'NOW_SHOWING' && !selectedSession && (
            <div className='mb-12'>
              <div className='bg-gray-900/80 backdrop-blur-sm rounded-2xl border-2 border-red-900/50 shadow-2xl p-8'>
                <h2 className='text-3xl font-bold text-white mb-6 flex items-center gap-3'>
                  <span className='text-red-500'>🎟️</span>
                  Select Your Showtime
                </h2>
                
                {availableSessions.length === 0 ? (
                  <div className='text-center py-12'>
                    <div className='text-6xl mb-4'>📅</div>
                    <p className='text-gray-400 text-lg'>No showtimes available yet</p>
                  </div>
                ) : (
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {availableSessions.map((session) => (
                      <button
                        key={session.id}
                        onClick={() => handleSessionSelect(session)}
                        className='p-6 bg-gray-800 hover:bg-gray-750 rounded-xl border-2 border-gray-700 hover:border-red-500 transition-all duration-300 text-left group'
                      >
                        <div className='flex justify-between items-start mb-4'>
                          <div>
                            <p className='text-white font-bold text-lg mb-1'>
                              📅 {FormatDate(session.date)}
                            </p>
                            <p className='text-red-400 font-semibold text-xl'>
                              🕐 {session.time}
                            </p>
                          </div>
                          <div className='bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold'>
                            {session.availableSeats} seats
                          </div>
                        </div>
                        
                        <div className='flex items-center justify-between mt-4 pt-4 border-t border-gray-700'>
                          <span className='text-gray-400 text-sm'>Click to book</span>
                          <span className='text-red-500 text-xl group-hover:translate-x-1 transition-transform'>
                            →
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Upcoming Release Date Section - Only for UPCOMING movies */}
          {passedSource === 'UPCOMING' && upcomingReleaseDate && (
            <div className='mb-12'>
              <div className='bg-gradient-to-br from-blue-900/80 to-purple-900/80 backdrop-blur-sm rounded-2xl border-2 border-blue-500/50 shadow-2xl p-8'>
                <div className='text-center'>
                  <div className='inline-block mb-4'>
                    <span className='text-6xl'>🎬</span>
                  </div>
                  <h2 className='text-3xl font-bold text-white mb-3'>
                    Coming to Our Cinema
                  </h2>
                  <div className='inline-block bg-white/10 backdrop-blur-sm px-8 py-4 rounded-xl border-2 border-white/20'>
                    <p className='text-blue-200 text-sm font-semibold mb-1'>Release Date</p>
                    <p className='text-white text-4xl font-bold'>
                      {new Date(upcomingReleaseDate).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                  <p className='text-gray-300 mt-6 text-lg'>
                    Mark your calendar! Tickets will be available soon.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Seat Plan Section - Only shown after session selection */}
          {passedSource === 'NOW_SHOWING' && selectedSession && (
            <div id='seat-plan-section' className='mb-12'>
              <div className='bg-gray-900/80 backdrop-blur-sm rounded-2xl border-2 border-red-900/50 shadow-2xl p-8'>
                <div className='flex justify-between items-center mb-6'>
                  <h2 className='text-3xl font-bold text-white flex items-center gap-3'>
                    <span className='text-red-500'>🎬</span>
                    Select Your Seats
                  </h2>
                  <button
                    onClick={() => setSelectedSession(null)}
                    className='px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-semibold transition-colors'
                  >
                    ← Change Showtime
                  </button>
                </div>
                
                <div className='bg-gray-800/50 p-4 rounded-lg mb-6'>
                  <div className='flex flex-wrap gap-4 text-sm'>
                    <p className='text-gray-300'>
                      <span className='text-red-400 font-semibold'>Movie:</span> {movie.title}
                    </p>
                    <p className='text-gray-300'>
                      <span className='text-red-400 font-semibold'>Date:</span> {FormatDate(selectedSession.date)}
                    </p>
                    <p className='text-gray-300'>
                      <span className='text-red-400 font-semibold'>Time:</span> {selectedSession.time}
                    </p>
                    <p className='text-gray-300'>
                      <span className='text-red-400 font-semibold'>Available:</span> {selectedSession.availableSeats} seats
                    </p>
                  </div>
                </div>

                <SeatPlan 
                  movie={movie} 
                  movieSession={selectedSession}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;