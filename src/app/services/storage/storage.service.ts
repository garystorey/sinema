import { Injectable } from '@angular/core';
import { Movie } from '../../models/movie';


// interact with local storage
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private readonly FAVORITES_KEY = 'favorites';

  constructor() { }

  getItem(key: string) {
    return localStorage.getItem(key) as string;
  }

  setItem(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }

  getFavorites(): Movie[] {
    const raw = localStorage.getItem(this.FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  addFavorite(movie: Movie): void {
    const favorites = this.getFavorites();
    if (!favorites.some(f => String(f.id) === String(movie.id))) {
      favorites.push(movie);
      localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favorites));
    }
  }

  removeFavorite(movieId: string): void {
    const favorites = this.getFavorites().filter(f => String(f.id) !== String(movieId));
    localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favorites));
  }

  isFavorite(movieId: string): boolean {
    return this.getFavorites().some(f => String(f.id) === String(movieId));
  }

}
