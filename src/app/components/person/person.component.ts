import { Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { switchMap, filter } from 'rxjs/operators';
import { Person } from '../../models/person';
import { Movie } from '../../models/movie';
import { MovieService } from '../../services/movie/movie.service';
import { MoviecardComponent } from '../moviecard/moviecard.component';

@Component({
  selector: 'app-person',
  standalone: true,
  imports: [MoviecardComponent],
  providers: [MovieService],
  templateUrl: './person.component.html',
  styleUrl: './person.component.css'
})
export class PersonComponent {

  private movieService = inject(MovieService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  person: Person = {} as Person;
  actingMovies: Movie[] = [];
  crewMovies: Movie[] = [];
  profileFailed: boolean = false;
  profilePath: string = 'https://image.tmdb.org/t/p/w500';

  constructor() {
    this.route.paramMap.pipe(
      filter(params => params.has('id')),
      switchMap(params => {
        const id = +params.get('id')!;
        return forkJoin({
          person: this.movieService.getPerson(id),
          credits: this.movieService.getPersonMovieCredits(id)
        });
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: ({ person, credits }) => {
        this.person = person;
        this.profileFailed = false;

        const toMovie = (c: any): Movie => ({
          id: String(c.id),
          title: c.title,
          poster_path: c.poster_path ?? '',
          overview: c.overview,
          release_date: c.release_date,
          vote_average: c.vote_average,
          vote_count: c.vote_count,
          backdrop_path: c.backdrop_path ?? '',
          original_title: c.original_title,
          original_language: c.original_language,
          genre_ids: c.genre_ids,
          popularity: c.popularity,
          video: c.video
        });

        const seenCast = new Set<number>();
        this.actingMovies = [...credits.cast]
          .sort((a, b) => b.popularity - a.popularity)
          .filter(c => {
            if (seenCast.has(c.id)) return false;
            seenCast.add(c.id);
            return true;
          })
          .map(toMovie);

        const seenCrew = new Set<number>();
        this.crewMovies = [...credits.crew]
          .sort((a, b) => b.popularity - a.popularity)
          .filter(c => {
            if (seenCrew.has(c.id)) return false;
            seenCrew.add(c.id);
            return true;
          })
          .map(toMovie);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getProfilePath(): string {
    return this.profilePath + this.person.profile_path;
  }

  getAge(): number | null {
    if (!this.person.birthday) return null;
    const end = this.person.deathday ? new Date(this.person.deathday) : new Date();
    const birth = new Date(this.person.birthday);
    let age = end.getFullYear() - birth.getFullYear();
    const m = end.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && end.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }
}
