package com.cinema.backend.services;

import com.cinema.backend.models.CinemaMovie;
import com.cinema.backend.repositories.CinemaMovieRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class MovieStatusUpdaterService {

    @Autowired
    private CinemaMovieRepository cinemaMovieRepository;

    private static List<LocalDateTime> generateStaticShowtimes() {
        LocalDate today = LocalDate.now();
        return List.of(
                LocalDateTime.of(today, java.time.LocalTime.of(9, 30)),
                LocalDateTime.of(today, java.time.LocalTime.of(13, 45)),
                LocalDateTime.of(today, java.time.LocalTime.of(17, 0))
        );
    }

    @Transactional
    public void updateUpcomingMovies() {
        LocalDate currentDate = LocalDate.now();

        List<CinemaMovie> upcomingMovies = cinemaMovieRepository.findUpcoming();

        for (CinemaMovie movie : upcomingMovies) {
            if (movie.getUpcomingReleaseDate().isBefore(currentDate) || movie.getUpcomingReleaseDate().isEqual(currentDate)) {
                movie.setStatus("NOW_SHOWING");
                movie.setShowTimes(new ArrayList<>(generateStaticShowtimes()));
                movie.setUpcomingReleaseDate(null);
            }
        }
        cinemaMovieRepository.saveAll(upcomingMovies);
    }

    @Transactional
    public void updateNowShowingMovies() {

        LocalDate today = LocalDate.now();
        List<CinemaMovie> nowShowingMovies = cinemaMovieRepository.findCurrentlyShowing();

        for (CinemaMovie movie : nowShowingMovies) {

            List<LocalDateTime> originalShowtimes = movie.getShowTimes();

            List<LocalDateTime> validShowtimes = originalShowtimes.stream()
                    .filter(st -> !st.toLocalDate().isBefore(today))
                    .toList();

            if (validShowtimes.isEmpty()) {
                movie.setStatus("ARCHIVED");
                movie.getShowTimes().clear();

                System.out.println("ARCHIVED → " + movie.getTitle());
                continue;
            }

            if (validShowtimes.size() != originalShowtimes.size()) {
                movie.setShowTimes(new ArrayList<>(validShowtimes));
                System.out.println("UPDATED showtimes → " + movie.getTitle());
            }
        }

        cinemaMovieRepository.saveAll(nowShowingMovies);
    }

    public void updateMovieStatuses() {
        updateUpcomingMovies();
        updateNowShowingMovies();
    }
}
