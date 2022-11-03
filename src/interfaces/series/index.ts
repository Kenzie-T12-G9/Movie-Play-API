export interface ICreateSerie {
    id:string,
    name:string,
    year:Date,
    description:string,
    direction:string,
}

export interface IUpdateSerie {
    name?:string,
    year?:Date,
    description?:string,
    direction?:string,
}

export interface IAddEpisodeoSerie {
    id:string,
    season:string,
    episodeo:Date,
    name:string,
    duration:string,
    description:string
}