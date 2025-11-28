package com.cinema.backend.controllers;

import com.cinema.backend.models.CinemaMovie;
import com.cinema.backend.repositories.CinemaMovieRepository;

import io.micrometer.common.lang.NonNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/movies")
@CrossOrigin(origins = "*")
public class CinemaMovieController {

    @Autowired
    private CinemaMovieRepository cinemaMovieRepository;

    @GetMapping("/now-showing")
    public ResponseEntity<List<CinemaMovie>> getNowShowing() {
        List<CinemaMovie> movies = cinemaMovieRepository.findCurrentlyShowing(LocalDate.now());
        return ResponseEntity.ok(movies);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<CinemaMovie>> getUpcoming() {
        List<CinemaMovie> movies = cinemaMovieRepository.findUpcoming(LocalDate.now());
        return ResponseEntity.ok(movies);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addMovie(@RequestBody CinemaMovie movie) {
        try {
            if (cinemaMovieRepository.existsByTmdbId(movie.getTmdbId())) {
                return ResponseEntity.badRequest().body("Movie already exists in cinema");
            }
            
            CinemaMovie savedMovie = cinemaMovieRepository.save(movie);
            return ResponseEntity.ok(savedMovie);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error adding movie: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateMovieStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        try {
            CinemaMovie movie = cinemaMovieRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Movie not found"));
            
            movie.setStatus(status);
            cinemaMovieRepository.save(movie);
            
            return ResponseEntity.ok(movie);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating status: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMovie(@PathVariable Long id) {
        try {
            cinemaMovieRepository.deleteById(id);
            return ResponseEntity.ok("Movie deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting movie: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<CinemaMovie>> getAllMovies() {
        return ResponseEntity.ok(cinemaMovieRepository.findAll());
    }
}