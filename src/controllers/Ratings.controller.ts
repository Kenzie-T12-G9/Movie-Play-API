import { Request, Response } from 'express';
import RatingsService from '../services/Ratings.service';


export default class RatingsController {
 
    static async readAllRatingsMoviesController(req: Request , res: Response){
        const data = RatingsService.readAllRatingsMoviesService()
        return res.status(200).json(data)
    }

    static async readAllRatingsSeriesController(req: Request , res: Response){
        const data = RatingsService.readAllRatingsSeriesService()
        return res.status(200).json(data)
    }

    static async postUserRatingsOfaMovieController(req: Request , res: Response)
    {
        const { id: movieId } = req.params
        const { id: idToken} = req.token
        const rate = req.body

        const data = await RatingsService.postUserRateOfaMovieService(
            rate,
            movieId, 
            idToken
            )
        return res.status(200).json(data)
    }

    static async postUserRatingsOfaSerieController(req: Request , res: Response)
    {
        const { id: serieId } = req.params
        const { id: idToken} = req.token
        const rate = req.body
        const data = await RatingsService.postUserRateOfaSerieService(
            rate,
            serieId,
            idToken
            )
        return res.status(200).json(data)
    }

    static async listUserRatingsOfaMovieController(req: Request , res: Response)
    {
        const { movieId, userId } = req.params
        const { id: idToken} = req.token
        const data = await RatingsService.listUserRatingsOfaMovieService(
            idToken,
            movieId, 
            userId
            )
        return res.status(200).json(data)
    }

    static async listUserRatingsOfaSerieController(req: Request , res: Response)
    {
        const { movieId, userId } = req.params
        const { id: idToken} = req.token
        const data = await RatingsService.listUserRatingsOfaSerieService(
            idToken,
            movieId, 
            userId
            )
        return res.status(200).json(data)
    }
    
    static async deleteMovieRatingController(req: Request , res: Response)
    {
        const { movieId, userId } = req.params
        const { id: idToken} = req.token
        const data = await RatingsService.deleteMovieRatingService(
            idToken,
            movieId, 
            userId
            )
        return res.status(200).json(data)
    }

    static async deleteSerieRatingController(req: Request , res: Response)
    {
        const { movieId, userId } = req.params
        const { id: idToken} = req.token
        const data = await RatingsService.deleteSerieRatingService(
            idToken,
            movieId, 
            userId
            )
        return res.status(200).json(data)
    }

}