import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { ThemeService, THEMES } from '../../services/theme/theme.service';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  templateUrl: './theme-switcher.component.html',
  styleUrl: './theme-switcher.component.css',
})
export class ThemeSwitcherComponent {
  themeService = inject(ThemeService);
  themes = THEMES;
  open = signal(false);

  private elRef = inject(ElementRef);

  toggle(): void {
    this.open.update(v => !v);
  }

  pick(id: string): void {
    this.themeService.set(id);
    this.open.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent): void {
    if (!this.elRef.nativeElement.contains(e.target)) {
      this.open.set(false);
    }
  }
}
