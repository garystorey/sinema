export type CastMember = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export type CrewMember = {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export type MovieCredits = {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}
