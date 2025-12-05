import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [targetUser, setTargetUser] = useState(null);
  const navigate = useNavigate();
  const { userId } = useParams();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (!loggedInUser || loggedInUser.role !== 'ADMIN') {
      navigate('/');
    } else {
      setUser(loggedInUser);
      fetchUserInfo();
      fetchBookings();
    }
  }, [navigate, userId]);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(`${BASE_URL}/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTargetUser(data);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/order/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const bookingsArray = Array.isArray(data) ? data : (data ? [data] : []);
    
        const bookingsWithPosters = await Promise.all(
          bookingsArray.map(async (booking) => {
            if (booking.movieId) {
              try {
                const movieResponse = await fetch(`${BASE_URL}/movies/${booking.movieId}`);
                if (movieResponse.ok) {
                  const movieData = await movieResponse.json();
                  return {
                    ...booking,
                    moviePosterPath: movieData.posterPath || booking.moviePosterPath,
                    movieBackdropPath: movieData.backdropPath || booking.movieBackdropPath,
                  };
                }
              } catch (err) {
                console.error('Error fetching movie details:', err);
              }
            }
            return booking;
          })
        );
        
        setBookings(bookingsWithPosters);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const getMoviePosterUrl = (booking) => {
    if (booking.moviePosterPath) {
      if (booking.moviePosterPath.startsWith('http')) {
        return booking.moviePosterPath;
      }
      return `https://image.tmdb.org/t/p/w300${booking.moviePosterPath}`;
    }
    return 'https://placehold.co/300x450?text=No+Image';
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center'>
        <div className='text-center'>
          <div className='inline-block w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4'></div>
          <p className='text-white text-lg'>Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-12'>
      <div className='container mx-auto px-4'>
        
        <div className='text-center mb-12'>
          <h1 className='text-4xl md:text-5xl font-bold text-white mb-4'>
            🎫 User Bookings
          </h1>
          {targetUser && (
            <p className='text-gray-400 mb-4'>
              Viewing bookings for: <span className='text-white font-semibold'>
                {targetUser.name && targetUser.surname 
                  ? `${targetUser.name} ${targetUser.surname}` 
                  : targetUser.name || 'User'
                }
              </span>
            </p>
          )}
          <div className='h-1 w-20 bg-gradient-to-r from-red-600 to-red-800 rounded mx-auto'></div>
        </div>

        {bookings.length === 0 ? (
          <div className='flex flex-col justify-center items-center min-h-[400px] text-center'>
            <div className='text-6xl mb-4'>🎬</div>
            <h3 className='text-2xl font-bold text-white mb-2'>No bookings found</h3>
            <p className='text-gray-400 mb-6'>This user hasn't made any bookings yet</p>
            <button
              onClick={() => navigate('/users')}
              className='px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full font-semibold hover:from-red-500 hover:to-red-600 transition-all duration-300'
            >
              Back to User Management
            </button>
          </div>
        ) : (
          <div className='max-w-6xl mx-auto space-y-6'>
            {bookings.map((booking, index) => (
              <div
                key={booking.orderId || index}
                className='bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-red-900/30 shadow-2xl hover:border-red-600/50 transition-all duration-300'
              >
                <div className='flex flex-col md:flex-row'>
                  
                  <div className='md:w-48 lg:w-56 flex-shrink-0'>
                    <img
                      src={getMoviePosterUrl(booking)}
                      alt={booking.movieTitle}
                      className='w-full h-64 md:h-full object-cover'
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/300x450?text=No+Image';
                      }}
                    />
                  </div>

                  <div className='flex-1 p-6'>
                    <div className='flex flex-col lg:flex-row gap-6'>
                      
                      <div className='flex-1'>
                        <h3 className='text-2xl lg:text-3xl font-bold text-white mb-3'>
                          {booking.movieTitle}
                        </h3>
                        
                        <div className='space-y-2 text-sm lg:text-base'>
                          {booking.movieGenres && (
                            <p className='text-gray-400'>
                              <span className='text-red-500 font-semibold'>🎭 Genres:</span>{' '}
                              {booking.movieGenres}
                            </p>
                          )}
                          
                          {booking.movieLanguage && (
                            <p className='text-gray-400'>
                              <span className='text-red-500 font-semibold'>🗣️ Language:</span>{' '}
                              {booking.movieLanguage.toUpperCase()}
                            </p>
                          )}
                          
                          {booking.movieRuntime && (
                            <p className='text-gray-400'>
                              <span className='text-red-500 font-semibold'>⏱️ Runtime:</span>{' '}
                              {booking.movieRuntime} minutes
                            </p>
                          )}
                          
                          <p className='text-gray-400'>
                            <span className='text-red-500 font-semibold'>📅 Booking Date:</span>{' '}
                            {booking.orderDate 
                              ? new Date(booking.orderDate).toLocaleString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              : 'N/A'
                            }
                          </p>

                          {booking.movieVoteAverage && (
                            <p className='text-gray-400'>
                              <span className='text-red-500 font-semibold'>⭐ Rating:</span>{' '}
                              {booking.movieVoteAverage.toFixed(1)}/10
                            </p>
                          )}
                        </div>
                      </div>

                      <div className='bg-black/40 rounded-xl p-5 border border-gray-800 lg:w-72'>
                        <h4 className='text-white font-semibold mb-3 flex items-center gap-2 text-lg'>
                          <span>🪑</span> Seat Details
                        </h4>
                        
                        <div className='flex flex-wrap gap-2 mb-4'>
                          {booking.seat && booking.seat.length > 0 ? (
                            booking.seat.map((seatNum, idx) => (
                              <span
                                key={idx}
                                className='inline-block bg-red-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold'
                              >
                                Seat {seatNum + 1}
                              </span>
                            ))
                          ) : (
                            <span className='text-gray-500'>No seats selected</span>
                          )}
                        </div>

                        <div className='border-t border-gray-700 pt-4 mt-4'>
                          <p className='text-gray-400 text-sm mb-2'>Total Amount</p>
                          <p className='text-3xl font-bold text-green-500'>
                            €{((booking.moviePrice || 0) * (booking.seat?.length || 1)).toFixed(2)}
                          </p>
                          <p className='text-gray-500 text-xs mt-1'>
                            €{(booking.moviePrice || 0).toFixed(2)} × {booking.seat?.length || 1} {booking.seat?.length === 1 ? 'seat' : 'seats'}
                          </p>
                        </div>

                        <div className='mt-4 pt-4 border-t border-gray-700'>
                          <p className='text-gray-500 text-xs'>
                            Order ID: <span className='text-gray-400 font-mono'>#{booking.orderId}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className='text-center mt-8 flex gap-4 justify-center flex-wrap'>
              <button
                onClick={() => navigate('/users')}
                className='px-8 py-3 bg-transparent border-2 border-gray-700 text-white rounded-full font-semibold hover:border-red-600 hover:bg-red-600/10 transition-all duration-300'
              >
                Back to User Management
              </button>
              <button
                onClick={() => navigate('/')}
                className='px-8 py-3 bg-transparent border-2 border-gray-700 text-white rounded-full font-semibold hover:border-red-600 hover:bg-red-600/10 transition-all duration-300'
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserBookings;