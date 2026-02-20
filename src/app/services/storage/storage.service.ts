import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Movie } from '../../models/movie';

// interact with local storage
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private readonly FAVORITES_KEY = 'favorites';

  constructor(@Inject(PLATFORM_ID) private platformId: object) { }

  private getStorage(): Storage | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    try {
      return localStorage;
    } catch {
      return null;
    }
  }

  getItem(key: string): string | null {
    try {
      return this.getStorage()?.getItem(key) ?? null;
    } catch {
      return null;
    }
  }

  setItem(key: string, value: string): void {
    try {
      this.getStorage()?.setItem(key, value);
    } catch {
      // no-op when storage is unavailable
    }
  }

  removeItem(key: string): void {
    try {
      this.getStorage()?.removeItem(key);
    } catch {
      // no-op when storage is unavailable
    }
  }

  clear(): void {
    try {
      this.getStorage()?.clear();
    } catch {
      // no-op when storage is unavailable
    }
  }

  getFavorites(): Movie[] {
    const raw = this.getItem(this.FAVORITES_KEY);

    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw) as Movie[];
    } catch {
      return [];
    }
  }

  addFavorite(movie: Movie): void {
    const favorites = this.getFavorites();

    if (!favorites.some(f => String(f.id) === String(movie.id))) {
      favorites.push(movie);
      this.setItem(this.FAVORITES_KEY, JSON.stringify(favorites));
    }
  }

  removeFavorite(movieId: string): void {
    const favorites = this.getFavorites().filter(f => String(f.id) !== String(movieId));
    this.setItem(this.FAVORITES_KEY, JSON.stringify(favorites));
  }

  isFavorite(movieId: string): boolean {
    return this.getFavorites().some(f => String(f.id) === String(movieId));
  }

}
