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

      test("", async () => {

        const mockedProperty = JSON.parse(JSON.stringify({
            "id": "e0150833-89fc-436c-aa10-d2a68b0fa32f",
            "name": "Django Unchained",
            "year": 2012,
            "duration": 165,
            "direction": "Quentin Tarantino",
            "description": "Django (Jamie Foxx) é um escravo liberto cujo passado brutal com seus antigos proprietários leva-o ao encontro do caçador de recompensas alemão Dr. King Schultz (Christoph Waltz). Schultz está em busca dos irmãos assassinos Brittle, e somente Django pode levá-lo a eles. O pouco ortodoxo Schultz compra Django com a promessa de libertá-lo quando tiver capturado os irmãos Brittle, vivos ou mortos."
          }))

        const adminLoginResponse = await request(app).post("/login").send(temporaryMockednotAdm);
        const response = await request(app).post('/properties').set("Authorization", `Bearer ${adminLoginResponse.body.token}`).send(mockedProperty)



      })

      test("", async () => {})

      test("", async () => {})

      test("", async () => {})

      test("", async () => {})


})