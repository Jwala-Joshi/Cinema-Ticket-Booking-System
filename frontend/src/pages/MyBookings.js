import React, { useState, useEffect } from 'react';
import { isLoggedIn } from '../utils/Auth';
import { useNavigate } from 'react-router-dom';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const loggedInUser = isLoggedIn();
    if (!loggedInUser) {
      navigate('/');
    } else {
      setUser(loggedInUser);
      fetchBookings(loggedInUser.userId);
    }
  }, [navigate]);

  const fetchBookings = async (userId) => {
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
        setBookings(Array.isArray(data) ? data : (data ? [data] : []));
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

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center'>
        <div className='text-center'>
          <div className='inline-block w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4'></div>
          <p className='text-white text-lg'>Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-12'>
      <div className='container mx-auto px-4'>
        
        <div className='text-center mb-12'>
          <h1 className='text-4xl md:text-5xl font-bold text-white mb-4'>
            🎫 My Bookings
          </h1>
          <p className='text-gray-400 mb-4'>
            View all your movie ticket bookings
          </p>
          <div className='h-1 w-20 bg-gradient-to-r from-red-600 to-red-800 rounded mx-auto'></div>
        </div>

        {bookings.length === 0 ? (
          <div className='flex flex-col justify-center items-center min-h-[400px] text-center'>
            <div className='text-6xl mb-4'>🎬</div>
            <h3 className='text-2xl font-bold text-white mb-2'>No bookings yet</h3>
            <p className='text-gray-400 mb-6'>Start booking your favorite movies!</p>
            <button
              onClick={() => navigate('/')}
              className='px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full font-semibold hover:from-red-500 hover:to-red-600 transition-all duration-300'
            >
              Browse Movies
            </button>
          </div>
        ) : (
          <div className='max-w-4xl mx-auto space-y-6'>
            {bookings.map((booking, index) => (
              <div
                key={booking.orderId || index}
                className='bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-red-900/30 shadow-2xl hover:border-red-600/50 transition-all duration-300'
              >
                <div className='flex flex-col md:flex-row gap-6'>
                  
                  <div className='md:w-48 lg:w-56 flex-shrink-0'>
                    <img
                      src={
                        booking.movieId
                          ? `https://image.tmdb.org/t/p/w300${booking.movieId}`
                          : 'https://via.placeholder.com/300x450?text=No+Image'
                      }
                      alt={booking.movieTitle}
                      className='w-full h-64 md:h-full object-cover'
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
                      }}
                    />
                  </div>

                  <div className='flex-1'>
                    <h3 className='text-2xl font-bold text-white mb-2'>
                      {booking.movieTitle}
                    </h3>
                    
                    <div className='space-y-2 text-sm'>
                      <p className='text-gray-400'>
                        <span className='text-red-500 font-semibold'>Genres:</span>{' '}
                        {booking.movieGenres}
                      </p>
                      
                      <p className='text-gray-400'>
                        <span className='text-red-500 font-semibold'>Language:</span>{' '}
                        {booking.movieLanguage?.toUpperCase() || 'N/A'}
                      </p>
                      
                      <p className='text-gray-400'>
                        <span className='text-red-500 font-semibold'>Runtime:</span>{' '}
                        {booking.movieRuntime} minutes
                      </p>
                      
                      <p className='text-gray-400'>
                        <span className='text-red-500 font-semibold'>Booking Date:</span>{' '}
                        {booking.orderDate ? new Date(booking.orderDate).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className='bg-black/40 rounded-xl p-4 border border-gray-800 md:w-64'>
                    <h4 className='text-white font-semibold mb-3 flex items-center gap-2'>
                      <span>🪑</span> Seat Details
                    </h4>
                    
                    <div className='flex flex-wrap gap-2 mb-4'>
                      {booking.seat && booking.seat.map((seatNum, idx) => (
                        <span
                          key={idx}
                          className='inline-block bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold'
                        >
                          {seatNum + 1}
                        </span>
                      ))}
                    </div>

                    <div className='border-t border-gray-700 pt-3 mt-3'>
                      <p className='text-gray-400 text-sm mb-1'>Total Price</p>
                      <p className='text-2xl font-bold text-green-500'>
                        €{booking.moviePrice * (booking.seat?.length || 1)}
                      </p>
                    </div>

                    <div className='mt-3'>
                      <p className='text-gray-500 text-xs'>
                        Order ID: #{booking.orderId}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className='text-center mt-8'>
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

export default MyBookings;