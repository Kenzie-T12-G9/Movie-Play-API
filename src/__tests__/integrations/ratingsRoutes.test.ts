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

describe('/', () => {

    let connection: DataSource;
    
      beforeAll(async () => {
        await AppDataSource.initialize()
          .then((res) => {
            connection = res;
          })
          .catch((err) => {
            console.error('Data source initialization error', err);
          });

          await request(app).post('/users').send(temporaryMockedAdm);

          await request(app).post('/users').send(temporaryMockednotAdm);
      });
    
      afterAll(async () => {
        await connection.destroy();
      });

      test("", async () => {})

      test("", async () => {})

      test("", async () => {})

      test("", async () => {})

      test("", async () => {})


})