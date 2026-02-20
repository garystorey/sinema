import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

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

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
    this.apply(this.current());
  }

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

  set(themeId: string): void {
    this.current.set(themeId);
    this.apply(themeId);

    try {
      this.getStorage()?.setItem(STORAGE_KEY, themeId);
    } catch {
      // no-op when storage is unavailable
    }
  }

  private load(): string {
    try {
      return this.getStorage()?.getItem(STORAGE_KEY) ?? 'default';
    } catch {
      return 'default';
    }
  }

  private apply(themeId: string): void {
    if (!isPlatformBrowser(this.platformId) || !this.document?.body) {
      return;
    }

    this.document.body.setAttribute('data-theme', themeId);
  }
}
