import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Movie } from '../../models/movie';
import { MovieCredits } from '../../models/credits';
import { MovieCollection } from '../../models/collection';
import { MovieSearchResponse } from '../../models/search';
import { MovieVideosResponse } from '../../models/video';
import { Person, PersonMovieCredits } from '../../models/person';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  http: HttpClient = inject(HttpClient);

  private readonly tmdbBaseUrl = environment.tmdbBaseUrl;
  private readonly tmdbApiKey = environment.tmdbApiKey;

  private buildUrl(path: string, params: Record<string, string | number | undefined> = {}) {
    const url = new URL(`${this.tmdbBaseUrl}/${path.replace(/^\//, '')}`);
    const queryParams = new URLSearchParams({ api_key: this.tmdbApiKey });

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.set(key, String(value));
      }
    });

    url.search = queryParams.toString();
    return url.toString();
  }

  getMovies(searchQuery: string) {
    return this.http.get<Movie[]>(
      this.buildUrl('discover/movie', { query: searchQuery }),
    );
  }

  getMovie(id: number) {
    return this.http.get<Movie>(this.buildUrl(`movie/${id}`));
  }

  getMovieCredits(id: number) {
    return this.http.get<MovieCredits>(this.buildUrl(`movie/${id}/credits`));
  }

  getMovieReviews(id: number) {
    return this.http.get(this.buildUrl(`movie/${id}/reviews`));
  }

  getMovieSimilar(id: number) {
    return this.http.get(this.buildUrl(`movie/${id}/similar`));
  }

  getMovieVideos(id: number) {
    return this.http.get<MovieVideosResponse>(this.buildUrl(`movie/${id}/videos`));
  }

  getMovieImages(id: number) {
    return this.http.get(this.buildUrl(`movie/${id}/images`));
  }

  getMovieRecommendations(id: number) {
    return this.http.get<MovieSearchResponse>(
      this.buildUrl(`movie/${id}/recommendations`),
    );
  }

  getMovieTranslations(id: number) {
    return this.http.get(this.buildUrl(`movie/${id}/translations`));
  }

  getMovieKeywords(id: number) {
    return this.http.get(this.buildUrl(`movie/${id}/keywords`));
  }

  getCollection(id: number) {
    return this.http.get<MovieCollection>(this.buildUrl(`collection/${id}`));
  }

  getGenres() {
    return this.http.get<{ genres: { id: number; name: string }[] }>(
      this.buildUrl('genre/movie/list'),
    );
  }

  searchMovies(query: string, page: number = 1) {
    return this.http.get<MovieSearchResponse>(
      this.buildUrl('search/movie', { query, page }),
    );
  }

  getPerson(id: number) {
    return this.http.get<Person>(this.buildUrl(`person/${id}`));
  }

  getPersonMovieCredits(id: number) {
    return this.http.get<PersonMovieCredits>(
      this.buildUrl(`person/${id}/movie_credits`),
    );
  }
}
