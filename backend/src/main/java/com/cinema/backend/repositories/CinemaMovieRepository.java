package com.cinema.backend.repositories;

import com.cinema.backend.models.CinemaMovie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CinemaMovieRepository extends JpaRepository<CinemaMovie, Long> {
    
    List<CinemaMovie> findByStatus(String status);
    
    @Query("SELECT m FROM CinemaMovie m WHERE m.status = 'NOW_SHOWING'")
    List<CinemaMovie> findCurrentlyShowing();
    
    @Query("SELECT m FROM CinemaMovie m WHERE m.status = 'UPCOMING' ORDER BY m.upcomingReleaseDate ASC")
    List<CinemaMovie> findUpcoming();

    @Query("SELECT m FROM CinemaMovie m WHERE m.status = 'ARCHIVED'")
    List<CinemaMovie> findArchivedMovies();

    @Query("SELECT m FROM CinemaMovie m WHERE m.releaseDate <= :currentDate")
    List<CinemaMovie> findMoviesByReleaseDateBefore(LocalDate currentDate);
    
    @Query("SELECT m FROM CinemaMovie m WHERE m.upcomingReleaseDate <= :currentDate")
    List<CinemaMovie> findMoviesByUpcomingReleaseDateBefore(LocalDate currentDate);
    
    boolean existsByTmdbId(Long tmdbId);
    
    CinemaMovie findByTmdbId(Long tmdbId);
}