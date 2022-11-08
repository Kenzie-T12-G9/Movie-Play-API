import { Request, Response } from 'express';
import AppDataSource from '../data-source';
import { Movies } from '../entities/Movies.entity';
import { Ratings } from '../entities/Ratings.entity';
import { Series } from '../entities/Series.entity';
import { Users } from '../entities/Users.entity';
import { AppError } from '../error/AppError';
import { IRatingRequest } from '../interfaces/ratings';


export default class RatingsService {

    static rateRepository = AppDataSource.getRepository(Ratings)
    static userRepository = AppDataSource.getRepository(Users)
    static movieRepository = AppDataSource.getRepository(Movies)
    static serieRepository = AppDataSource.getRepository(Series)
 
    static async readAllRatingsMoviesService()
    {
        const allMoviesRatings = await this.rateRepository.find( {where: { movie:true } })
        return allMoviesRatings;
    }

    static async readAllRatingsSeriesService()
    {
        const allMoviesRatings = await this.rateRepository.find( {where: { series:true } })
        return allMoviesRatings;
    }

    static async postUserRateOfaMovieService(rate: IRatingRequest, movieId:string, idToken:string)
    {
        const user = await this.userRepository.findOneBy({id:idToken})
        if( !user ){throw new AppError("User not found", 404)}

        const movie = await this.movieRepository.findOneBy({id:movieId})
        if( !movie ){throw new AppError("Movie not found", 404)}

        const postRate = this.rateRepository.create({
            rate: rate.rate,
            comment: rate.comment,
            user: user,
            movie: movie,
        })

        await this.rateRepository.save(postRate)

        return postRate

    }

    static async postUserRateOfaSerieService(rate: IRatingRequest, serieId:string,idToken:string)
    {
        const user = await this.userRepository.findOneBy({id:idToken})
        if( !user ){throw new AppError("User not found", 404)}

        const serie = await this.serieRepository.findOneBy({id:serieId})
        if( !serie ){throw new AppError("Movie not found", 404)}

        const postRate = this.rateRepository.create({
            rate: rate.rate,
            comment: rate.comment,
            user: user,
            series: serie
        })

        await this.rateRepository.save(postRate)

        return postRate
    }

    static async listUserRatingsOfaMovieService(idToken:string, idUser:string, movieId:string)
    {   
        const user = await this.userRepository.findOneBy({id:idToken})
        if( !user )
        {throw new AppError("User not found", 404)}

        if(idUser != idToken || user.isAdm === false)
        {throw new AppError("Access denied", 403)}

        const movie = await this.movieRepository.findOneBy({id:movieId})
        if( !movie )
        {throw new AppError("Movie not found", 404)}

        
        return  await this.rateRepository.findOne(
            {   
                where:{user:{id:user.id}, movie:{id:movieId}}
            }
        )
    }

    static async listUserRatingsOfaSerieService(idToken:string, idUser:string, serieId:string)
    {
        const user = await this.userRepository.findOneBy({id:idToken})
        if( !user )
        {throw new AppError("User not found", 404)}

        if(idUser != idToken || user.isAdm === false)
        {throw new AppError("Access denied", 403)}

        const serie = await this.serieRepository.findOneBy({id:serieId})
        if( !serie )
        {throw new AppError("Movie not found", 404)}

        
        return  await this.rateRepository.findOne(
            {   
                where:{user:{id:user.id}, series:{id:serieId}}
            }
        )
    }
    
    static async deleteMovieRatingService(idToken:string, idUser:string, movieId:string)
    {
        const user = await this.userRepository.findOneBy({id:idToken})
        if( !user )
        {throw new AppError("User not found", 404)}

        if(idUser != idToken || user.isAdm === false)
        {throw new AppError("Access denied", 403)}

        const movie = await this.movieRepository.findOneBy({id:movieId})
        if( !movie )
        {throw new AppError("Movie not found", 404)}
    
        return await this.rateRepository.delete(
            {user:{id:user.id}, movie:{id:movieId}}
        )
    }

    static async deleteSerieRatingService(idToken:string, idUser:string, serieId:string )
    {
        const user = await this.userRepository.findOneBy({id:idToken})
        if( !user )
        {throw new AppError("User not found", 404)}

        if(idUser != idToken || user.isAdm === false)
        {throw new AppError("Access denied", 403)}

        const movie = await this.serieRepository.findOneBy({id:serieId})
        if( !movie )
        {throw new AppError("Movie not found", 404)}
    
        return await this.rateRepository.delete(
            {user:{id:user.id}, series:{id:serieId}}
        )
    }

}