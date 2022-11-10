import AppDataSource from '../data-source';
import { Movies } from '../entities/Movies.entity';
import { AppError } from '../error/AppError';
import { IMovieBodyReq } from '../interfaces/Movies';

export default class MovieService {
  static repository = AppDataSource.getRepository(Movies);

  static async create(data: IMovieBodyReq) {
    const movieAlreadyExists = await this.repository.findOne({
      where: { name: data.name },
    });

    if (movieAlreadyExists && movieAlreadyExists?.isActive) {
      throw new AppError('Movie already exists.', 400);
    }

    if (!movieAlreadyExists) {
      const newMovie = this.repository.create(data);
      await this.repository.save(newMovie);

      return newMovie;
    } else {
      await this.repository.update(movieAlreadyExists!.id, {
        ...data,
        isActive: true,
      });
      const oldMovie = await this.repository.findOneBy({
        id: movieAlreadyExists!.id,
      });

      return oldMovie;
    }
  }

  static async readAll() {
    const Movies = await this.repository.find({ where: { isActive: true } });
    return Movies;
  }

  static async read(id: string) {
    const movie = await this.repository.findOne({
      where: { id, isActive: true },
    });

    if (!movie) {
      throw new AppError('Movie not found!', 404);
    }

    return movie;
  }

  static async delete(id: string) {
    const movie = await this.repository.findOneBy({ id: id, isActive: true });
    if (!movie) {
      throw new AppError('Movie not found', 404);
    }

    await this.repository.update(id, {
      isActive: false,
    });
  }
}
