import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BuyTickets from '../API/BuyTickets';
import getSeatPlan from '../API/GetSeatPlan';
import updateSeatsInHall from '../API/UpdateSeatsInHall';
import generateRandomOccupiedSeats from '../utils/GenerateRandomOccupiedSeats';
import SeatSelector from './SeatSelector';
import SeatShowcase from './SeatShowcase';

const movies = [
  {
    title: '',
    price: 10,
    occupied: generateRandomOccupiedSeats(1, 64, 64),
  },
];

function SeatPlan({ movie }) {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [successPopupVisible, setSuccessPopupVisible] = useState(false);
  const [recommendedSeat, setRecommendedSeat] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const [movieSession, setMovieSession] = useState(null);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [seatPlan, setSeatPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedMovieSession = JSON.parse(localStorage.getItem('movieSession'));
    if (storedMovieSession) {
      setMovieSession(storedMovieSession);
    }
  }, []);

  useEffect(() => {
    const fetchSeatPlan = async () => {
      try {
        setLoading(true);
        if (movieSession && movieSession.time) {
          const data = await getSeatPlan(movie.id, movieSession);
          setSeatPlan(data);
        }
      } catch (error) {
        console.error('Error fetching seat plan:', error);
      } finally {
        setLoading(false);
      }
    };

    if (movieSession) {
      fetchSeatPlan();
    } else {
      setLoading(false);
    }
  }, [movie.id, movieSession]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUserName(storedUser.userName);
      setUserId(storedUser.userId);
    }
  }, []);

  const occupiedSeats =
    seatPlan && seatPlan.length > 0 ? seatPlan : movies[0].occupied;

  const availableSeats = [27, 28, 29, 30, 35, 36, 37, 38, 43, 44, 45, 46];

  const filteredAvailableSeats = availableSeats.filter(
    (seat) => !occupiedSeats.includes(seat),
  );

  useEffect(() => {
    let recommended = null;
    for (let i = 0; i < filteredAvailableSeats.length; i++) {
      const seat = filteredAvailableSeats[i];
      if (!occupiedSeats.includes(seat)) {
        recommended = seat;
        break;
      }
    }
    setRecommendedSeat(recommended);
  }, [filteredAvailableSeats, occupiedSeats]);

  let selectedSeatText = '';
  if (selectedSeats.length > 0) {
    selectedSeatText = selectedSeats.map((seat) => seat + 1).join(', ');
  }

  let totalPrice = selectedSeats.length * movies[0].price;

  const isAnySeatSelected = selectedSeats.length > 0;

  const handleButtonClick = async (e) => {
    e.preventDefault();
    
    if (!isAnySeatSelected || isProcessing) return;

    setIsProcessing(true);

    try {
      const orderSeats = selectedSeats;
      const updatedOccupiedSeats = [...orderSeats, ...occupiedSeats];

      const order = {
        customerId: userId || Math.floor(Math.random() * 1000000),
        userName: userName || '',
        orderDate: new Date().toISOString(),
        seats: [...orderSeats, ...occupiedSeats],
        seat: orderSeats,
        movie: {
          id: movie.id,
          title: movie.title,
          genres: movie.genres.map((genre) => genre.name).join(', '),
          runtime: movie.runtime,
          language: movie.original_language,
          price: movies[0].price,
        },
      };

      const myOrder = {
        customerId: order.customerId,
        orderDate: order.orderDate,
        movieId: order.movie.id,
        movieTitle: order.movie.title,
        movieGenres: order.movie.genres,
        movieRuntime: order.movie.runtime,
        movieLanguage: order.movie.language,
        moviePrice: order.movie.price,
        seat: order.seat,
        userName: order.userName,
      };

      const hallUpdate = {
        movieId: movie.id,
        movieSession: movieSession.time,
        orderTime: order.orderDate,
        updatedSeats: updatedOccupiedSeats,
      };

      const updateSuccess = await updateSeatsInHall(BASE_URL, hallUpdate);

      if (updateSuccess) {
        const buyTickets = await BuyTickets(BASE_URL, myOrder);
        if (buyTickets) {
          setSuccessPopupVisible(true);
          setTimeout(() => {
            setSuccessPopupVisible(false);
            navigate('/');
          }, 2000);
        }
      } else {
        console.error('Failed to update occupied seats in the database');
        alert('Failed to book tickets. Please try again.');
      }
    } catch (error) {
      console.error('Error booking tickets:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[400px]'>
        <div className='text-center'>
          <div className='inline-block w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4'></div>
          <p className='text-white text-lg'>Loading seat plan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-900 to-black py-12'>
      <div className='container mx-auto px-4'>
        
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-white mb-4'>
            Select Your Seats
          </h2>
          <p className='text-gray-400 text-lg'>
            Click on available seats to select them for booking
          </p>
        </div>

        <div className='max-w-4xl mx-auto bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 md:p-10 border border-red-900/30 shadow-2xl'>
          
          <div className='mb-8'>
            <div className='CinemaPlan'>
              <SeatSelector
                movie={{ ...movies[0], occupied: occupiedSeats }}
                selectedSeats={selectedSeats}
                recommendedSeat={recommendedSeat}
                onSelectedSeatsChange={(selectedSeats) =>
                  setSelectedSeats(selectedSeats)
                }
                onRecommendedSeatChange={(recommendedSeat) =>
                  setRecommendedSeat(recommendedSeat)
                }
              />
            </div>
          </div>

          <div className='mb-8'>
            <SeatShowcase />
          </div>

          <div className='bg-black/40 rounded-xl p-6 mb-6 border border-red-900/20'>
            <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
              
              <div className='flex-1'>
                <p className='text-gray-300 mb-2'>
                  <span className='text-white font-semibold text-lg'>
                    {selectedSeats.length}
                  </span>{' '}
                  <span className='text-gray-400'>
                    seat{selectedSeats.length !== 1 ? 's' : ''} selected
                  </span>
                </p>
                
                {selectedSeats.length > 0 && (
                  <div className='flex flex-wrap gap-2 mt-2'>
                    {selectedSeats.map((seat) => (
                      <span
                        key={seat}
                        className='inline-block bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold'
                      >
                        Seat {seat + 1}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {selectedSeats.length > 0 && (
                <div className='text-right'>
                  <p className='text-gray-400 text-sm mb-1'>Total Price</p>
                  <p className='text-3xl font-bold text-red-600'>
                    €{totalPrice}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className='text-center'>
            {isAnySeatSelected ? (
              <button
                className={`px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 transform ${
                  isProcessing
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 hover:shadow-lg hover:shadow-green-500/50 hover:scale-105'
                } text-white shadow-lg`}
                onClick={handleButtonClick}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className='flex items-center gap-3'>
                    <svg className='animate-spin h-5 w-5' viewBox='0 0 24 24'>
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                        fill='none'
                      />
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  `Buy Tickets • €${totalPrice}`
                )}
              </button>
            ) : (
              <div className='text-center py-4'>
                <p className='text-gray-400 text-lg mb-2'>
                  👆 Please select at least one seat to continue
                </p>
                <p className='text-gray-500 text-sm'>
                  Click on any available seat above
                </p>
              </div>
            )}
          </div>

          {movieSession && (
            <div className='mt-6 pt-6 border-t border-gray-800 text-center'>
              <p className='text-gray-400 text-sm'>
                Session: <span className='text-white font-semibold'>{movieSession.time}</span>
              </p>
            </div>
          )}
        </div>

        {successPopupVisible && (
          <div className='fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm animate-fadeIn'>
            <div className='bg-gradient-to-br from-green-600 to-green-700 text-white px-8 py-6 rounded-2xl shadow-2xl transform scale-100 animate-bounce'>
              <div className='flex items-center gap-4'>
                <div className='text-4xl'>✓</div>
                <div>
                  <h3 className='text-2xl font-bold mb-1'>Success!</h3>
                  <p className='text-green-100'>Your tickets have been booked</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SeatPlan;