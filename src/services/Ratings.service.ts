import AppDataSource from '../data-source';
import { Movies } from '../entities/Movies.entity';
import { Ratings } from '../entities/Ratings.entity';
import { Series } from '../entities/Series.entity';
import { Users } from '../entities/Users.entity';
import { AppError } from '../error/AppError';
import { IRatingRequest } from '../interfaces/ratings';

export default class RatingsService {
  static rateRepository = AppDataSource.getRepository(Ratings);
  static userRepository = AppDataSource.getRepository(Users);
  static movieRepository = AppDataSource.getRepository(Movies);
  static serieRepository = AppDataSource.getRepository(Series);

  static async readAllRatingsMoviesService() {
    const allMoviesRatings = await this.rateRepository.find({
      where: { movie: true },
      relations: { movie: true, user: true },
    });

    const formatResponse = allMoviesRatings.map((rating) => {
      const { id, name, email } = rating.user;

      return { ...rating, user: { id, name, email } };
    });

    return formatResponse;
  }

  static async readAllRatingsSeriesService() {
    const allMoviesRatings = await this.rateRepository.find({
      where: { series: true },
      relations: { series: true, user: true },
    });

    const formatResponse = allMoviesRatings.map((rating) => {
      const { id, name, email } = rating.user;

      return { ...rating, user: { id, name, email } };
    });

    return formatResponse;
  }

  static async postUserRateOfaMovieService(
    movieId: string,
    { rate, comment, userId }: IRatingRequest
  ) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const movie = await this.movieRepository.findOneBy({ id: movieId });
    if (!movie) {
      throw new AppError('Movie not found', 404);
    }

    const postRate = this.rateRepository.create({ rate, comment, user, movie });
    await this.rateRepository.save(postRate);

    return {
      ...postRate,
      user: {
        id: postRate.user.id,
        name: postRate.user.name,
        email: postRate.user.email,
      },
    };
  }

  static async postUserRateOfaSerieService(
    seriesId: string,
    { rate, comment, userId }: IRatingRequest
  ) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const series = await this.serieRepository.findOneBy({ id: seriesId });
    if (!series) {
      throw new AppError('Movie not found', 404);
    }

    const postRate = this.rateRepository.create({
      rate,
      comment,
      user,
      series,
    });
    await this.rateRepository.save(postRate);

    const formatResponse = {
      ...postRate,
      user: {
        id: postRate.user.id,
        name: postRate.user.name,
        email: postRate.user.email,
      },
    };

    return formatResponse;
  }

  static async listUserRatingsOfaMovieService(movieId: string) {
    const movie = await this.movieRepository.findOneBy({ id: movieId });
    if (!movie) {
      throw new AppError('Movie not found', 404);
    }

    const ratingsResults = await this.rateRepository.find({
      where: { movie: { id: movieId } },
      relations: { movie: false, user: true },
    });
    const ratings = ratingsResults.map((rating) => {
      return {
        ...rating,
        user: {
          id: rating.user.id,
          name: rating.user.name,
          email: rating.user.email,
        },
      };
    });

    return { movie, ratings };
  }

  static async listUserRatingsOfaSerieService(
    seriesId: string,
  ) {
    const series = await this.movieRepository.findOneBy({ id: seriesId });
    if (!series) {
      throw new AppError('Movie not found', 404);
    }

    const ratingsResults = await this.rateRepository.find({
      where: { movie: { id: seriesId } },
      relations: { movie: false, user: true },
    });
    const ratings = ratingsResults.map((rating) => {
      return {
        ...rating,
        user: {
          id: rating.user.id,
          name: rating.user.name,
          email: rating.user.email,
        },
      };
    });

    return { series, ratings };
  }

  static async deleteRatingService(rateId: string) {
    const rate = await this.rateRepository.findOneBy({ id: rateId });
    if (!rate) {
      throw new AppError('Rating not found', 404);
    }

    await this.rateRepository.delete(rateId);
  }
}
