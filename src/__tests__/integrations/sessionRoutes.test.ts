import { DataSource } from 'typeorm';
import request from 'supertest';
import AppDataSource from '../../data-source';
import app from '../../app';

describe('/login', () => {
  let connection: DataSource;

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

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => {
        connection = res;
      })
      .catch((err) => {
        console.error('Data source initialization error', err);
      });

    await request(app).post('/users').send(temporaryMockedAdm);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test('POST /login - should be able to login with user', async () => {
    const response = await request(app).post('/login').send({
      email: 'francisco@mail.com',
      password: 'Teste123@',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('paymentMethods');
    expect(response.body).toHaveProperty('token');
  });

  test("POST /login - should not be able to login with the user with incorrect email",async () => {
    const response = await request(app).post("/login").send({
        email: "emailErrado@mail.com",
        password: "Teste123@"
    });

    expect(response.body).toHaveProperty("message")
    expect(response.status).toBe(400)
  }); 

  test("POST /login - should not be able to login with the user with incorrect password",async () => {
    const response = await request(app).post("/login").send({
        email: "francisco@mail.com",
        password: "senhaErrada@123"
    });

    expect(response.body).toHaveProperty("message")
    expect(response.status).toBe(400)
  }); 
});
