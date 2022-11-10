import AppDataSource from '../data-source';
import { Episodes } from '../entities/Episodes.entity';
import { Series } from '../entities/Series.entity';
import { AppError } from '../error/AppError';
import {
  IAddEpisodeoSerie,
  ICreateSerie,
  IUpdateSerie,
} from '../interfaces/series';

export default class SeriesService {
  static serieRepository = AppDataSource.getRepository(Series);
  static episodeosRepository = AppDataSource.getRepository(Episodes);

  static async create(data: ICreateSerie) {
    const serieExist = await this.serieRepository.findOneBy({
      name: data.name,
    });

    if (serieExist) {
      throw new AppError('Series already registered', 401);
    }

    data.isActive = true;

    const series = this.serieRepository.create(data);
    await this.serieRepository.save(series);

    return series;
  }

  static list = async () => {
    return await this.serieRepository.find({
      where: { isActive: true },
      relations: {
        episodes: true,
      },
    });
  };

  static listOne = async (id: string) => {
    await this.checkSerieExists(id);

    return await this.serieRepository.find({
      where: { isActive: true, id },
      relations: {
        episodes: true,
      },
    });
  };

  static async update(id: string, data: IUpdateSerie) {
    await this.checkSerieExists(id);

    await this.serieRepository.update(id, data);

    return await this.serieRepository.findOne({
      where: {
        id,
      },
      relations: {
        episodes: true,
      },
    });
  }

  static delete = async (id: string) => {
    await this.checkSerieExists(id);

    await this.serieRepository.update(id, { isActive: false });
  };

  static async addEpisode(id: string, data: IAddEpisodeoSerie) {
    const serieExist = await this.serieRepository.findOneBy({ id });

    await this.checkSerieExists(id);

    // @ts-ignore ou // @ts-expect-error
    const episode = this.episodeosRepository.create({
      ...data,
      series: serieExist,
    });
    await this.episodeosRepository.save(episode);

    return episode;
  }

  static async checkSerieExists(id: string) {
    const serieExist = await this.serieRepository.findOneBy({ id });

    if (!serieExist) {
      throw new AppError('Series not found', 404);
    }
  }
}
