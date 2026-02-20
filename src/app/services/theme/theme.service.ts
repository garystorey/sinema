import { Injectable, signal } from '@angular/core';

export interface Theme {
  id: string;
  label: string;
}

export const THEMES: Theme[] = [
  { id: 'default', label: 'Default' },
  { id: 'night-owl', label: 'Night Owl' },
  { id: 'monokai', label: 'Monokai' },
];

const STORAGE_KEY = 'app-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  current = signal<string>(this.load());

  constructor() {
    this.apply(this.current());
  }

  set(themeId: string): void {
    this.current.set(themeId);
    this.apply(themeId);
    localStorage.setItem(STORAGE_KEY, themeId);
  }

  private load(): string {
    return localStorage.getItem(STORAGE_KEY) ?? 'default';
  }

  private apply(themeId: string): void {
    document.body.setAttribute('data-theme', themeId);
  }
}
