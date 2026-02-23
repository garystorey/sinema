import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Movie } from '../../models/movie';
import { MovieCredits } from '../../models/credits';
import { MovieCollection } from '../../models/collection';
import { MovieSearchResponse } from '../../models/search';
import { MovieVideosResponse } from '../../models/video';
import { Person, PersonMovieCredits } from '../../models/person';
import { environment } from '../../../environments/environment';

// connect to to tmdb api
// https://api.themoviedb.org/3/discover/movie?api_key=YOUR_API_KEY

const YOUR_API_KEY = environment.tmdbApiKey;

@Injectable({
  providedIn: 'root',

})
export class MovieService {

  http: HttpClient = inject(HttpClient);


  getMovies(searchQuery: string) {
    if(searchQuery) {
      return this.http.get<Movie[]>(`https://api.themoviedb.org/3/discover/movie?api_key=${YOUR_API_KEY}&query=${searchQuery}`);
    }
    return this.http.get<Movie[]>(`https://api.themoviedb.org/3/discover/movie?api_key=${YOUR_API_KEY}`);
  }

  getMovie(id: number) {
    return this.http.get<Movie>(`https://api.themoviedb.org/3/movie/${id}?api_key=${YOUR_API_KEY}`);
  }

  getMovieCredits(id: number) {
    return this.http.get<MovieCredits>(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${YOUR_API_KEY}`);
  }

  getMovieReviews(id: number) {
    return this.http.get(`https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${YOUR_API_KEY}`);
  }

  getMovieSimilar(id: number) {
    return this.http.get(`https://api.themoviedb.org/3/movie/${id}/similar?api_key=${YOUR_API_KEY}`);
  }

  getMovieVideos(id: number) {
    return this.http.get<MovieVideosResponse>(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${YOUR_API_KEY}`);
  }

  getMovieImages(id: number) {
    return this.http.get(`https://api.themoviedb.org/3/movie/${id}/images?api_key=${YOUR_API_KEY}`);
  }

  getMovieRecommendations(id: number) {
    return this.http.get<MovieSearchResponse>(`https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${YOUR_API_KEY}`);
  }

  getMovieTranslations(id: number) {
    return this.http.get(`https://api.themoviedb.org/3/movie/${id}/translations?api_key=${YOUR_API_KEY}`);
  }

  getMovieKeywords(id: number) {
    return this.http.get(`https://api.themoviedb.org/3/movie/${id}/keywords?api_key=${YOUR_API_KEY}`);
  }

  getCollection(id: number) {
    return this.http.get<MovieCollection>(`https://api.themoviedb.org/3/collection/${id}?api_key=${YOUR_API_KEY}`);
  }

  getGenres() {
    return this.http.get<{ genres: { id: number; name: string }[] }>(`https://api.themoviedb.org/3/genre/movie/list?api_key=${YOUR_API_KEY}`);
  }

  searchMovies(query: string, page: number = 1) {
    return this.http.get<MovieSearchResponse>(`https://api.themoviedb.org/3/search/movie?api_key=${YOUR_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
  }

  getPerson(id: number) {
    return this.http.get<Person>(`https://api.themoviedb.org/3/person/${id}?api_key=${YOUR_API_KEY}`);
  }

  getPersonMovieCredits(id: number) {
    return this.http.get<PersonMovieCredits>(`https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${YOUR_API_KEY}`);
  }

}
