package com.cinema.backend;

import com.cinema.backend.services.MovieStatusUpdaterService;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.boot.context.event.ApplicationReadyEvent;

@Component
public class MovieStatusStartupRunner {

    private final MovieStatusUpdaterService movieStatusUpdaterService;

    public MovieStatusStartupRunner(MovieStatusUpdaterService movieStatusUpdaterService) {
        this.movieStatusUpdaterService = movieStatusUpdaterService;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void runAfterStartup() {
        movieStatusUpdaterService.updateMovieStatuses();
        System.out.println("Movie statuses updated on backend startup!");
    }
}
