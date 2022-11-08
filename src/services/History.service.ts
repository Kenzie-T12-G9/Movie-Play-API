import AppDataSource from "../data-source"
import { History } from "../entities/History.entity"
import { AppError } from "../error/AppError"
import { IHistoryIdRelations } from "../interfaces/history"

import MovieService from "./Movies.service"
import SeriesService from "./Series.service"
import UserService from "./Users.service"

export default class HistoryService {
    
    static historyRepository = AppDataSource.getRepository(History)

    static async create( id:string, { movieId, serieId, watchedAt }:IHistoryIdRelations ){
        
        if( movieId && serieId || !movieId && !serieId ) {
            throw new AppError("Send only series or movie", 401)
        }

        const user = await this.checkUserExis( id )

        const type:string = movieId ? "Movie" : "Series"

        const content = movieId ? 

            await MovieService.repository.findOneBy({id:movieId}) 
                : 
            await SeriesService.serieRepository.findOneBy({id:serieId})

        if( !content ){
            throw new AppError(`${type} not found`, 404)
        }

        const property = type == "Movie" ? { movie:content } : { series:content }

        const history = this.historyRepository.create({
                watchedAt,
                user,
                ...property
        })
        
        await this.historyRepository.save(history)
        
        return history
    }

    static async listAll( id:string ){
   
        return await this.historyRepository.find({ where:{user:{
            id
        }} })
    }

    static async listAllMovies( id:string ){
        
        return await this.historyRepository.find({ where:{user:{
            id
        },
            movie:true    
        }})
    }

    static async listAllSeries( id:string ){
        
        return  await this.historyRepository.find({ where:{user:{
            id
        },
            series:true    
        }})
    }

    static async listMovie( idUser:string, idMovie:string ){

        return  await this.historyRepository.findOne({ where:{user:{
            id:idUser
        },
            movie:{
                id:idMovie
            }
        }})
    }

    static async listSerie( idUser:string, idSerie:string ){

        return  await this.historyRepository.findOne({ where:{user:{
            id:idUser
        },
            series:{
                id:idSerie
            }
        }})
    }

    static async listAllAdm( id:string ){

        await this.checkUserExis( id )

        return await this.historyRepository.find({where:{ user:{id} }})
    }

    static async checkUserExis( idUser:string ) {
        const user = await UserService.repository.findOneBy({id:idUser})

        if( !user ){
            throw new AppError("User not found", 404)
        }

        return user
    }
}