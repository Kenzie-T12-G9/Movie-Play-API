import AppDataSource from '../data-source';
import { Movies } from '../entities/Movies.entity';
import { AppError } from '../error/AppError';
import { IMovieBodyReq } from '../interfaces/Movies';

export default class MovieService {
  static repository = AppDataSource.getRepository(Movies);

  static async createMovieService(data: IMovieBodyReq) {
    const movieAlreadyExists = await this.repository.findOne({
      where: { name: data.name },
    });

    if (movieAlreadyExists) {
      throw new AppError('Movie already exists.', 400);
    }

    const newMovie = this.repository.create(data);
    await this.repository.save(newMovie);
    return newMovie;
  }

  static async readAllMoviesService() {
    const Movies = await this.repository.find();
    return Movies;
  }

  static async readMovieService(id: string) {
    const movie = await this.repository.findOne({ where: { id } });

    if (!movie) {
      throw new AppError('Movie not found!', 404);
    }

    return movie;
  }

  static async deleteMovieService(id: string) {
    const movie = await this.repository.findOneBy({ id: id });
    if (!movie) {
      throw new AppError('Movie not found', 404);
    }

    if (movie.isActive === false) {
      throw new AppError('User not found');
    }

    await this.repository.update(id, {
      isActive: false,
    });
  }
}
