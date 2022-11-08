import { Request, Response } from "express"
import service from "../services/History.service"

export default class HistoryController {

    static async create( req:Request, res:Response ){
        
        const { id } = req.token
        const data = req.body
        const resHistory = await service.create( id, data )
        return res.status(201).json(resHistory)
    }

    static async listAll( req:Request, res:Response ){

        const { id } = req.token
        const resHistory = await service.listAll( id )
        return res.status(200).json(resHistory)
    }

    static async listAllMovies( req:Request, res:Response ){

        const { id } = req.token
        const resHistory = await service.listAllMovies( id )
        return res.status(200).json(resHistory)
    }

    static async listAllSeries( req:Request, res:Response ){

        const { id } = req.token
        const resHistory = await service.listAllSeries( id )
        return res.status(200).json(resHistory)
    }

    static async listMovie( req:Request, res:Response ){

        const { id:idMovie } = req.params
        const { id:idUser } = req.token
        const resHistory = await service.listMovie( idUser, idMovie )
        return res.status(200).json(resHistory)
    }

    static async listSerie( req:Request, res:Response ){

        const { id:idSerie } = req.params
        const { id:idUser } = req.token
        const resHistory = await service.listSerie( idUser, idSerie )
        return res.status(200).json(resHistory)
    }

    static async listAllAdm( req:Request, res:Response ){

        const { id } = req.params 
        const resHistory = await service.listAllAdm( id )
        return res.status(200).json(resHistory)
    }
}