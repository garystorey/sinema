import { Component, Input } from '@angular/core';
import { Movie } from '../../models/movie';
import { RouterLink } from '@angular/router';
import { TMDB_POSTER_W500_URL } from '../../app.config';

@Component({
  selector: 'app-moviecard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './moviecard.component.html',
  styleUrl: './moviecard.component.css'
})
export class MoviecardComponent {
  @Input() movie: Movie = {} as Movie;
  readonly posterPath: string = TMDB_POSTER_W500_URL;


}
