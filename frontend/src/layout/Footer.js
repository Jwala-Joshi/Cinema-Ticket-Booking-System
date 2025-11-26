import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='mt-0 bg-gradient-to-b from-black to-gray-900 text-gray-300 border-t border-red-900/30'>
      <div className='container mx-auto px-4 py-12'>
        
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8'>
          
          <div>
            <h3 className='text-red-600 text-lg font-bold mb-4 uppercase tracking-wider'>
              About Cinema
            </h3>
            <p className='text-sm leading-relaxed mb-4'>
              Your premier destination for booking movie tickets online. Experience the magic of cinema with seamless booking and the best seat selection.
            </p>
            <div className='flex gap-3'>
              <a
                href='#'
                className='w-10 h-10 rounded-full bg-white/5 hover:bg-red-600 flex items-center justify-center transition-all duration-300 hover:scale-110'
                aria-label='Facebook'
              >
                <span className='text-lg'>📘</span>
              </a>
              <a
                href='#'
                className='w-10 h-10 rounded-full bg-white/5 hover:bg-red-600 flex items-center justify-center transition-all duration-300 hover:scale-110'
                aria-label='Twitter'
              >
                <span className='text-lg'>🐦</span>
              </a>
              <a
                href='#'
                className='w-10 h-10 rounded-full bg-white/5 hover:bg-red-600 flex items-center justify-center transition-all duration-300 hover:scale-110'
                aria-label='Instagram'
              >
                <span className='text-lg'>📷</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className='text-red-600 text-lg font-bold mb-4 uppercase tracking-wider'>
              Quick Links
            </h3>
            <ul className='space-y-2'>
              {['Home', 'Movies', 'Now Showing', 'Coming Soon', 'About Us', 'Contact'].map((link) => (
                <li key={link}>
                  <a
                    href='#'
                    className='text-sm hover:text-red-600 transition-all duration-300 hover:translate-x-1 inline-block'
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className='text-red-600 text-lg font-bold mb-4 uppercase tracking-wider'>
              Support
            </h3>
            <ul className='space-y-2'>
              {['Help Center', 'FAQs', 'Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Refund Policy'].map((link) => (
                <li key={link}>
                  <a
                    href='#'
                    className='text-sm hover:text-red-600 transition-all duration-300 hover:translate-x-1 inline-block'
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className='text-red-600 text-lg font-bold mb-4 uppercase tracking-wider'>
              Stay Updated
            </h3>
            <p className='text-sm mb-4'>
              Subscribe to get updates on new movies and exclusive offers!
            </p>
            <div className='flex flex-col gap-2'>
              <input
                type='email'
                placeholder='Enter your email'
                className='px-4 py-2 rounded-full bg-white/5 border border-white/10 focus:border-red-600 focus:outline-none focus:bg-white/10 transition-all duration-300 text-sm'
              />
              <button className='px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full font-semibold hover:from-red-500 hover:to-red-600 transition-all duration-300 text-sm'>
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className='border-t border-white/10 pt-6 mb-6'>
          <p className='text-sm text-center mb-3'>We Accept</p>
          <div className='flex justify-center gap-3 flex-wrap'>
            {['eSewa', 'Khalti', 'IME'].map((payment) => (
              <div
                key={payment}
                className='px-4 py-2 bg-white/5 rounded border border-white/10 hover:border-red-600 hover:bg-white/10 transition-all duration-300 text-xs font-semibold'
              >
                {payment}
              </div>
            ))}
          </div>
        </div>

        <div className='border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4'>
          <p className='text-sm text-gray-500'>
            &copy; {currentYear} <span className='text-red-600 font-semibold'>Cinema Booking</span>. All rights reserved.
          </p>
          <div className='flex gap-6 text-sm flex-wrap justify-center'>
            <a href='#' className='hover:text-red-600 transition-colors duration-300'>
              Privacy
            </a>
            <a href='#' className='hover:text-red-600 transition-colors duration-300'>
              Terms
            </a>
            <a href='#' className='hover:text-red-600 transition-colors duration-300'>
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}