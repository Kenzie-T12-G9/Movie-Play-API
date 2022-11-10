import { Request, Response } from 'express';
import RatingsService from '../services/Ratings.service';

export default class RatingsController {
  static async readAllRatingsMoviesController(_: Request, res: Response) {
    const data = await RatingsService.readAllRatingsMoviesService();
    return res.status(200).json(data);
  }

  static async readAllRatingsSeriesController(_: Request, res: Response) {
    const data = await RatingsService.readAllRatingsSeriesService();
    return res.status(200).json(data);
  }

  static async postUserRatingsOfaMovieController(req: Request, res: Response) {
    const { id: movieId } = req.params;
    const { rate, comment, userId } = req.body;

    const data = await RatingsService.postUserRateOfaMovieService(movieId, { rate, comment, userId });
    return res.status(200).json(data);
  }

  static async postUserRatingsOfaSerieController(req: Request, res: Response) {
    const { id: seriesId } = req.params;
    const { rate, comment, userId } = req.body;

    const data = await RatingsService.postUserRateOfaSerieService(seriesId, { rate, comment, userId });
    return res.status(200).json(data);
  }

  static async listUserRatingsOfaMovieController(req: Request, res: Response) {
    const { id } = req.params;
    const data = await RatingsService.listUserRatingsOfaMovieService(id);
    return res.status(200).json(data);
  }

  static async listUserRatingsOfaSerieController(req: Request, res: Response) {
    const { id } = req.params;
    const data = await RatingsService.listUserRatingsOfaSerieService(id);
    return res.status(200).json(data);
  }

  static async deleteRatingController(req: Request, res: Response) {
    const { id } = req.params;
    await RatingsService.deleteRatingService(id);
    return res.status(204).json();
  }
}
