import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [],
  template: `
    <div class="loading-container">
      <div class="loading-spinner"></div>
      @if (message) {
        <p class="loading-text">{{ message }}</p>
      }
    </div>
  `,
  styles: `
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      gap: 1.25rem;
    }

    .loading-spinner {
      width: 48px;
      height: 48px;
      border: 4px solid var(--bg-card-border, #333);
      border-top-color: var(--accent-info, #3b82f6);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .loading-text {
      color: var(--text-secondary);
      font-size: 1rem;
    }
  `
})
export class LoaderComponent {
  @Input() message: string = '';
}
