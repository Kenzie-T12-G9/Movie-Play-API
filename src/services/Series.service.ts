import AppDataSource from "../data-source";
import { Episodes } from "../entities/Episodes.entity";
import { Series } from "../entities/Series.entity";
import { AppError } from "../error/AppError";
import { 
  IAddEpisodeoSerie, 
  ICreateSerie, 
  IUpdateSerie 
} from "../interfaces/series";

export default class SeriesService {
  static serieRepository = AppDataSource.getRepository(Series)
  static episodeosRepository = AppDataSource.getRepository(Episodes)

  static async create( data:ICreateSerie ) {
      
    const serieExist = await this.serieRepository.findOneBy({name:data.name, isActive: true})

    if( serieExist ){
        throw new AppError("Series already registered", 401)
    }

      const serie = this.serieRepository.create(data)
      await this.serieRepository.save(serie)

      return serie
  }

  static list = async () => {
    return await this.serieRepository.find(
     { where: { isActive: true }, 
       relations: { 
         episodes:true 
       } 
     })
   }

  static async update( id: string, data: IUpdateSerie ) {
    
    const serieExist = await this.serieRepository.findOneBy({ id, isActive: true })

    if( !serieExist ){
        throw new AppError("Series not found", 404)
    }

    await this.serieRepository.update(id, data)

    return await this.serieRepository.findOne({
      where:{
        id
      },
      relations:{
        episodes:true 
      }
    });
  }

  static delete = async ( id:string ) => {

    const serieExist = await this.serieRepository.findOneBy({id, isActive: true})

    if( !serieExist ){
        throw new AppError("Series not registered", 403)
    }

    await this.serieRepository.update(
      id,
      { isActive: false })
  }

  static async addEpisode( id:string, data:IAddEpisodeoSerie ) {

    const serieExist = await this.serieRepository.findOneBy({id, isActive: true})

    if( !serieExist ){
        throw new AppError("Series not registered", 403)
    }

    const episodeoExist = await this.episodeosRepository.findOneBy({ name:data.name })

    if( episodeoExist ){
        throw new AppError("Name is registered", 401)
    }

 // @ts-ignore ou // @ts-expect-error
    const episode = this.episodeosRepository.create({ ...data, serie:serieExist})
    await this.episodeosRepository.save(episode)

    return episode
  }
}
