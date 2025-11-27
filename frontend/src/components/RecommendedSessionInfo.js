import React from 'react';
import { Link } from 'react-router-dom';

const RecommendedSessionInfo = ({ movieSessions, movieId }) => {
  const handleSessionSelect = (session) => {
    localStorage.setItem('movieSession', JSON.stringify(session));
  };

  return (
    <div className='mt-2'>
      <div className='space-y-1'>
        {movieSessions.map((session, index) => (
          <Link
            key={index}
            to={`/movie/${movieId}`}
            onClick={() => handleSessionSelect(session)}
            className='block w-full'
          >
            <button className='w-full bg-gradient-to-r from-red-600/80 to-red-700/80 hover:from-red-600 hover:to-red-700 border border-red-500/30 rounded-lg text-left text-white text-xs font-semibold px-2 py-1.5 transition-all duration-300 flex items-center justify-between gap-2'>
              <span className='flex items-center gap-1'>
                <span>🕐</span>
                <span>{session.time}</span>
              </span>
              <span className='bg-black/20 border border-white/20 rounded px-1.5 py-0.5 text-[10px]'>
                {session.language}
              </span>
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecommendedSessionInfo;