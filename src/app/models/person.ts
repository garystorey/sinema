export type Person = {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string;
  also_known_as: string[];
  gender: number;
  popularity: number;
  homepage: string | null;
  imdb_id: string | null;
}

export type PersonMovieCredits = {
  id: number;
  cast: PersonCastCredit[];
  crew: PersonCrewCredit[];
}

export type PersonCastCredit = {
  id: number;
  title: string;
  character: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
  genre_ids: number[];
  popularity: number;
  backdrop_path: string | null;
  original_title: string;
  original_language: string;
  vote_count: number;
  video: boolean;
}

export type PersonCrewCredit = {
  id: number;
  title: string;
  job: string;
  department: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
  genre_ids: number[];
  popularity: number;
  backdrop_path: string | null;
  original_title: string;
  original_language: string;
  vote_count: number;
  video: boolean;
}
