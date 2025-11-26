import React from 'react';
import MovieList from '../components/MovieList';

function Home({ searchText }) {
  return (
    <div className='min-h-screen bg-gradient-to-b from-black via-gray-900 to-black'>
      
      <div className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-b from-red-900/20 to-transparent'></div>
        <div className='container mx-auto px-4 py-12 md:py-20 text-center relative z-10'>
          <h1 className='text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 text-white animate-fadeIn'>
            Welcome to <span className='text-red-600'>Cinema</span>
          </h1>
          <p className='text-base md:text-xl text-gray-300 mb-6 max-w-2xl mx-auto animate-fadeIn'>
            🍿 Book your favorite movies • Choose your perfect seats • Enjoy the ultimate cinema experience
          </p>
        </div>
      </div>

      <div className='animate-fadeIn'>
        <MovieList searchText={searchText} />
      </div>
    </div>
  );
}

export default Home;