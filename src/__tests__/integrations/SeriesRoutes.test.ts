import request from "supertest"

import { DataSource } from "typeorm"
import AppDataSource from "../../data-source"

import app from "../../app"

import { addEpisodesInSeries, addEpisodesInSeriesValueless, createSerie, createSerieInvalidYear, createSerieValueless, createUserADM, createUserNotAdm, loginUserAdm, loginUserNotAdm, updateSerie } from "../mocks/Series/indes"
import { updateEpisode } from "../mocks/Episodes"

describe("/series" , ()=> {
    let connection:DataSource

    let tokenADM:string
    let tokenNotADM:string
    let idSerie:string
    let idEpisode:string

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
            .send(loginUserNotAdm);
        
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




    test( "GET /series/:id - It should be possible to search for a specific series", async () => {

        const user = await request(app)
            .get(`/series/${idSerie}`).send()

        expect(user.status).toBe(200) 
        expect(user.body.length).toBe(1) 
    } )

    test( "GET /series/:id - It should not be possible to search for a series that does not exist", async () => {

        const user = await request(app)
            .get(`/series/36d48f7f-73bd-46e2-80d8-acdc6a1f2eb0`).send()

        expect(user.status).toBe(404) 
        expect(user.body).toHaveProperty("message")
    } )

    test( "GET /series/:id - It should not be possible to search for a series with an id that is not UUID", async () => {

        const user = await request(app)
            .get(`/series/36d48f7f-73bd-46e2-80d8-acdc6a1f2eb`).send()

        expect(user.status).toBe(400) 
        expect(user.body).toHaveProperty("message")
    } )




    test( "POST /series/:id/episodes - It should not be possible to add an episode with an id that is not a UUID", async () => {

        const user = await request(app)
            .post(`/series/36d48f7f-73bd-46e2-80d8-acdc6a1f2eb/episodes`).send(addEpisodesInSeries)
            .set("Authorization", `Bearer ${tokenADM}`)

        expect(user.status).toBe(400) 
        expect(user.body).toHaveProperty("message")
    } )

    test( "POST /series/:id/episodes - Add episode with admin user", async () => {

        const user = await request(app)
            .post(`/series/${idSerie}/episodes`).send(addEpisodesInSeries)
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

        idEpisode = user.body.id
    } )

    test( "POST /series/:id/episodes - It shouldn't be possible to add not being admin", async () => {

        const user = await request(app)
            .post(`/series/${idSerie}/episodes`).send(addEpisodesInSeries)
            .set("Authorization", `Bearer ${tokenNotADM}`)

        expect(user.status).toBe(401) 
        expect(user.body).toHaveProperty("message")
    } )

    test( "POST /series/:id/episodes - Must not be possible to add with empty properties", async () => {

        const user = await request(app)
            .post(`/series/${idSerie}/episodes`).send(addEpisodesInSeriesValueless)
            .set("Authorization", `Bearer ${tokenADM}`)

        expect(user.status).toBe(400) 
        expect(user.body).toHaveProperty("message")
        expect(user.body.message.length).toBe(5) 
    } )

    test( "POST /series/:id/episodes - Must not be possible to add, in a non-existent series", async () => {

        const user = await request(app)
            .post(`/series/36d48f7f-73bd-46e2-80d8-acdc6a1f2eb0/episodes`).send(addEpisodesInSeries)
            .set("Authorization", `Bearer ${tokenADM}`)

        expect(user.status).toBe(404) 
        expect(user.body).toHaveProperty("message")
    } )




    test( "PATCH /episodes/:id - It should not be possible to update an episode with an id other than a UUID", async () => {

        const user = await request(app)
            .patch(`/episodes/34242`).send(updateEpisode)
            .set("Authorization", `Bearer ${tokenADM}`)

        expect(user.status).toBe(400) 
        expect(user.body).toHaveProperty("message")
      
    } )

    test( "PATCH /episodes/:id - It should be possible to update the episode", async () => {

        const user = await request(app)
            .patch(`/episodes/${idEpisode}`).send(updateEpisode)
            .set("Authorization", `Bearer ${tokenADM}`)

        expect(user.status).toBe(200) 
        expect(user.body.season).toEqual(2)
        expect(user.body.episode).toEqual(2)
        expect(user.body.name).toEqual("A  procura 2")
        expect(user.body.duration).toEqual(1000000)
        expect(user.body.description).toEqual("A chicara quebrou, procurando outra")
    } )

    test( "PATCH /episodes/:id - It should not be possible to update an episode that does not exist", async () => {

        const user = await request(app)
            .patch(`/episodes/36d48f7f-73bd-46e2-80d8-acdc6a1f2eb0`).send(updateEpisode)
            .set("Authorization", `Bearer ${tokenADM}`)

        expect(user.status).toBe(404) 
        expect(user.body).toHaveProperty("message")
    } )

    test( "PATCH /episodes/:id - It shouldn't be possible to update if it's not admin", async () => {

        const user = await request(app)
            .patch(`/episodes/36d48f7f-73bd-46e2-80d8-acdc6a1f2eb0`).send(updateEpisode)
            .set("Authorization", `Bearer ${tokenNotADM}`)

        expect(user.status).toBe(401) 
        expect(user.body).toHaveProperty("message")
    } )




    test( "DELETE /episodes/:id - It should not be possible to delete an episode with an id that is not a UUID", async () => {

        const user = await request(app)
            .delete(`/episodes/234234`).send()
            .set("Authorization", `Bearer ${tokenNotADM}`)

        expect(user.status).toBe(400) 
        expect(user.body).toHaveProperty("message")
    } )

    test( "DELETE /episodes/:id - It should not be possible to delete without admin permission", async () => {

        const user = await request(app)
            .delete(`/episodes/${idEpisode}`).send()
            .set("Authorization", `Bearer ${tokenNotADM}`)

        expect(user.status).toBe(401) 
    } )

    test( "DELETE /episodes/:id - It should not be possible to delete an episode that does not exist", async () => {

        const user = await request(app)
            .delete(`/episodes/36d48f7f-73bd-46e2-80d8-acdc6a1f2eb0`).send()
            .set("Authorization", `Bearer ${tokenADM}`)

        expect(user.status).toBe(404) 
    } )

    test( "DELETE /episodes/:id - It must be possible to delete a user", async () => {

        const user = await request(app)
            .delete(`/episodes/${idEpisode}`).send()
            .set("Authorization", `Bearer ${tokenADM}`)

        expect(user.status).toBe(204) 
    } )
    



    test( "GET /series - List all series", async () => {

        const user = await request(app)
            .get("/series")

        expect(user.status).toBe(200) 
        expect(user.body.length).toBe(1)
    } )




    test( "PATCH /series/:id - It should not be possible to update a series with an id that is not a UUID", async () => {

        const user = await request(app)
            .patch(`/series/23423`)
            .send(updateSerie)
            .set("Authorization", `Bearer ${tokenADM}`)

        expect(user.status).toBe(400) 
        expect(user.body).toHaveProperty("message")
    } )

    test( "PATCH /series/:id - Only admin user should be able to update", async () => {

        const user = await request(app)
            .patch(`/series/${idSerie}`)
            .send(updateSerie)
            .set("Authorization", `Bearer ${tokenADM}`)

        expect(user.status).toBe(200) 
        expect(user.body.name).toEqual("The mandalorian 2")
        expect(user.body.year).toEqual("2023")
        expect(user.body.description).toEqual("Indefinido")
        expect(user.body.direction).toEqual("Lucas filmes")
    } )

    test( "PATCH /series/:id - It shouldn't be possible to update if it's not admin", async () => {

        const user = await request(app)
            .patch(`/series/${idSerie}`)
            .send(updateSerie)
            .set("Authorization", `Bearer ${tokenNotADM}`)

        expect(user.status).toBe(401) 
        expect(user.body).toHaveProperty("message")
    } )

    test( "PATCH /series/:id -  It should not be possible to update a series that does not exist", async () => {

        const user = await request(app)
            .patch(`/series/36d48f7f-73bd-46e2-80d8-acdc6a1f2eb0`)
            .send(updateSerie)
            .set("Authorization", `Bearer ${tokenADM}`)

        expect(user.status).toBe(404) 
        expect(user.body).toHaveProperty("message")
    } )




    test( "DELETE /series/:id - It must not be possible to delete a series with an id that is not a UUID", async () => {

        const user = await request(app)
            .delete(`/series/234243`)
            .send(updateSerie)
            .set("Authorization", `Bearer ${tokenADM}`)

            expect(user.status).toBe(400) 
            expect(user.body).toHaveProperty("message")
    } )

    test( "DELETE /series/:id -  It should not be possible to delete a series that does not exist", async () => {

        const user = await request(app)
            .delete(`/series/36d48f7f-73bd-46e2-80d8-acdc6a1f2eb0`)
            .send(updateSerie)
            .set("Authorization", `Bearer ${tokenADM}`)

            expect(user.status).toBe(404) 
            expect(user.body).toHaveProperty("message")
    } )

    test( "DELETE /series/:id -  It shouldn't be possible to delete if it's not admin", async () => {

        const user = await request(app)
            .delete(`/series/${idSerie}`)
            .send(updateSerie)
            .set("Authorization", `Bearer ${tokenNotADM}`)

            expect(user.status).toBe(401) 
            expect(user.body).toHaveProperty("message")
    } )

    test( "DELETE /series/:id -  It must be possible to delete", async () => {

        const user = await request(app)
            .delete(`/series/${idSerie}`)
            .send(updateSerie)
            .set("Authorization", `Bearer ${tokenADM}`)

            expect(user.status).toBe(204) 
    } )
})
