import React, { useEffect, useState } from 'react';
import FetchMoviesBySearch from '../API/FetchMoviesBySearch';
import MovieCard from './MovieCard';

const SearchResults = ({ searchText }) => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);

  const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN || '';
  const MOVIES_PER_PAGE = 20;

  useEffect(() => {
    const fetchMovies = async () => {
      if (searchText) {
        setLoading(true);
        const response = await FetchMoviesBySearch(
          ACCESS_TOKEN,
          page,
          searchText,
        );
        if (response) {
          const { filteredMovies, totalPages, totalResults } = response;
          setMovies(filteredMovies);
          setTotalPages(totalPages);
          setTotalResults(totalResults || filteredMovies.length);
        }
        setLoading(false);
      }
    };

    fetchMovies();
  }, [page, searchText, ACCESS_TOKEN]);

  useEffect(() => {
    setPage(1);
  }, [searchText]);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-6'>
        <h2 className='text-2xl md:text-3xl font-bold text-white mb-2 text-center'>
          Search Results for "{searchText}"
        </h2>
        <div className='h-1 w-20 bg-gradient-to-r from-red-600 to-red-800 rounded mx-auto'></div>
      </div>

      {loading ? (
        <div className='flex justify-center items-center min-h-[400px]'>
          <div className='text-center'>
            <div className='inline-block w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4'></div>
            <p className='text-white text-lg'>Searching movies...</p>
          </div>
        </div>
      ) : movies.length === 0 ? (
        <div className='flex flex-col justify-center items-center min-h-[400px] text-center'>
          <div className='text-6xl mb-4'>🔍</div>
          <h3 className='text-2xl font-bold text-white mb-2'>
            No results found for "{searchText}"
          </h3>
          <p className='text-gray-400'>Try searching with different keywords</p>
        </div>
      ) : (
        <>
          <div className='text-center mb-6'>
            <p className='text-gray-300 text-lg'>
              Found <span className='text-red-500 font-bold'>{totalResults}</span> movie{totalResults !== 1 ? 's' : ''}
            </p>
            <p className='text-gray-500 text-sm mt-1'>
              Showing {movies.length} movie{movies.length !== 1 ? 's' : ''} on this page
            </p>
          </div>

          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mb-8'>
            {movies.map((movie) => (
              <div
                key={movie.id}
                className='transform transition-all duration-300 hover:scale-105'
              >
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
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

              {/* <div className='flex items-center gap-2'>
                <span className='text-white font-medium'>
                  Page {page} of {totalPages}
                </span>
              </div> */}

              <button
                onClick={handleNextPage}
                className={`px-8 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                  page === totalPages
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600 hover:shadow-lg hover:shadow-red-500/50 transform hover:-translate-y-0.5'
                }`}
                disabled={page === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;