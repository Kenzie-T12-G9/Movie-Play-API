import { DataSource } from 'typeorm';
import request from 'supertest';
import AppDataSource from '../../data-source';
import app from '../../app';
import { createUserADM, createUserNotAdm, loginUserAdm } from '../mocks/Series/indes';
import { createMovie, CreateMovieWithWorthlessProperty } from '../mocks/Movies';

  describe("/series" , ()=> {
    let connection:DataSource

    let tokenADM:string
    let tokenNotADM:string
    let idMovie:string

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


      test("POST /movies - It should be possible to create as ADM", async () => {

        const response = await request(app).post('/movies').set("Authorization", `Bearer ${tokenADM}`).send(createMovie)

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty("id")
        expect(response.body).toHaveProperty("name")
        expect(response.body).toHaveProperty("year")
        expect(response.body).toHaveProperty("duration")
        expect(response.body).toHaveProperty("description")

        idMovie = response.body.id

      })

      test("POST /movies - It should not be possible to create if the user is not an admin", async () => {

        const response = await request(app).post('/movies').set("Authorization", `Bearer ${tokenNotADM}`).send(createMovie)

        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty("message")
      })

      test("POST /movies - should not be able to post a movie that already exists", async () => {

        const response = await request(app).post('/movies').set("Authorization", `Bearer ${tokenADM}`).send(createMovie)

        expect(response.body).toHaveProperty("message")
        expect(response.status).toBe(400)

      })

      test("POST /movies - It should not be possible to create a movie with a worthless property", async () => {

        const response = await request(app).post('/movies').set("Authorization", `Bearer ${tokenADM}`).send(CreateMovieWithWorthlessProperty)

        expect(response.body).toHaveProperty("message")
        expect(response.status).toBe(400)
        expect(response.body.message.length).toEqual(4)

      })

      test("GET /movies - It should be possible to search all movies", async () => {

        const response = await request(app).get('/movies').send()

        expect(response.status).toBe(200)
        expect(response.body.length).toEqual(1)
        expect(response.body[0]).toHaveProperty("id")
        expect(response.body[0]).toHaveProperty("name")
        expect(response.body[0]).toHaveProperty("year")
        expect(response.body[0]).toHaveProperty("isActive")
        expect(response.body[0]).toHaveProperty("duration")
        expect(response.body[0]).toHaveProperty("description")
        expect(response.body[0]).toHaveProperty("direction")
      })

      test("GET /movies/:id - It should be possible to search for a specific movie", async () => {

        const response = await request(app).get(`/movies/${idMovie}`).send()

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("id")
        expect(response.body).toHaveProperty("name")
        expect(response.body).toHaveProperty("year")
        expect(response.body).toHaveProperty("isActive")
        expect(response.body).toHaveProperty("duration")
        expect(response.body).toHaveProperty("description")
        expect(response.body).toHaveProperty("direction")
      })

      test("GET /movies/:id - It should not be possible to search for a movie with an id other than uuid", async () => {

        const response = await request(app).get(`/movies/234234`).send()

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("message")
      })

      test("GET /movies/:id - It shouldn't be possible to search for a movie that doesn't exist", async () => {

        const response = await request(app).get(`/movies/18efb03b-6be1-4ad5-932f-735d5c6d9fdc`).send()

        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty("message")
      })

      test("DELETE /movies/:id - It should not be possible to delete a movie with an id other than uuid", async () => {

        const response = await request(app).delete(`/movies/2323`).send()

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("message")
      })

      test("DELETE /movies/:id - It shouldn't be possible to delete a movie that doesn't exist", async () => {

        const response = await request(app).delete(`/movies/18efb03b-6be1-4ad5-932f-735d5c6d9fdc`).set("Authorization", `Bearer ${tokenADM}`).send()

        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty("message")
      })

      test("DELETE /movies/:id - It should not be possible to delete without admin authorization", async () => {

        const response = await request(app).delete(`/movies/${idMovie}`).set("Authorization", `Bearer ${tokenNotADM}`).send()

        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty("message")
      })

      test("DELETE /movies/:id - It must be possible to delete a user", async () => {

        const response = await request(app).delete(`/movies/${idMovie}`).set("Authorization", `Bearer ${tokenADM}`).send()

        expect(response.status).toBe(204)
      })
})