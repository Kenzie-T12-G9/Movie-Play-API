import AppDataSource from "../data-source";
import { Episodes } from "../entities/Episodes.entity";
import { AppError } from "../error/AppError";
import { IUpdatedEpisodes } from "../interfaces/episodes";

export default class EpisodeService {
  static episodesRepository = AppDataSource.getRepository(Episodes)

  static async update( id:string, data:IUpdatedEpisodes ) {

    const episodes = await this.episodesRepository.find()
    
    if( !episodes.find( ep => ep.id == id ) ){
      throw new AppError("Episode not exists", 401)
    }

    await this.episodesRepository.update(id, data)

    return await this.episodesRepository.findOneBy({ id })
  }
  static async delete( id:string ) {
    const episodes = await this.episodesRepository.find()
    
    if( !episodes.find( ep => ep.id == id ) ){
      throw new AppError("Episode not exists", 401)
    }

    await this.episodesRepository.delete(id)
  }
}