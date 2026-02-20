import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient()]
};

export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
export const TMDB_POSTER_W500_URL = `${TMDB_IMAGE_BASE_URL}/w500`;
export const TMDB_PROFILE_W500_URL = `${TMDB_IMAGE_BASE_URL}/w500`;
export const TMDB_PROFILE_W185_URL = `${TMDB_IMAGE_BASE_URL}/w185`;
