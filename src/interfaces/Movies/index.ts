import * as core from 'express-serve-static-core';
import { Request, Response } from 'express';

export type IMovie = Request<
    core.ParamsDictionary,
    IMovieBodyReq,
    IMovieBodyRes
>

export interface IMovieBodyReq{
    name: string;
    year: Date;
    duration: number;
    description: string;
    direction: string;
}

export interface IMovieBodyRes{
    id: string;
    name: string;
    year: Date;
    duration: number;
    description: string;
    direction: string;
}



// Create
// List
// Delete