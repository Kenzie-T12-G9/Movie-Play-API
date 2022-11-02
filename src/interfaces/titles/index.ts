export interface IMovies {
  name: string;
  year: Date;
  duration: number;
  description: string;
  direction: string;
}

export interface IEpisodes {
  season: number;
  episode: number;
  name: string;
  duration: number;
  description: string;
}

export interface ISeries extends IMovies {
  // episodes: IEpisodes;
}
