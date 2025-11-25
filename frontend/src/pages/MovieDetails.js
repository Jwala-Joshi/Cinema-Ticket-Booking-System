import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FetchMovieDetails from '../API/GetMovieDetails';
import SeatPlan from '../components/SeatPlan';
import FormatDate from '../utils/formatDate';
import FormatRuntime from '../utils/formatRuntime';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  const API_KEY = process.env.REACT_APP_API_KEY || '';

  useEffect(() => {
    const fetchData = async () => {
      const movieData = await FetchMovieDetails(id, API_KEY);
      setMovie(movieData);
    };

    fetchData();
  }, [id, API_KEY]);

  if (!movie) {
    return (
      <div className='loading'>
        Loading movie details...
      </div>
    );
  }

  return (
    <div className='movie-details-container fade-in'>
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-6xl mx-auto'>
          <div className='movie-hero'>
            <div 
              className='movie-backdrop'
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
              }}
            />
            
            <div className='flex flex-wrap justify-center items-start relative z-10'>
              <div className='w-full md:w-1/2 lg:w-1/3 flex justify-center mb-8 md:mb-0 px-4'>
                <div className='movie-poster-container'>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className='w-full h-auto rounded-lg'
                  />
                </div>
              </div>

              <div className='w-full md:w-1/2 lg:w-2/3 px-6 text-left'>
                <div className='movie-details-info'>
                  <h1 className='movie-title'>{movie.title}</h1>
                  
                  {movie.tagline && (
                    <p className='movie-tagline'>"{movie.tagline}"</p>
                  )}

                  <div className='flex items-center gap-4 mb-4'>
                    <span className='rating-badge'>
                      ⭐ {movie.vote_average.toFixed(1)}
                    </span>
                    <span className='text-gray-300'>
                      {FormatRuntime(movie.runtime)}
                    </span>
                    <span className='text-gray-300'>
                      {FormatDate(movie.release_date)}
                    </span>
                  </div>

                  <div className='info-item'>
                    <span className='info-label'>Overview:</span>
                    <p className='text-gray-200 mt-2 leading-relaxed'>
                      {movie.overview}
                    </p>
                  </div>

                  <div className='info-item'>
                    <span className='info-label'>Genres:</span>
                    <div className='flex flex-wrap gap-2 mt-2'>
                      {movie.genres.map((genre) => (
                        <span 
                          key={genre.id}
                          className='genre-pill text-sm'
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-6'>
                    <div className='info-item'>
                      <span className='info-label'>Budget:</span>
                      <span className='text-gray-200'>
                        {movie.budget ? `$${movie.budget.toLocaleString()}` : 'N/A'}
                      </span>
                    </div>

                    <div className='info-item'>
                      <span className='info-label'>Revenue:</span>
                      <span className='text-gray-200'>
                        {movie.revenue ? `$${movie.revenue.toLocaleString()}` : 'N/A'}
                      </span>
                    </div>

                    <div className='info-item'>
                      <span className='info-label'>Production:</span>
                      <span className='text-gray-200'>
                        {movie.production_companies
                          .slice(0, 3)
                          .map((company) => company.name)
                          .join(', ')}
                      </span>
                    </div>

                    <div className='info-item'>
                      <span className='info-label'>Languages:</span>
                      <span className='text-gray-200'>
                        {movie.spoken_languages
                          .map((lang) => lang.english_name)
                          .join(', ')}
                      </span>
                    </div>
                  </div>

                  {movie.homepage && (
                    <div className='mt-6'>
                      <a
                        className='btn-book inline-block'
                        href={movie.homepage}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        Visit Official Website
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className='mt-12'>
        <SeatPlan movie={movie} />
      </div>
    </div>
  );
};

export default MovieDetails;