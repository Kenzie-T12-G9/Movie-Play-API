import AppDataSource from "../data-source";
import { Episodes } from "../entities/Episodes.entity";
import { AppError } from "../error/AppError";
import { IUpdatedEpisodes } from "../interfaces/episodes";

export default class EpisodeService {
  static episodesRepository = AppDataSource.getRepository(Episodes)

  static checkEpisodeExists = async ( id:string ) => {
    const serieExist = await this.episodesRepository.findOneBy({ id });

    if (!serieExist) {
      throw new AppError('Episode not found', 404);
    }
  }

  static async update( id:string, data:IUpdatedEpisodes ) {

    await this.checkEpisodeExists( id )

    await this.episodesRepository.update(id, data)

    return await this.episodesRepository.findOneBy({ id })
  }
  
  static async delete( id:string ) {

    await this.checkEpisodeExists( id )

    await this.episodesRepository.delete(id)
  }
}