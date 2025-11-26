import React, { useState } from 'react';

const Search = ({ onSearch }) => {
  const [search, setSearch] = useState('');

  const handleChange = (event) => {
    const searchText = event.target.value;
    setSearch(searchText);
    onSearch(searchText);
  };

  const handleClear = () => {
    setSearch('');
    onSearch('');
  };

  return (
    <div className='relative w-full'>
      <div className='relative'>
        <input
          type='text'
          placeholder='Search movies...'
          className='w-full px-5 py-2.5 pl-12 pr-12 rounded-full bg-white/10 border-2 border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-red-600 focus:bg-white/15 transition-all duration-300 text-sm md:text-base'
          value={search}
          onChange={handleChange}
        />

        <div className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            />
          </svg>
        </div>

        {search && (
          <button
            onClick={handleClear}
            className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 transition-colors duration-300'
            aria-label='Clear search'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Search;