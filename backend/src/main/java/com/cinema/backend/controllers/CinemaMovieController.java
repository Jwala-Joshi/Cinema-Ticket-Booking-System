package com.cinema.backend.controllers;

import com.cinema.backend.models.CinemaMovie;
import com.cinema.backend.repositories.CinemaMovieRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/movies")
@CrossOrigin(origins = "*")
public class CinemaMovieController {

    @Autowired
    private CinemaMovieRepository cinemaMovieRepository;

    @GetMapping("/now-showing")
    public ResponseEntity<List<CinemaMovie>> getNowShowing() {
        System.out.println("Fetching NOW_SHOWING movies...");
        List<CinemaMovie> movies = cinemaMovieRepository.findByStatus("NOW_SHOWING");
        System.out.println("Found " + movies.size() + " NOW_SHOWING movies");
        return ResponseEntity.ok(movies);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<CinemaMovie>> getUpcoming() {
        System.out.println("Fetching UPCOMING movies...");
        List<CinemaMovie> movies = cinemaMovieRepository.findByStatus("UPCOMING");
        System.out.println("Found " + movies.size() + " UPCOMING movies");
        return ResponseEntity.ok(movies);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addMovie(@RequestBody CinemaMovie movie) {
        try {
            System.out.println("Attempting to add movie: " + movie.getTitle());
            System.out.println("Status: " + movie.getStatus());
            System.out.println("TMDB ID: " + movie.getTmdbId());

            if (cinemaMovieRepository.existsByTmdbId(movie.getTmdbId())) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Movie already exists in cinema");
                errorResponse.put("error", "DUPLICATE_MOVIE");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
            }
            if (movie.getTmdbId() == null || movie.getTitle() == null || movie.getStatus() == null) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Missing required fields: tmdbId, title, or status");
                errorResponse.put("error", "VALIDATION_ERROR");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            if (movie.getAddedDate() == null) {
                movie.setAddedDate(LocalDate.now());
            }

            CinemaMovie savedMovie = cinemaMovieRepository.save(movie);
            System.out.println("Movie saved successfully with ID: " + savedMovie.getId());

            Map<String, Object> successResponse = new HashMap<>();
            successResponse.put("message", "Movie added successfully");
            successResponse.put("movie", savedMovie);

            return ResponseEntity.status(HttpStatus.CREATED).body(successResponse);
        } catch (Exception e) {
            System.err.println("Error adding movie: " + e.getMessage());
            e.printStackTrace();

            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Error adding movie: " + e.getMessage());
            errorResponse.put("error", "INTERNAL_ERROR");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
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
            CinemaMovie updatedMovie = cinemaMovieRepository.save(movie);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Status updated successfully");
            response.put("movie", updatedMovie);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Error updating status: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMovie(@PathVariable Long id) {
        try {
            if (!cinemaMovieRepository.existsById(id)) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Movie not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }

            cinemaMovieRepository.deleteById(id);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Movie deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Error deleting movie: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<CinemaMovie>> getAllMovies() {
        List<CinemaMovie> movies = cinemaMovieRepository.findAll();
        System.out.println("Fetching all movies. Total: " + movies.size());
        return ResponseEntity.ok(movies);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMovieById(@PathVariable Long id) {
        try {
            CinemaMovie movie = cinemaMovieRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Movie not found"));
            return ResponseEntity.ok(movie);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Movie not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    @GetMapping("/tmdb/{tmdbId}")
    public ResponseEntity<?> getMovieByTmdbId(@PathVariable Long tmdbId) {
        try {
            CinemaMovie movie = cinemaMovieRepository.findByTmdbId(tmdbId);
            if (movie == null) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Movie not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            return ResponseEntity.ok(movie);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Error fetching movie: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}