import AppDataSource from "../data-source"
import { History } from "../entities/History.entity"
import { AppError } from "../error/AppError"
import { IHistoryIdRelations } from "../interfaces/history"
import { arrayResHistory, arrayResMovie, arrayResSeries, movieIdResponse, schemaResListMovie, schemaResListSerie, schemaResMovie, schemaResSerie, seriesIdResponse } from "../serializers/history.serizalizer"

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
                isActive:true,
                ...property
        })
        
        await this.historyRepository.save(history)

        const schema = type == "Movie" ? schemaResMovie : schemaResSerie

        return await schema.validate(history, {
            stripUnknown: true,
            abortEarly: false,
        });
    }

    static async listAll( id:string ){
   
        const MyListALl = await this.historyRepository.find({ where:{user:{
            id
        },
            isActive:true
        } })

        return await arrayResHistory.validate(MyListALl, { stripUnknown:true })
    }

    static async listAllMovies( id:string ){
        
        const historyMovie = await this.historyRepository.find({ where:{user:{
            id
        },
            movie:true,
            isActive:true
        }})

        return await arrayResMovie.validate(historyMovie, { stripUnknown:true })
    }

    static async listAllSeries( id:string ){
        
        const historySeries = await this.historyRepository.find({ where:{user:{
            id
        },
            series:true,
            isActive:true   
        }})

        return await arrayResSeries.validate(historySeries, { stripUnknown:true })
    }

    static async listMovie( idMovie:string ){

        const movie = await MovieService.repository.findOneBy({ id:idMovie })

        const history = await this.historyRepository.find({ where:{
            movie:{
                id:idMovie
            }
        }})

        const { movie:validateMovie, activity } = await movieIdResponse.validate({
            movie,
            activity:history
        }, { stripUnknown:true })
        
        return {
            movie:validateMovie,
            activity
        }
    }

    static async listSerie( idSerie:string ){

        const series = await SeriesService.serieRepository.findOneBy({ id:idSerie })

        const history = await this.historyRepository.find({ where:{
            series:{
                id:idSerie
            }
        }})

        const { series:validateSeries, activity } = await seriesIdResponse.validate({
            series,
            activity:history
        }, { stripUnknown:true })
        
        return {
            series:validateSeries,
            activity
        }
    }

    static async listAllAdm( id:string ){

        await this.checkUserExis( id )

        const listHistoryUser = await this.historyRepository.find({where:{ user:{id} }})

        return await arrayResHistory.validate(listHistoryUser, { stripUnknown:true })
    }

    static async delete( id:string ){

        const history = await this.historyRepository.findOneBy({id})

        if( !history ){
            throw new AppError("History not found", 404)
        }

        await this.historyRepository.update(id, { isActive:false })
    }

    static async checkUserExis( idUser:string ) {
        const user = await UserService.repository.findOneBy({id:idUser})

        if( !user ){
            throw new AppError("User not found", 404)
        }

        return user
    }}
