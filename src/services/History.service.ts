import AppDataSource from '../data-source';
import { History } from '../entities/History.entity';
import { Movies } from '../entities/Movies.entity';
import { Series } from '../entities/Series.entity';
import { Users } from '../entities/Users.entity';
import { AppError } from '../error/AppError';
import { IHistoryIdRelations } from '../interfaces/history';

export default class HistoryService {
  static historyRepository = AppDataSource.getRepository(History);
  static userRepository = AppDataSource.getRepository(Users);
  static movieRepository = AppDataSource.getRepository(Movies);
  static serieRepository = AppDataSource.getRepository(Series);

  static async create(id: string, data: IHistoryIdRelations) {
    if ((data.movieId && data.serieId) || (!data.movieId && !data.serieId)) {
      throw new AppError('Send only series or movie', 401);
    }

    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (data.movieId) {
      const movie = await this.movieRepository.findOneBy({ id: data.movieId });

      if (!movie) {
        throw new AppError('Movie not found', 404);
      }

      const history = this.historyRepository.create({
        watchedAt: data.watchedAt,
        user,
        movie,
      });

      await this.historyRepository.save(history);

      return history;
    }

    if (data.serieId) {
      const series = await this.serieRepository.findOneBy({ id: data.serieId });

      if (!series) {
        throw new AppError('Serie not found', 404);
      }

      const history = this.historyRepository.create({
        watchedAt: data.watchedAt,
        user,
        series,
      });

      await this.historyRepository.save(history);

      return history;
    }
  }

  static async listAll(id: string) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return await this.historyRepository.find({
      where: {
        user: {
          id: user.id,
        },
      },
    });
  }

  static async listAllMovies(id: string) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return await this.historyRepository.find({
      where: {
        user: {
          id: user.id,
        },
        movie: true,
      },
    });
  }

  static async listAllSeries(id: string) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return await this.historyRepository.find({
      where: {
        user: {
          id: user.id,
        },
        series: true,
      },
    });
  }

  static async listMovie(idUser: string, idMovie: string) {
    const user = await this.userRepository.findOneBy({ id: idUser });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return await this.historyRepository.findOne({
      where: {
        user: {
          id: user.id,
        },
        movie: {
          id: idMovie,
        },
      },
    });
  }

  static async listSerie(idUser: string, idSerie: string) {
    const user = await this.userRepository.findOneBy({ id: idUser });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return await this.historyRepository.findOne({
      where: {
        user: {
          id: user.id,
        },
        series: {
          id: idSerie,
        },
      },
    });
  }
}
