export interface ICreateSerie {
  isActive?: boolean;
  name: string;
  year: string;
  description: string;
  direction: string;
}

export interface IUpdateSerie {
  name?: string;
  year?: string;
  description?: string;
  direction?: string;
}

export interface IAddEpisodeoSerie {
  id?: string;
  season: number;
  episode: number;
  name: string;
  duration: number;
  description: string;
}
