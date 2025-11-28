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
    
    @Query("SELECT m FROM CinemaMovie m WHERE m.status = 'NOW_SHOWING' " +
           "AND m.showingStartDate <= :currentDate " +
           "AND (m.showingEndDate IS NULL OR m.showingEndDate >= :currentDate)")
    List<CinemaMovie> findCurrentlyShowing(LocalDate currentDate);
    
    @Query("SELECT m FROM CinemaMovie m WHERE m.status = 'UPCOMING' " +
           "AND m.releaseDate > :currentDate ORDER BY m.releaseDate ASC")
    List<CinemaMovie> findUpcoming(LocalDate currentDate);
    
    boolean existsByTmdbId(Long tmdbId);
    
    CinemaMovie findByTmdbId(Long tmdbId);
}