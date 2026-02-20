import { Component, DestroyRef, inject } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { switchMap, filter } from 'rxjs/operators';
import { Person, PersonCastCredit, PersonCrewCredit } from '../../models/person';
import { Movie } from '../../models/movie';
import { MovieService } from '../../services/movie/movie.service';
import { MoviecardComponent } from '../moviecard/moviecard.component';
import { LoaderComponent } from '../loader/loader.component';
import { TMDB_PROFILE_W500_URL } from '../../app.config';

@Component({
  selector: 'app-person',
  standalone: true,
  imports: [MoviecardComponent, LoaderComponent],
  templateUrl: './person.component.html',
  styleUrl: './person.component.css'
})
export class PersonComponent {

  private readonly movieService = inject(MovieService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly location = inject(Location);

  loading: boolean = true;
  person: Person = {} as Person;
  actingMovies: Movie[] = [];
  crewMovies: Movie[] = [];
  profileFailed: boolean = false;
  readonly profilePath: string = TMDB_PROFILE_W500_URL;

  private toMovie(credit: PersonCastCredit | PersonCrewCredit): Movie {
    const {
      id,
      title,
      poster_path,
      overview,
      release_date,
      vote_average,
      vote_count,
      backdrop_path,
      original_title,
      original_language,
      genre_ids,
      popularity,
      video
    } = credit;

    return {
      id: String(id),
      title,
      poster_path: poster_path ?? '',
      overview,
      release_date,
      vote_average,
      vote_count,
      backdrop_path: backdrop_path ?? '',
      original_title,
      original_language,
      genre_ids,
      popularity,
      video
    };
  }

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
        this.loading = false;
        this.person = person;
        this.profileFailed = false;

        const seenCast = new Set<number>();
        this.actingMovies = [...credits.cast]
          .sort((a, b) => b.popularity - a.popularity)
          .filter(c => {
            if (seenCast.has(c.id)) return false;
            seenCast.add(c.id);
            return true;
          })
          .map(credit => this.toMovie(credit));

        const seenCrew = new Set<number>();
        this.crewMovies = [...credits.crew]
          .sort((a, b) => b.popularity - a.popularity)
          .filter(c => {
            if (seenCrew.has(c.id)) return false;
            seenCrew.add(c.id);
            return true;
          })
          .map(credit => this.toMovie(credit));
      },
      error: (error) => {
        this.loading = false;
        console.error(error);
      }
    });
  }

  getProfilePath(): string {
    return this.profilePath + this.person.profile_path;
  }

  goBack(): void {
    this.location.back();
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
