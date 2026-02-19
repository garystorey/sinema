import { Component, Input } from '@angular/core';
import { Movie } from '../../models/movie';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-moviecard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './moviecard.component.html',
  styleUrl: './moviecard.component.css'
})
export class MoviecardComponent {
  @Input() movie: Movie = {} as Movie;
  posterPath: string = 'https://image.tmdb.org/t/p/w500';


}
