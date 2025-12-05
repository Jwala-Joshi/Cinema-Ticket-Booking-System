const AddMovieToDatabase = async (movieData) => {
  try {
    const response = await fetch('http://localhost:8080/api/v1/movies/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(movieData),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.message || 'Failed to add movie';
      throw new Error(errorMessage);
    }

    return { success: true, data: data.movie || data };
  } catch (error) {
    console.error('Error adding movie:', error);
    return { success: false, error: error.message };
  }
};

export default AddMovieToDatabase;