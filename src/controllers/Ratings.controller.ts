import { Request, Response } from 'express';
import RatingsService from '../services/Ratings.service';


export default class RatingsController {
 
    static async readAllRatingsMoviesController(res: Response){
        const data = RatingsService.readAllRatingsMoviesService()
        return res.status(200).json(data)
    }

    static async readAllRatingsSeriesController(res: Response){
        const data = RatingsService.readAllRatingsSeriesService()
        return res.status(200).json(data)
    }

    static async postUserRatingsOfaMovieController(req: Request , res: Response)
    {
        const { id: movieId } = req.params
        const { id: idUserToken} = req.token
        const rate = req.body

        const data = await RatingsService.postUserRateOfaMovieService(
            rate,
            movieId, 
            idUserToken
            )
        return res.status(200).json(data)
    }

    static async postUserRatingsOfaSerieController(req: Request , res: Response)
    {
        const { id: serieId } = req.params
        const { id: idUserToken} = req.token
        const rate = req.body
        const data = await RatingsService.postUserRateOfaSerieService(
            rate,
            serieId,
            idUserToken
            )
        return res.status(200).json(data)
    }

    static async listUserRatingsOfaMovieController(req: Request , res: Response)
    {
        const { movieId, id:idUser } = req.params
        const { id: idUserToken} = req.token
        const data = await RatingsService.listUserRatingsOfaMovieService(
            idUser,
            movieId, 
            idUserToken
            )
        return res.status(200).json(data)
    }

    static async listUserRatingsOfaSerieController(req: Request , res: Response)
    {
        const { serieId, idUser } = req.params
        const { id: idUserToken} = req.token
        const data = await RatingsService.listUserRatingsOfaSerieService(
            idUser,
            serieId, 
            idUserToken
            )
        return res.status(200).json(data)
    }
    
    static async deleteMovieRatingController(req: Request , res: Response)
    {
        const { movieId, id:idUser } = req.params
        const { id: idUserToken} = req.token
        const data = await RatingsService.deleteMovieRatingService(
            idUserToken,
            movieId, 
            idUser
            )
        return res.status(200).json(data)
    }

    static async deleteSerieRatingController(req: Request , res: Response)
    {
        const { serieId, id:idUser } = req.params
        const { id: idUserToken} = req.token
        const data = await RatingsService.deleteSerieRatingService(
            idUserToken,
            serieId, 
            idUser
            )
        return res.status(200).json(data)
    }

}