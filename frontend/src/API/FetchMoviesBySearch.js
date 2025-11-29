import FilterValidMovies from '../utils/filterValidMovies';

async function FetchMoviesBySearch(ACCESS_TOKEN, page, searchText) {
  try {
    const promises = [];
    const pagesToFetch = 2;
    
    for (let i = 0; i < pagesToFetch; i++) {
      const currentPage = (page - 1) * pagesToFetch + i + 1;
      const url = `https://api.themoviedb.org/3/search/multi?api_key=${ACCESS_TOKEN}&language=en-US&query=${encodeURIComponent(
        searchText,
      )}&page=${currentPage}&include_adult=false`;
      
      promises.push(
        fetch(url, {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        }).then(res => res.json())
      );
    }

    const responses = await Promise.all(promises);
    
    const totalResults = responses[0].total_results || 0;
    const totalPages = Math.ceil(responses[0].total_pages / pagesToFetch);
    
    const allResults = responses.flatMap(data => data.results || []);
    const filteredMovies = FilterValidMovies(allResults)
      .filter((movie) => movie.backdrop_path !== null)
      .slice(0, 20);

    return { 
      filteredMovies, 
      totalPages,
      totalResults
    };
  } catch (error) {
    console.error('Error fetching movies by search:', error);
    return null;
  }
}

export default FetchMoviesBySearch;