import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  providers: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  searchQuery = signal('');
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      filter(q => q.trim().length > 0),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(q => {
      this.router.navigate([''], { queryParams: { q: q.trim() } });
    });
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    this.searchSubject.next(value);
  }

  submitSearch(): void {
    const q = this.searchQuery().trim();
    if (!q) return;
    this.router.navigate([''], { queryParams: { q } });
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }
}
