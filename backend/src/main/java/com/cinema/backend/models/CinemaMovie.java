package com.cinema.backend.models;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.Objects;

@Entity
@Table(name = "cinema_movies")
public class CinemaMovie {
    
    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    @Column(nullable = false)
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
    private String status; // "NOW_SHOWING", "UPCOMING", "ARCHIVED"
    
    private LocalDate showingStartDate;
    
    private LocalDate showingEndDate;
    
    @Column(nullable = false)
    private LocalDate addedDate;

    public CinemaMovie() {
        this.addedDate = LocalDate.now();
        this.status = "UPCOMING";
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

    public LocalDate getShowingStartDate() {
        return showingStartDate;
    }

    public void setShowingStartDate(LocalDate showingStartDate) {
        this.showingStartDate = showingStartDate;
    }

    public LocalDate getShowingEndDate() {
        return showingEndDate;
    }

    public void setShowingEndDate(LocalDate showingEndDate) {
        this.showingEndDate = showingEndDate;
    }

    public LocalDate getAddedDate() {
        return addedDate;
    }

    public void setAddedDate(LocalDate addedDate) {
        this.addedDate = addedDate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CinemaMovie that = (CinemaMovie) o;
        return Objects.equals(id, that.id) && 
               Objects.equals(tmdbId, that.tmdbId) && 
               Objects.equals(title, that.title) && 
               Objects.equals(status, that.status);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, tmdbId, title, status);
    }

    @Override
    public String toString() {
        return "CinemaMovie{" +
                "id=" + id +
                ", tmdbId=" + tmdbId +
                ", title='" + title + '\'' +
                ", releaseDate=" + releaseDate +
                ", status='" + status + '\'' +
                ", showingStartDate=" + showingStartDate +
                ", showingEndDate=" + showingEndDate +
                '}';
    }
}