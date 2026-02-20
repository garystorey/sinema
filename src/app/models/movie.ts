export type Movie = {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  backdrop_path: string;
  original_title: string;
  original_language: string;
  genre_ids: number[];
  genres?: { id: number; name: string }[];
  popularity: number;
  video: boolean;
  runtime?: number;
  budget?: number;
  revenue?: number;
  tagline?: string;
  status?: string;
  homepage?: string;
  imdb_id?: string;
  spoken_languages?: { english_name: string; iso_639_1: string; name: string }[];
  production_companies?: { id: number; name: string; logo_path: string | null; origin_country: string }[];
  belongs_to_collection?: { id: number; name: string; poster_path: string | null; backdrop_path: string | null } | null;
}
