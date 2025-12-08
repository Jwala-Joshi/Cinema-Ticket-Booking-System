import React from 'react';

const seats = Array.from({ length: 8 * 8 }, (_, i) => i);

function SeatSelector({
  movie,
  selectedSeats,
  recommendedSeat,
  sessionTime,
  onSelectedSeatsChange,
  onRecommendedSeatChange,
}) {

  function handleSelectedState(seat) {
    const isSelected = selectedSeats.includes(seat);

    if (isSelected) {
      onSelectedSeatsChange(
        selectedSeats.filter((selectedSeat) => selectedSeat !== seat)
      );
    } else {
      onSelectedSeatsChange([...selectedSeats, seat]);
    }

    onRecommendedSeatChange(null);
  }

  return (
    <div className='Cinema'>
      {sessionTime && (
        <p className='info mb-2 text-sm md:text-sm lg:text-base text-white'>
          Session Time: {sessionTime}
        </p>
      )}

      <div className='screen' />

      <div className='seats'>
        {seats.map((seat) => {
          const isSelected = selectedSeats.includes(seat);
          const isOccupied = movie.occupied.includes(seat);
          const showRecommended =
            selectedSeats.length === 0 && recommendedSeat === seat;

          return (
            <span
              tabIndex='0'
              key={seat}
              className={`seat 
                ${isSelected ? 'selected' : ''} 
                ${isOccupied ? 'occupied' : ''} 
                ${showRecommended ? 'recommended' : ''}`}
              onClick={isOccupied ? null : () => handleSelectedState(seat)}
              onKeyPress={
                isOccupied
                  ? null
                  : (e) => e.key === 'Enter' && handleSelectedState(seat)
              }
            />
          );
        })}
      </div>
    </div>
  );
}

export default SeatSelector;
