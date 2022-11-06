import { DataSource } from 'typeorm';
import request from 'supertest';
import AppDataSource from '../../data-source';
import app from '../../app';


const temporaryMockedAdm = {
    name: 'Francisco Stenico',
    email: 'francisco@mail.com',
    isAdm: true,
    password: 'Teste123@',
    paymentMethods: {
      name: 'Francisco C Stenico',
      cpf: '12345678900',
      number: '1111222233334444',
      dueDate: '2026-10-21',
      code: '123',
    },
};

const temporaryMockednotAdm = {
name: 'Guilherme Bernardo',
email: 'contato@mail.com',
isAdm: false,
password: 'Teste123@',
paymentMethods: {
    name: 'Guilherme Bernardo',
    cpf: '12345612345',
    number: '1111222233334444',
    dueDate: '2026-10-21',
    code: '123',
},
};

const mockedMovie = JSON.parse(JSON.stringify({
    "name": "Django Unchained",
    "year": 2012,
    "duration": 165,
    "direction": "Quentin Tarantino",
    "description": "Django (Jamie Foxx) é um escravo liberto cujo passado brutal com seus antigos proprietários leva-o ao encontro do caçador de recompensas alemão Dr. King Schultz (Christoph Waltz). Schultz está em busca dos irmãos assassinos Brittle, e somente Django pode levá-lo a eles. O pouco ortodoxo Schultz compra Django com a promessa de libertá-lo quando tiver capturado os irmãos Brittle, vivos ou mortos."
  }))

describe('/movies', () => {

    let connection: DataSource;
    
      beforeAll(async () => {
        await AppDataSource.initialize()
          .then((res) => {
            connection = res;
          })
          .catch((err) => {
            console.error('Data source initialization error', err);
          });
      });
    
      afterAll(async () => {
        await connection.destroy();
      });

      test("POST /movies - Must be able to post a Movie", async () => {

        const adminLoginResponse = await request(app).post("/login").send(temporaryMockedAdm);
        const response = await request(app).post('/movies').set("Authorization", `Bearer ${adminLoginResponse.body.token}`).send(mockedMovie)

        expect(response.body).toHaveProperty("id")
        expect(response.body).toHaveProperty("name")
        expect(response.body).toHaveProperty("year")
        expect(response.body).toHaveProperty("duration")
        expect(response.body).toHaveProperty("description")
        expect(response.status).toBe(201)

      })

      test("POST /movies - should not be able to post a movie that already exists", async () => {

        const adminLoginResponse = await request(app).post("/login").send(temporaryMockedAdm);
        const response = await request(app).post('/movies').set("Authorization", `Bearer ${adminLoginResponse.body.token}`).send(mockedMovie)

        expect(response.body).toHaveProperty("message")
        expect(response.status).toBe(400)

      })

      test("POST /movies - should not be able to create movie without authentication", async () => {

        const notAdminLoginResponse = await request(app).post("/login").send(temporaryMockednotAdm);
        const response = await request(app).post('/movies').set("Authorization", `Bearer ${notAdminLoginResponse.body.token}`).send(mockedMovie)

        expect(response.body).toHaveProperty("message")
        expect(response.status).toBe(403)

      })

      test("POST /movies - should not be able to post movies without authentication", async () => {

        const response = await request(app).post('/movies').send(mockedMovie)

        expect(response.body).toHaveProperty("message")
        expect(response.status).toBe(401)

      })

      test("GET /movies - Must be able to list all movies", async () => {

        const response = await request(app).get('/movies')
        expect(response.body).toHaveLength(1)
        expect(response.status).toBe(200)

      })

      test("GET /movies/:id - Must be able to list one movie", async () => {
        
        const movieList = await request(app).get('/movies')
        const response = await request(app).get(`/movies/${movieList.body[0].id}`)

        expect(response.status).toBe(200)

        expect(response.body).toHaveProperty("id")
        expect(response.body).toHaveProperty("name")
        expect(response.body).toHaveProperty("year")
        expect(response.body).toHaveProperty("duration")
        expect(response.body).toHaveProperty("description")

      })

      test("GET /movies/:id - Should not be able to list a movie with invalid id", async () => {

        const response = await request(app).get(`/movies/13970660-5dbe-423a-9a9d-5c23b37943cf`)
        expect(response.body).toHaveProperty("message")
        expect(response.status).toBe(404)

      })

      test("DELELE /movies/:id - Should not be able to delete a movie with invalid id", async () => {
        
        const adminLoginResponse = await request(app).post("/login").send(temporaryMockedAdm);
        const response = await request(app).delete(`/movies/13970660-5dbe-423a-9a9d-5c23b37943cf`).set("Authorization", `Bearer ${adminLoginResponse.body.token}`)

        expect(response.body).toHaveProperty("message")
        expect(response.status).toBe(404)

      })

      test("DELELE /movies/:id - Should not be able to delete a movie without authentication", async () => {

        const notAdminLoginResponse = await request(app).post("/login").send(temporaryMockednotAdm);
        const movieList = await request(app).get('/movies')
        const movie = movieList.body[0].id
        const response = await request(app).delete(`/movies/${movie}`).set("Authorization", `Bearer ${notAdminLoginResponse.body.token}`)

        expect(response.body).toHaveProperty("message")
        expect(response.status).toBe(401)

      })

      test("DELELE /movies/:id", async () => {

        const adminLoginResponse = await request(app).post("/login").send(temporaryMockedAdm);
        const movieList = await request(app).get('/movies')
        const movie = movieList.body[0].id

        const findMovie = await request(app).get('/movie').set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
        const response = await request(app).delete(`/movies/${movie}`).set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
        expect(findMovie.body[0].isActive).toBe(false)

        expect(response.status).toBe(204)
        
    })


})