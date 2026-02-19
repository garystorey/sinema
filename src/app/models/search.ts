import { Movie } from './movie';

export type MovieSearchResponse = {
  page: number;
  results: Movie[];
  total_results: number;
  total_pages: number;
}
