export type MovieVideo = {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export type MovieVideosResponse = {
  id: number;
  results: MovieVideo[];
}
