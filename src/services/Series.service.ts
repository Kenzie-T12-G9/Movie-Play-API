import AppDataSource from '../data-source';
import { Episodes } from '../entities/Episodes.entity';
import { Series } from '../entities/Series.entity';
import { AppError } from '../error/AppError';
import { IAddEpisodeoSerie, ICreateSerie, IUpdateSerie } from '../interfaces/series';

export default class SeriesService {
  static serieRepository = AppDataSource.getRepository(Series);
  static episodeosRepository = AppDataSource.getRepository(Episodes);

  static async create(data: ICreateSerie) {
    const serieExist = await this.serieRepository.findOneBy({
      name: data.name,
    });

    if (serieExist && serieExist.isActive) {
      throw new AppError('Series already registered', 401);
    }

    if (!serieExist) {
      const series = this.serieRepository.create(data);
      await this.serieRepository.save(series);

      return series;
    } else {
      await this.serieRepository.update(serieExist!.id, {
        ...data,
        isActive: true,
      });
      const oldMovie = await this.serieRepository.findOneBy({
        id: serieExist!.id,
      });

      return oldMovie;
    }
  }

  static list = async () => {
    return await this.serieRepository.findBy({ isActive: true });
  };

  static listOne = async (id: string) => {
    await this.checkSerieExists(id);

    return await this.serieRepository.findOne({
      where: { id, isActive: true },
      relations: { episodes: true },
    });
  };

  static async update(id: string, data: IUpdateSerie) {
    await this.checkSerieExists(id);

    await this.serieRepository.update(id, data);

    return await this.serieRepository.findOne({
      where: { id },
      relations: { episodes: true },
    });
  }

  static delete = async (id: string) => {
    await this.checkSerieExists(id);

    await this.serieRepository.update(id, { isActive: false });
  };

  static async addEpisode(id: string, data: IAddEpisodeoSerie) {
    const serieExist = await this.serieRepository.findOneBy({
      id,
      isActive: true,
    });

    await this.checkSerieExists(id);

    // @ts-ignore ou // @ts-expect-error
    const episode = this.episodeosRepository.create({
      ...data,
      series: serieExist,
    });
    await this.episodeosRepository.save(episode);

    return episode;
  }

  static async deleteEpisode(id: string) {
    const findEpisode = await this.episodeosRepository.findOneBy({ id });

    if (!findEpisode) {
      throw new AppError('Episode not found', 404);
    }

    await this.episodeosRepository.delete(id);
  }

  static async checkSerieExists(id: string) {
    const serieExist = await this.serieRepository.findOneBy({
      id,
      isActive: true,
    });

    if (!serieExist) {
      throw new AppError('Series not found', 404);
    }
  }
}
