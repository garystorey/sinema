import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { Movie } from '../../models/movie';
import { MovieSearchResponse } from '../../models/search';
import { MovieService } from '../../services/movie/movie.service';
import { StorageService } from '../../services/storage/storage.service';
import { MoviecardComponent } from "../moviecard/moviecard.component";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [MoviecardComponent],
  providers: [MovieService],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})

export class SearchComponent {
  results = signal<Movie[]>([]);
  lastSearchQuery = signal('');
  totalResults = signal(0);
  currentPage = signal(1);
  totalPages = signal(0);
  recentSearches = signal<string[]>([]);

  private destroyRef = inject(DestroyRef);
  private movieService = inject(MovieService);
  private storageService = inject(StorageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor() {
    const saved = this.storageService.getItem('recentSearches');
    if (saved) {
      this.recentSearches.set(JSON.parse(saved));
    }

    this.route.queryParams.pipe(
      switchMap(params => {
        const q = (params['q'] || '').trim();
        return [q];
      }),
      distinctUntilChanged(),
      filter(query => query.length > 0),
      switchMap(query => {
        this.lastSearchQuery.set(query);
        this.currentPage.set(1);
        this.storageService.setItem('lastSearchQuery', query);
        return this.movieService.searchMovies(query);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (response: MovieSearchResponse) => {
        this.results.set(response.results);
        this.totalResults.set(response.total_results);
        this.totalPages.set(response.total_pages);
        this.addToRecentSearches(this.lastSearchQuery());
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  searchRecent(term: string): void {
    this.router.navigate([''], { queryParams: { q: term } });
  }

  goToPage(page: number): void {
    const query = this.lastSearchQuery();
    if (!query || page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.movieService.searchMovies(query, page).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (response: MovieSearchResponse) => {
        this.results.set(response.results);
        this.totalResults.set(response.total_results);
        this.totalPages.set(response.total_pages);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (error) => console.error(error)
    });
  }

  nextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }

  prevPage(): void {
    this.goToPage(this.currentPage() - 1);
  }

  clearRecentSearches(): void {
    this.recentSearches.set([]);
    this.storageService.removeItem('recentSearches');
  }

  private addToRecentSearches(query: string): void {
    const updated = this.recentSearches().filter(s => s.toLowerCase() !== query.toLowerCase());
    updated.unshift(query);
    const trimmed = updated.length > 8 ? updated.slice(0, 8) : updated;
    this.recentSearches.set(trimmed);
    this.storageService.setItem('recentSearches', JSON.stringify(trimmed));
  }
}
