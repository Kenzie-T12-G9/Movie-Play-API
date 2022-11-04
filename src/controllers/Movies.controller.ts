import { Request, Response } from 'express';
import { IMovieBodyReq } from '../interfaces/Movies';
import MovieService from '../services/Movies.service';
;

export default class MoviesController {
 
    static async createMovieController(req: Request ,res: Response ){
        
        const data : IMovieBodyReq = req.body
        const createMovie = MovieService.createMovieService(data)
        return res.status(201).json(createMovie)

    }

    static async readAllMoviesController(req: Request , res: Response){

        const data = await MovieService.readAllMoviesService()
        return res.json(data)

    }

    static async readMovieController(req: Request , res: Response){

        const { id } = req.params
        const data = await MovieService.readMovieService(id)
        return res.json(data)

    }

    static deleteMovieController(req: Request , res: Response){

        const { id } = req.params
        MovieService.readMovieService(id)
        return res.status(204)

    }

}
