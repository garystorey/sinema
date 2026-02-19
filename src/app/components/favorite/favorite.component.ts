import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Movie } from '../../models/movie';
import { StorageService } from '../../services/storage/storage.service';
import { MoviecardComponent } from '../moviecard/moviecard.component';

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [MoviecardComponent, RouterLink],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.css'
})
export class FavoriteComponent {
  private storageService = inject(StorageService);
  favorites: Movie[] = [];

  constructor() {
    this.favorites = this.storageService.getFavorites();
  }
}
