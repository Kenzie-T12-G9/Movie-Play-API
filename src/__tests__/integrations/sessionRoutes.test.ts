import { DataSource } from 'typeorm';
import request from 'supertest';
import AppDataSource from '../../data-source';
import app from '../../app';
import { createUserAdm, userAdmLogin, userAdmLoginIncorrectMail, userAdmLoginIncorrectPassword } from '../mocks/session';

describe('/login', () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => {
        connection = res;
      })
      .catch((err) => {
        console.error('Data source initialization error', err);
      });

    await request(app).post('/users').send(createUserAdm);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test('POST /login - should be able to login with user', async () => {
    const response = await request(app).post('/login').send(userAdmLogin);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  test("POST /login -  should not be able to login with the user with incorrect email",async () => {
    const response = await request(app).post("/login").send(userAdmLoginIncorrectMail);

    expect(response.body).toHaveProperty("message")
    expect(response.status).toBe(401)
  }); 

  test("POST /login -  should not be able to login with the user with incorrect password",async () => {
    const response = await request(app).post("/login").send(userAdmLoginIncorrectPassword);

    expect(response.body).toHaveProperty("message")
    expect(response.status).toBe(401)
  }); 
});
