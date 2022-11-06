import request from "supertest"

import { DataSource } from "typeorm"
import AppDataSource from "../../../data-source"

import app from "../../../app"

import { createSerie, createUserADM, createUserNotAdm, loginUserAdm } from "../../mocks/Series/indes"

describe("/series" , ()=> {
    let connection:DataSource

    let tokenADM:string
    let tokenNotADM:string

    beforeAll(async() => {
        await AppDataSource.initialize().then((res) => {
            connection = res
        }).catch((err) => {
            console.error("Error during Data Source initialization", err)
        })

        await request(app).post('/users').send(createUserADM)
        await request(app).post('/users').send(createUserNotAdm)

        const adminLoginResponse = await request(app).post("/login").send(loginUserAdm);
        const notAdmLoginResponse = await request(app).post("/login").send(createUserNotAdm);
        
        tokenADM = adminLoginResponse.body.token
        tokenNotADM = notAdmLoginResponse.body.token
    })

    afterAll( async ()=>{
        await connection.destroy()
    })
})