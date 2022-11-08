import { DataSource } from 'typeorm';
import request from 'supertest';
import AppDataSource from '../../data-source';
import app from '../../app';
import { } from '../mocks/session';
import { createUserADM, createUserNotAdm, loginUserAdm, loginUserNotAdm } from '../mocks/Series/indes';
import { mockedMovieHistory, mockedSerieHistory } from '../mocks/History';

describe('/history', () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => {
        connection = res;
      })
      .catch((err) => {
        console.error('Data source initialization error', err);
      });

    await request(app).post('/users').send(createUserADM);
    await request(app).post('/users').send(createUserNotAdm);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test('POST /history - should be able to create a movie history', async () => {
    const loggedUser = await request(app).post('/login').send(loginUserAdm)
    const response = await request(app)
      .post('/history')
      .set('Authorization', `Bearer ${loggedUser.body.token}`)
      .send(mockedMovieHistory);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('watchedAt');
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('movie');
  });

  test('POST /history - should be able to create a serie history', async () => {
    const loggedUser = await request(app).post('/login').send(loginUserNotAdm)
    const response = await request(app)
      .post('/history')
      .set('Authorization', `Bearer ${loggedUser.body.token}`)
      .send(mockedSerieHistory);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('watchedAt');
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('series');
  });

  test('POST /history - should not be able to create history without title ID', async () => {
    const loggedUser = await request(app).post('/login').send(loginUserNotAdm)
    const response = await request(app)
      .post('/history')
      .set('Authorization', `Bearer ${loggedUser.body.token}`)
      .send({ userId: '1127f3f2-0057-4d67-b68a-a689c3447331' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  test('POST /history - should not be able to create movie history without user ID', async () => {
    const loggedUser = await request(app).post('/login').send(loginUserNotAdm)
    const response = await request(app)
      .post('/history')
      .set('Authorization', `Bearer ${loggedUser.body.token}`)
      .send({ movieId: 'e0150833-89fc-436c-aa10-d2a68b0fa32f' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  test('POST /history - should not be able to create series history without user ID', async () => {
    const loggedUser = await request(app).post('/login').send(loginUserNotAdm)
    const response = await request(app)
      .post('/history')
      .set('Authorization', `Bearer ${loggedUser.body.token}`)
      .send({ seriesId: 'e0150833-89fc-436c-aa10-d2a68b0fa32f' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  test('POST /history - should not be able to create a history without authentication', async () => {
    const loggedUser = await request(app).post('/login').send(loginUserNotAdm)
    const response = await request(app)
      .post('/history')
      .set('Authorization', `Bearer ${null}`)
      .send(mockedMovieHistory);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message');
  });

  test('POST /history - should not be able to create a history with invalid user', async () => {
    const loggedUser = await request(app).post('/login').send(loginUserNotAdm)
    const response = await request(app)
    .post('/history')
    .set('Authorization', `Bearer ${loggedUser.body.token}`)
    .send({
      userId: undefined,
      movieId: 'e0150833-89fc-436c-aa10-d2a68b0fa32f',
    });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message');
  });

  test('GET /history/movies - should be able to list all movies history', async () => {
    const loggedAdm = await request(app).post('/login').send(loginUserAdm)
    const response = await request(app)
      .get('/history/movies')
      .set('Authorization', `Bearer ${loggedAdm.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  test('GET /history/movies - should not be able to list movies history without authentication', async () => {
    const loggedAdm = await request(app).post('/login').send(loginUserAdm)
    const response = await request(app).get('/history/movies');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message');
  });

  test('GET /history/movies - should not be able to list history movies not being admin', async () => {
    const userLoginResponse = await request(app)
      .post('/login')
      .send(loginUserNotAdm);
    const response = await request(app)
      .get('/history/movies')
      .set('Authorization', `Bearer ${userLoginResponse.body.token}`);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('message');
  });

  test('GET /history/series - should be able to list all series history', async () => {
    const adminLoginResponse = await request(app)
      .post('/login')
      .send(loginUserAdm);
    const response = await request(app)
      .get('/history/series')
      .set('Authorization', `Bearer ${adminLoginResponse.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  test('GET /history/series - should not be able to list series history without authentication', async () => {
    const loggedAdm = await request(app).post('/login').send(loginUserAdm)
    const response = await request(app).get('/history/series');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message');
  });

  test('GET /history/series - should not be able to list history series not being admin', async () => {
    const userLoginResponse = await request(app)
      .post('/login')
      .send(loginUserNotAdm);
    const response = await request(app)
      .get('/history/series')
      .set('Authorization', `Bearer ${userLoginResponse.body.token}`);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('message');
  });

  test('GET /history/movies/:movieId - should be able to list register movie by id', async () => {
    const adminLoginResponse = await request(app)
      .post('/login')
      .send(loginUserAdm);
    const response = await request(app)
      .get(`/history/movies/${mockedMovieHistory.movieId}`)
      .set('Authorization', `Bearer ${adminLoginResponse.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('movie');
    expect(response.body).toHaveProperty('activity');
  });

  test('GET /history/movies/:movieId -  should not be able to list movie history without authentication', async () => {
    const adminLoginResponse = await request(app)
      .post('/login')
      .send(loginUserAdm);
    const response = await request(app).get(`/history/movies/${mockedMovieHistory.movieId}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message');
  });

  test('GET /history/movies/:movieId -  should not be able to list history movie that not exist', async () => {
    const userLoginResponse = await request(app)
      .post('/login')
      .send(loginUserNotAdm);
    const response = await request(app)
      .get(`/history/movies/${undefined}`)
      .set('Authorization', `Bearer ${userLoginResponse.body.token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message');
  });

  test('GET /history/series/:seriesId - should be able to list register series by id', async () => {
    const adminLoginResponse = await request(app)
      .post('/login')
      .send(loginUserAdm);
    const response = await request(app)
      .get(`/history/series/${mockedSerieHistory.seriesId}`)
      .set('Authorization', `Bearer ${adminLoginResponse.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('serie');
    expect(response.body).toHaveProperty('activity');
  });

  test('GET /history/series/:seriesId -  should not be able to list series history without authentication', async () => {
    const adminLoginResponse = await request(app)
      .post('/login')
      .send(loginUserAdm);
    const response = await request(app).get(`/history/series/${mockedSerieHistory.seriesId}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message');
  });

  test('GET /history/series/:seriesId -  should not be able to list history series that not exist', async () => {
    const userLoginResponse = await request(app)
      .post('/login')
      .send(loginUserNotAdm);
    const response = await request(app)
      .get(`/history/series/${undefined}`)
      .set('Authorization', `Bearer ${userLoginResponse.body.token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message');
  });
});
