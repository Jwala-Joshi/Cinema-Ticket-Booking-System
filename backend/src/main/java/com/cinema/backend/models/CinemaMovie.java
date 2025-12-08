package com.cinema.backend.models;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "cinema_movies")
public class CinemaMovie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long tmdbId;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String overview;

    private String posterPath;

    private String backdropPath;

    private LocalDate releaseDate;

    private Double voteAverage;

    @Column(nullable = false)
    private String status; // NOW_SHOWING / UPCOMING / ARCHIVED

    @Column(nullable = false)
    private LocalDate addedDate;

    private LocalDate upcomingReleaseDate;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "movie_showtimes", joinColumns = @JoinColumn(name = "movie_id"))
    @Column(name = "show_times")
    private List<LocalDateTime> showTimes = new ArrayList<>();

    public CinemaMovie() {
        this.addedDate = LocalDate.now();
        this.status = "UPCOMING";
        this.showTimes = new ArrayList<>();
    }

    public CinemaMovie(Long tmdbId, String title, String overview, String posterPath,
            String backdropPath, LocalDate releaseDate, Double voteAverage, String status) {
        this.tmdbId = tmdbId;
        this.title = title;
        this.overview = overview;
        this.posterPath = posterPath;
        this.backdropPath = backdropPath;
        this.releaseDate = releaseDate;
        this.voteAverage = voteAverage;
        this.status = status;
        this.addedDate = LocalDate.now();
        this.showTimes = new ArrayList<>();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTmdbId() {
        return tmdbId;
    }

    public void setTmdbId(Long tmdbId) {
        this.tmdbId = tmdbId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getOverview() {
        return overview;
    }

    public void setOverview(String overview) {
        this.overview = overview;
    }

    public String getPosterPath() {
        return posterPath;
    }

    public void setPosterPath(String posterPath) {
        this.posterPath = posterPath;
    }

    public String getBackdropPath() {
        return backdropPath;
    }

    public void setBackdropPath(String backdropPath) {
        this.backdropPath = backdropPath;
    }

    public LocalDate getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(LocalDate releaseDate) {
        this.releaseDate = releaseDate;
    }

    public Double getVoteAverage() {
        return voteAverage;
    }

    public void setVoteAverage(Double voteAverage) {
        this.voteAverage = voteAverage;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getAddedDate() {
        return addedDate;
    }

    public void setAddedDate(LocalDate addedDate) {
        this.addedDate = addedDate;
    }

    public LocalDate getUpcomingReleaseDate() {
        return upcomingReleaseDate;
    }

    public void setUpcomingReleaseDate(LocalDate upcomingReleaseDate) {
        this.upcomingReleaseDate = upcomingReleaseDate;
    }

    public List<LocalDateTime> getShowTimes() {
        return showTimes;
    }

    public void setShowTimes(List<LocalDateTime> showTimes) {
        this.showTimes = showTimes;
    }

    @Override
    public String toString() {
        return "CinemaMovie{" +
                "id=" + id +
                ", tmdbId=" + tmdbId +
                ", title='" + title + '\'' +
                ", status='" + status + '\'' +
                ", addedDate=" + addedDate +
                ", showTimes=" + showTimes.size() +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof CinemaMovie))
            return false;
        CinemaMovie that = (CinemaMovie) o;
        return Objects.equals(tmdbId, that.tmdbId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(tmdbId);
    }
}