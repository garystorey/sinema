import { Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CurrencyPipe, DecimalPipe, Location } from '@angular/common';
import { forkJoin } from 'rxjs';
import { switchMap, filter } from 'rxjs/operators';
import { Movie } from '../../models/movie';
import { CastMember, CrewMember } from '../../models/credits';
import { MovieVideo } from '../../models/video';
import { MovieService } from '../../services/movie/movie.service';
import { StorageService } from '../../services/storage/storage.service';
import { MoviecardComponent } from '../moviecard/moviecard.component';
@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [DecimalPipe, CurrencyPipe, RouterLink, MoviecardComponent],
  providers: [MovieService],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.css'
})
export class MovieComponent {

  private movieService = inject(MovieService);
  private storageService = inject(StorageService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private location = inject(Location);

  isFavorited: boolean = false;

  movie: Movie = {} as Movie;
  genreNames: string[] = [];
  directors: CrewMember[] = [];
  topCast: CastMember[] = [];
  topCrew: CrewMember[] = [];
  languages: string[] = [];
  trailerKey: string = '';
  relatedMovies: Movie[] = [];
  posterFailed: boolean = false;
  posterPath: string = 'https://image.tmdb.org/t/p/w500';
  profilePath: string = 'https://image.tmdb.org/t/p/w185';

  constructor() {
    this.route.paramMap.pipe(
      filter(params => params.has('id')),
      switchMap(params => {
        const id = +params.get('id')!;
        return forkJoin({
          movie: this.movieService.getMovie(id),
          credits: this.movieService.getMovieCredits(id),
          genres: this.movieService.getGenres(),
          videos: this.movieService.getMovieVideos(id),
          recommendations: this.movieService.getMovieRecommendations(id)
        });
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: ({ movie, credits, genres, videos, recommendations }) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.movie = movie;
        this.posterFailed = false;
        this.isFavorited = this.storageService.isFavorite(String(movie.id));

        if (movie.genres?.length) {
          this.genreNames = movie.genres.map(g => g.name);
        } else if (movie.genre_ids?.length) {
          const genreMap = new Map(genres.genres.map(g => [g.id, g.name]));
          this.genreNames = movie.genre_ids.map(gid => genreMap.get(gid) ?? 'Unknown');
        }

        this.directors = credits.crew.filter(c => c.job === 'Director');
        this.topCast = credits.cast.slice(0, 6);

        const keyJobs = ['Director', 'Writer', 'Screenplay', 'Producer', 'Executive Producer', 'Director of Photography', 'Original Music Composer', 'Editor'];
        const seen = new Set<number>();
        this.topCrew = credits.crew
          .filter(c => keyJobs.includes(c.job))
          .filter(c => {
            if (seen.has(c.id)) return false;
            seen.add(c.id);
            return true;
          })
          .slice(0, 6);

        if (movie.spoken_languages?.length) {
          this.languages = movie.spoken_languages.map(l => l.english_name);
        }

        const trailer = videos.results.find(
          (v: MovieVideo) => v.site === 'YouTube' && v.type === 'Trailer'
        ) ?? videos.results.find(
          (v: MovieVideo) => v.site === 'YouTube'
        );
        this.trailerKey = trailer?.key ?? '';

        const recMovies = recommendations.results.filter(r => r.id !== movie.id);

        if (movie.belongs_to_collection?.id) {
          this.movieService.getCollection(movie.belongs_to_collection.id).pipe(
            takeUntilDestroyed(this.destroyRef)
          ).subscribe({
            next: (collection) => {
              const collectionParts = collection.parts
                .filter(p => String(p.id) !== String(movie.id))
                .sort((a, b) => (a.release_date ?? '').localeCompare(b.release_date ?? ''));
              const recIds = new Set(collectionParts.map(p => String(p.id)));
              const filteredRecs = recMovies.filter(r => !recIds.has(String(r.id)));
              this.relatedMovies = [...collectionParts, ...filteredRecs].slice(0, 12);
            },
            error: () => {
              this.relatedMovies = recMovies.slice(0, 10);
            }
          });
        } else {
          this.relatedMovies = recMovies.slice(0, 10);
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  getPosterPath(): string {
    return this.posterPath + this.movie.poster_path;
  }

  getProfilePath(path: string | null): string {
    return path ? this.profilePath + path : '';
  }

  formatRuntime(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }

  playTrailer(): void {
    if (this.trailerKey) {
      window.open(`https://www.youtube.com/watch?v=${this.trailerKey}`, '_blank');
    }
  }

  toggleFavorite(): void {
    if (this.isFavorited) {
      this.storageService.removeFavorite(String(this.movie.id));
    } else {
      this.storageService.addFavorite(this.movie);
    }
    this.isFavorited = !this.isFavorited;
  }

  getStars(): ('full' | 'half' | 'empty')[] {
    const rating = this.movie.vote_average / 2;
    const stars: ('full' | 'half' | 'empty')[] = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push('full');
      } else if (rating >= i - 0.5) {
        stars.push('half');
      } else {
        stars.push('empty');
      }
    }
    return stars;
  }

}
