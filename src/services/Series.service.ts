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
      
    const serieExist = await this.serieRepository.findOneBy({name:data.name})

    if( serieExist ){
        throw new AppError("Series already registered", 401)
    }

      const serie = this.serieRepository.create(data)
      await this.serieRepository.save(serie)

      return serie
  }

  static list = async () => await this.serieRepository.find({ relations:{
    ep:true
  } })

  static async update( id:string, data:IUpdateSerie ) {
    
    const serieExist = await this.serieRepository.findOneBy({id})

    if( !serieExist ){
        throw new AppError("Series not registered", 403)
    }

    await this.serieRepository.update(id, data)

    return await this.serieRepository.findOne({
      where:{
        id
      },
      relations:{
        ep:true 
      }
    })
  }

  static delete = async ( id:string ) => {

    const serieExist = await this.serieRepository.findOneBy({id})

    if( !serieExist ){
        throw new AppError("Series not registered", 403)
    }

    await this.serieRepository.delete(id)
  }

  static async addEpisodeo( id:string, data:IAddEpisodeoSerie ) {

    const serieExist = await this.serieRepository.findOneBy({id})

    if( !serieExist ){
        throw new AppError("Series not registered", 403)
    }

    const episodeoExist = await this.episodeosRepository.findOneBy({ name:data.name })

    if( episodeoExist ){
        throw new AppError("Name is registered", 401)
    }

 // @ts-ignore ou // @ts-expect-error
    const ep = this.episodeosRepository.create({ ...data, serie:serieExist})
    await this.episodeosRepository.save(ep)

    return ep
  }
}