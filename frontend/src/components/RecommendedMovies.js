import React, { useEffect, useState } from 'react';
import FetchMoviesByGenre from '../API/FetchMoviesByGenre';
import GetRecommendedMovies from '../API/GetRecommendedMovies';
import { isLoggedIn } from '../utils/Auth';
import RecommendedMovieCard from './RecommendedMovieCard';

const genres = {
  Action: 28,
  Adventure: 12,
  Animation: 16,
  Comedy: 35,
  Family: 10751,
  Fantasy: 14,
  Mystery: 9648,
  ScienceFiction: 878,
  Drama: 18,
  Horror: 27,
  Thriller: 53,
  Music: 10402,
  History: 36,
  War: 10752,
  Romance: 10749,
  Crime: 80,
};

const RecommendedMovies = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [userId, setUserId] = useState(null);
  const [genreIds, setGenreIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const userLoggedIn = isLoggedIn();

  const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN || '';

  useEffect(() => {
    const fetchMoviesByGenre = async () => {
      if (genreIds.length > 0) {
        setLoading(true);
        const response = await FetchMoviesByGenre(ACCESS_TOKEN, page, genreIds);
        if (response) {
          const { filteredMovies, totalPages } = response;
          // Remove duplicate movies using movie.id
          const uniqueMovies = Array.from(
            new Map(filteredMovies.map(movie => [movie.id, movie]))
          ).map(([_, movie]) => movie);

          // Also remove movies user already watched
          const watchedMovieIds = new Set(recommendedMovies.map(order => order.movieId));

          const finalMovies = uniqueMovies.filter(movie => !watchedMovieIds.has(movie.id));

          setMovies(finalMovies);
          setTotalPages(totalPages);
        }
        setLoading(false);
      }
    };

    fetchMoviesByGenre();
  }, [page, genreIds, ACCESS_TOKEN]);

  useEffect(() => {
    const fetchRecommendedMovies = async () => {
      if (userId) {
        const recommendedMoviesData = await GetRecommendedMovies(userId);

        if (Array.isArray(recommendedMoviesData) && recommendedMoviesData.length > 0) {

          // Count genre frequency
          const genreFrequency = {};

          recommendedMoviesData.forEach(order => {
            let genresList = [];

            if (Array.isArray(order.movieGenres)) {
              genresList = order.movieGenres;
            } else if (typeof order.movieGenres === "string") {
              genresList = order.movieGenres.split(",").map(g => g.trim());
            }

            genresList.forEach(g => {
              genreFrequency[g] = (genreFrequency[g] || 0) + 1;
            });
          });

          // Sort genres by frequency (descending)
          const sortedGenres = Object.keys(genreFrequency)
            .sort((a, b) => genreFrequency[b] - genreFrequency[a]);

          // Convert sorted genre names -> TMDB IDs
          const recommendedGenreIds = sortedGenres
            .map(g => genres[g])
            .filter(Boolean);

          setGenreIds(recommendedGenreIds);
          setRecommendedMovies(recommendedMoviesData);
        }
      }
    };

    fetchRecommendedMovies();
  }, [userId]);

  useEffect(() => {
    if (movies.length > 0) {
      setTotalPages(Math.ceil(movies.length / 6));
    } else {
      setTotalPages(1);
    }
  }, [movies]);

  useEffect(() => {
    if (userLoggedIn) {
      setUserId(userLoggedIn.userId);
    }
  }, [userLoggedIn]);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const startIndex = (page - 1) * 6;
  const displayedMovies = movies.slice(startIndex, startIndex + 6);

  if (genreIds.length === 0) {
    return null;
  }

  return (
    <div className='container mx-auto px-4 py-8 mb-8'>
      <div className='mb-6'>
        <h2 className='text-2xl text-left md:text-3xl font-bold text-white mb-2'>
          Recommended For You
        </h2>
        <div className='h-1 w-20 bg-gradient-to-r from-red-600 to-red-800 rounded'></div>
      </div>

      {loading ? (
        <div className='flex justify-center items-center min-h-[400px]'>
          <div className='text-center'>
            <div className='inline-block w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4'></div>
            <p className='text-white text-lg'>Loading recommendations...</p>
          </div>
        </div>
      ) : displayedMovies.length === 0 ? (
        <div className='flex flex-col justify-center items-center min-h-[400px] text-center'>
          <div className='text-6xl mb-4'>🎭</div>
          <h3 className='text-2xl font-bold text-white mb-2'>No recommendations yet</h3>
          <p className='text-gray-400'>Watch some movies to get personalized recommendations!</p>
        </div>
      ) : (
        <>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 mb-8'>
            {displayedMovies.map((movie, index) => (
              <div
                key={movie.id}
                className='transform transition-all duration-300 hover:scale-105'
              >
                <RecommendedMovieCard movie={movie} hallNumber={index} />
              </div>
            ))}
          </div>

          <div className='flex flex-col sm:flex-row justify-center items-center gap-4 mt-12'>
            <button
              onClick={handlePrevPage}
              className={`px-8 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                page === 1
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600 hover:shadow-lg hover:shadow-red-500/50 transform hover:-translate-y-0.5'
              }`}
              disabled={page === 1}
            >
              ← Previous
            </button>

            <button
              onClick={handleNextPage}
              className={`px-8 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                page === totalPages
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600 hover:shadow-lg hover:shadow-red-500/50 transform hover:-translate-y-0.5'
              }`}
              disabled={page >= totalPages}
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default RecommendedMovies;
