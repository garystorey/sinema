import { Routes } from '@angular/router';
import { SearchComponent } from './components/search/search.component';
import { MovieComponent } from './components/movie/movie.component';
import { FavoriteComponent } from './components/favorite/favorite.component';
import { PersonComponent } from './components/person/person.component';

export const routes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'movie/:id', component: MovieComponent },
  { path: 'favorites', component: FavoriteComponent },
  { path: 'person/:id', component: PersonComponent },
  { path: '**', redirectTo: '' },
];
