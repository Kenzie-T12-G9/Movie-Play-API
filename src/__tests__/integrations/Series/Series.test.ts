import request from "supertest"

import { DataSource } from "typeorm"
import AppDataSource from "../../../data-source"

import app from "../../../app"

import { addEpisodesInSeries, addEpisodesInSeriesValueless, createSerie, createSerieInvalidYear, createSerieValueless, createUserADM, createUserNotAdm, loginUserAdm } from "../../mocks/Series/indes"

describe("/series" , ()=> {
    let connection:DataSource

    let tokenADM:string
    let tokenNotADM:string
    let idSerie:string

    beforeAll(async() => {
        await AppDataSource.initialize().then((res) => {
            connection = res
        }).catch((err) => {
            console.error("Error during Data Source initialization", err)
        })

        await request(app).post('/users').send(createUserADM)
        await request(app).post('/users').send(createUserNotAdm)

        const adminLoginResponse = await request(app)
            .post("/login")
            .send(loginUserAdm);
        const notAdmLoginResponse = await request(app)
            .post("/login")
            .send(createUserNotAdm);
        
        tokenADM = adminLoginResponse.body.token
        tokenNotADM = notAdmLoginResponse.body.token
    })

    afterAll( async ()=>{
        await connection.destroy()
    })

    


    test( "POST /series - Create series as admin", async () => {
        
        const user = await request(app)
        .post("/series").send(createSerie)
        .set("Authorization", `Bearer ${tokenADM}`)
        
        expect(user.status).toBe(201) 
        expect(user.body).toHaveProperty("id") 
        expect(user.body).toHaveProperty("name") 
        expect(user.body).toHaveProperty("year") 
        expect(user.body).toHaveProperty("description") 
        expect(user.body).toHaveProperty("direction") 

        idSerie = user.body.id
    } )

    test( "POST /series - Unable to create without admin permission", async () => {

        const user = await request(app)
            .post("/series").send(createSerie)
            .set("Authorization", `Bearer ${tokenNotADM}`)

        expect(user.status).toBe(401) 
        expect(user.body).toHaveProperty("message") 
    } )

    test( "POST /series - Not be possible to create with invalid year", async () => {

        const user = await request(app)
            .post("/series").send(createSerieInvalidYear)
            .set("Authorization", `Bearer ${tokenADM}`)

        expect(user.status).toBe(401) 
        expect(user.body).toHaveProperty("message") 
    } )

    test( "POST /series - Not be possible to create with duplicate name", async () => {

        const user = await request(app)
            .post("/series").send(createSerie)
            .set("Authorization", `Bearer ${tokenADM}`)

        expect(user.status).toBe(401) 
        expect(user.body).toHaveProperty("message") 
    } )

    test( "POST /series - Create with worthless properties", async () => {

        const user = await request(app)
            .post("/series").send(createSerieValueless)
            .set("Authorization", `Bearer ${tokenADM}`)

        expect(user.status).toBe(400) 
        expect(user.body).toHaveProperty("message") 
        expect(user.body.message.length).toBe(4) 
    } )





    test( "POST /series/:id/episodeos - Add episode with admin user", async () => {

        const user = await request(app)
            .post(`/series/${idSerie}/episodeos`).send(addEpisodesInSeries)
            .set("Authorization", `Bearer ${tokenADM}`)

        expect(user.status).toBe(201) 
        expect(user.body).toHaveProperty("id")
        expect(user.body).toHaveProperty("season")
        expect(user.body).toHaveProperty("episode")
        expect(user.body).toHaveProperty("name")
        expect(user.body).toHaveProperty("duration")
        expect(user.body).toHaveProperty("description")
        expect(user.body).toHaveProperty("serie")
        expect(user.body.serie).toHaveProperty("id")
        expect(user.body.serie).toHaveProperty("name")
        expect(user.body.serie).toHaveProperty("year")
        expect(user.body.serie).toHaveProperty("description")
        expect(user.body.serie).toHaveProperty("direction")
    } )

    test( "POST /series/:id/episodeos - It shouldn't be possible to add not being admin", async () => {

        const user = await request(app)
            .post(`/series/${idSerie}/episodeos`).send(addEpisodesInSeries)
            .set("Authorization", `Bearer ${tokenNotADM}`)

        expect(user.status).toBe(403) 
        expect(user.body).toHaveProperty("message")
    } )

    test( "POST /series/:id/episodeos - Must not be possible to add with empty properties", async () => {

        const user = await request(app)
            .post(`/series/${idSerie}/episodeos`).send(addEpisodesInSeriesValueless)
            .set("Authorization", `Bearer ${tokenADM}`)

        expect(user.status).toBe(400) 
        expect(user.body).toHaveProperty("message")
        expect(user.body.message.length).toBe(5) 
    } )

    test( "POST /series/:id/episodeos - Must not be possible to add, in a non-existent series", async () => {

        const user = await request(app)
            .post(`/series/${"3234sd32"}/episodeos`).send(addEpisodesInSeries)
            .set("Authorization", `Bearer ${tokenADM}`)

        expect(user.status).toBe(404) 
        expect(user.body).toHaveProperty("message")
    } )


    test( "POST /series/:id/episodeos - Must not be possible to add, in a non-existent series", async () => {

        const user = await request(app)
            .post(`/series/${"3234sd32"}/episodeos`).send(addEpisodesInSeries)
            .set("Authorization", `Bearer ${tokenADM}`)

        expect(user.status).toBe(404) 
        expect(user.body).toHaveProperty("message")
    } )




    test( "GET /series - List all series", async () => {

        const user = await request(app)
            .get("/series")

        expect(user.status).toBe(200) 
        expect(user.body.length).toBe(1)
    } )




    // test( "PATCH /series - List all series", async () => {

    //     const user = await request(app)
    //         .get("/series")

    //     expect(user.status).toBe(200) 
    //     expect(user.body.length).toBe(1)
    // } )


})