import AppDataSource from '../data-source';
import { History } from '../entities/History.entity';
import { AppError } from '../error/AppError';
import { IHistoryIdRelations } from '../interfaces/history';
// prettier-ignore
import { 
  arrayResHistory, arrayResMovie, schemaResMovie, schemaResSerie, movieIdResponse, seriesIdResponse, arrayResSeries,
} from '../serializers/history.serizalizer';
import MovieService from './Movies.service';
import SeriesService from './Series.service';
import UserService from './Users.service';

export default class HistoryService {
  static historyRepository = AppDataSource.getRepository(History);

  static async create(
    id: string,
    { movieId, seriesId, watchedAt }: IHistoryIdRelations
  ) {
    if ((movieId && seriesId) || (!movieId && !seriesId)) {
      throw new AppError('Send only series or movie', 400);
    }

    const user = await this.checkUserExists(id);

    const type: string = movieId ? 'Movie' : 'Series';

    const content = movieId
      ? await MovieService.repository.findOneBy({ id: movieId, isActive: true })
      : await SeriesService.serieRepository.findOneBy({ id: seriesId, isActive: true });

    if (!content) {
      throw new AppError(`${type} not found`, 404);
    }

    const property = type == 'Movie' ? { movie: content } : { series: content };

    const history = this.historyRepository.create({
      watchedAt,
      user,
      ...property,
    });

    await this.historyRepository.save(history);

    const schema = type == 'Movie' ? schemaResMovie : schemaResSerie;

    return await schema.validate(history, {
      stripUnknown: true,
      abortEarly: false,
    });
  }

  static async listAll(id: string) {
    const MyListALl = await this.historyRepository.find({
      where: { user: { id }, isActive: true },
    });

    const historyList = MyListALl.map(
      ({ id, watchedAt, movie, series, user }) => {
        const summaryProfile = {
          id: user.id,
          name: user.name,
          email: user.email,
        };

        return movie
          ? { id, watchedAt, user: summaryProfile, movie }
          : { id, watchedAt, user: summaryProfile, series };
      }
    );

    return historyList;
  }

  static async listAllMovies(id: string) {
    const historyMovie = await this.historyRepository.find({
      where: {
        user: { id },
        movie: true,
        isActive: true,
      },
      relations: { user: true },
    });

    return await arrayResMovie.validate(historyMovie, { stripUnknown: true });
  }

  static async listAllSeries(id: string) {
    const historySeries = await this.historyRepository.find({
      where: {
        user: {
          id,
        },
        series: true,
        isActive: true,
      },
    });

    return await arrayResSeries.validate(historySeries, { stripUnknown: true });
  }

  static async listMovie(idMovie: string) {
    const movie = await MovieService.repository.findOneBy({ id: idMovie });

    if (!movie) {
      throw new AppError('Movie not found', 404);
    }

    const history = await this.historyRepository.find({
      where: {
        movie: {
          id: idMovie,
        },
      },
    });

    const { movie: validateMovie, activity } = await movieIdResponse.validate(
      {
        movie,
        activity: history,
      },
      { stripUnknown: true }
    );

    return {
      movie: validateMovie,
      activity,
    };
  }

  static async listSeries(idSerie: string) {
    const series = await SeriesService.serieRepository.findOneBy({
      id: idSerie,
    });

    if (!series) {
      throw new AppError('Serries not found', 404);
    }

    const history = await this.historyRepository.find({
      where: {
        series: {
          id: idSerie,
        },
      },
    });

    const { series: validateSeries, activity } =
      await seriesIdResponse.validate(
        {
          series,
          activity: history,
        },
        { stripUnknown: true }
      );

    return {
      series: validateSeries,
      activity,
    };
  }

  static async listAllAdm(id: string) {
    await this.checkUserExists(id);

    const findUser = await UserService.repository.findOneBy({ id });
    const listHistoryUser = await this.historyRepository.find({
      where: { user: { id } },
      relations: { user: false },
    });

    const user = { id: findUser!.id, name: findUser!.name, email: findUser!.email };
    const activity = listHistoryUser.map(({ id, watchedAt, movie, series }) => {
      return movie ? { id, watchedAt, movie } : { id, watchedAt, series };
    });

    return { user, activity };
  }

  static async delete(id: string) {
    const history = await this.historyRepository.findOneBy({ id });

    if (!history) {
      throw new AppError('History not found', 404);
    }

    await this.historyRepository.update(id, { isActive: false });
  }

  static async checkUserExists(idUser: string) {
    const user = await UserService.repository.findOneBy({
      id: idUser,
      isActive: true,
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }
}
