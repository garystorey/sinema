import { Component, DestroyRef, inject, signal, viewChild, ElementRef, afterNextRender } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { Movie } from '../../models/movie';
import { MovieSearchResponse } from '../../models/search';
import { MovieService } from '../../services/movie/movie.service';
import { StorageService } from '../../services/storage/storage.service';
import { RouterLink } from '@angular/router';
import { MoviecardComponent } from "../moviecard/moviecard.component";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [MoviecardComponent, RouterLink],
  providers: [MovieService],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})

export class SearchComponent {
  results = signal<Movie[]>([]);
  searchQuery = signal('');
  lastSearchQuery = signal('');
  totalResults = signal(0);
  currentPage = signal(1);
  totalPages = signal(0);
  recentSearches = signal<string[]>([]);

  searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  private searchSubject = new Subject<string>();
  private destroyRef = inject(DestroyRef);
  private movieService = inject(MovieService);
  private storageService = inject(StorageService);

  constructor() {
    const saved = this.storageService.getItem('recentSearches');
    if (saved) {
      this.recentSearches.set(JSON.parse(saved));
    }

    this.searchSubject.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      filter(query => query.trim().length > 0),
      switchMap(query => {
        const trimmed = query.trim();
        this.lastSearchQuery.set(trimmed);
        this.currentPage.set(1);
        this.storageService.setItem('lastSearchQuery', trimmed);
        return this.movieService.searchMovies(trimmed);
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

    const lastQuery = this.storageService.getItem('lastSearchQuery');
    if (lastQuery) {
      this.searchQuery.set(lastQuery);
      this.searchSubject.next(lastQuery);
    }

    afterNextRender(() => {
      const input = this.searchInput();
      if (input) {
        input.nativeElement.focus();
        input.nativeElement.value = this.searchQuery();
      }
    });
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    this.searchSubject.next(value);
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.lastSearchQuery.set('');
    this.results.set([]);
    this.totalResults.set(0);
    this.totalPages.set(0);
    this.storageService.removeItem('lastSearchQuery');
    const input = this.searchInput();
    if (input) {
      input.nativeElement.value = '';
      input.nativeElement.focus();
    }
  }

  search(): void {
    const query = this.searchQuery().trim();
    if (!query) return;
    this.searchSubject.next(query);
  }

  searchRecent(term: string): void {
    this.searchQuery.set(term);
    const input = this.searchInput();
    if (input) {
      input.nativeElement.value = term;
    }
    this.searchSubject.next(term);
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
