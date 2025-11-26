async function FetchMovieDetails(id, API_KEY) {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`,
      );
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      return null;
    }
  };
  
  export default FetchMovieDetails;