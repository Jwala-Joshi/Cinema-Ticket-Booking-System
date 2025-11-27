import React, { useEffect, useState } from 'react';
import FetchGenres from '../API/GetGenres';
import RemoveUnwantedGenres from '../utils/removeNonCinemaGenres';

const Genres = ({ setGenreIds }) => {
  const [genres, setGenres] = useState([]);
  const [clickedGenres, setClickedGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN || '';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const fetchedGenres = await FetchGenres(ACCESS_TOKEN);
      const filteredGenres = RemoveUnwantedGenres(fetchedGenres);
      setGenres(filteredGenres);
      setClickedGenres(Array(filteredGenres.length).fill(false));
      setLoading(false);
    };

    fetchData();
  }, [ACCESS_TOKEN]);

  useEffect(() => {
    const updatedGenreIds = clickedGenres
      .map((clicked, index) => (clicked ? genres[index].id : null))
      .filter((id) => id !== null);
    setGenreIds(updatedGenreIds);
  }, [clickedGenres, genres, setGenreIds]);

  const handleGenreClick = (index) => {
    setClickedGenres((prevClickedGenres) => {
      const newClickedGenres = [...prevClickedGenres];
      newClickedGenres[index] = !newClickedGenres[index];
      return newClickedGenres;
    });
  };

  const genreEmojis = {
    28: '💥', // Action
    12: '🏞️', // Adventure
    16: '📽️', // Animation
    35: '😂', // Comedy
    10751: '❤️', // Family
    14: '🧙‍♂️', // Fantasy
    9648: '🔍', // Mystery
    878: '🤖', // Science Fiction
    18: '🎭', // Drama
    27: '👻', // Horror
    53: '😱', // Thriller
    10402: '🎵', // Music
    36: '📜', // History
    10752: '⚔️', // War
    10749: '💑', // Romance
    80: '🔫', // Crime
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center py-8'>
        <div className='inline-block w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin'></div>
      </div>
    );
  }

  return (
    <div className='mb-6'>
      <div className='flex flex-wrap justify-center gap-2 md:gap-3'>
        {genres.map((genre, index) => (
          <button
            key={genre.id}
            onClick={() => handleGenreClick(index)}
            className={`inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
              clickedGenres[index]
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/50 border-2 border-red-500'
                : 'bg-gray-800/50 text-gray-300 border-2 border-gray-700 hover:border-red-600 hover:bg-red-600/10 hover:text-white'
            }`}
          >
            <span className='text-base'>{genreEmojis[genre.id]}</span>
            <span>{genre.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Genres;