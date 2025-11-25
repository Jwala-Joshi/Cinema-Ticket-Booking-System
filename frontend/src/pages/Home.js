import React from 'react';
import MovieList from '../components/MovieList';

function Home({ searchText }) {
  return (
    <div className='min-h-screen pt-20 pb-10'>
      <div className='text-center py-12 px-4'>
        <h1 className='text-5xl md:text-6xl font-bold mb-4 text-white'>
          Welcome to <span className='text-red-600'>Cinema</span>
        </h1>
        <p className='text-xl text-gray-300 mb-8'>
          Book your favorite movies and enjoy the best cinema experience
        </p>
      </div>

      <div className='fade-in'>
        <MovieList 
          searchText={searchText}
        />
      </div>
    </div>
  );
}

export default Home;