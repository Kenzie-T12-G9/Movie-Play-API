import { DataSource } from 'typeorm';
import request from 'supertest';
import AppDataSource from '../../data-source';
import app from '../../app';
import {} from '../mocks/session';
import {
  createSerie,
  createUserADM,
  createUserNotAdm,
  loginUserAdm,
  loginUserNotAdm,
} from '../mocks/Series';
import { createMovie } from '../mocks/Movies';

describe('/history', () => {
  let connection: DataSource;

  let tokenADM: string;
  let tokenNotADM: string;
  let seriesId: string;
  let movieId: string;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => {
        connection = res;
      })
      .catch((err) => {
        console.error('Error during Data Source initialization', err);
      });

    await request(app).post('/users').send(createUserADM);
    await request(app).post('/users').send(createUserNotAdm);

    const adminLoginResponse = await request(app)
      .post('/login')
      .send(loginUserAdm);
    const notAdmLoginResponse = await request(app)
      .post('/login')
      .send(loginUserNotAdm);

    tokenADM = adminLoginResponse.body.token;
    tokenNotADM = notAdmLoginResponse.body.token;

    const movieResponse = await request(app)
      .post('/movies')
      .send(createMovie)
      .set('Authorization', `Bearer ${tokenADM}`);
    const seriesResponse = await request(app)
      .post('/series')
      .send(createSerie)
      .set('Authorization', `Bearer ${tokenADM}`);

    movieId = movieResponse.body.id;
    seriesId = seriesResponse.body.id;
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test('POST /history - Should be able to create a movie history being admin', async () => {
    const response = await request(app)
      .post('/history')
      .set('Authorization', `Bearer ${tokenADM}`)
      .send({ movieId });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('watchedAt');
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('movie');
    expect(response.body).not.toHaveProperty('series');
  });

  test('POST /history - should be able to create a series history', async () => {
    const response = await request(app)
      .post('/history')
      .set('Authorization', `Bearer ${tokenADM}`)
      .send({ seriesId });
    console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('watchedAt');
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('series');
    expect(response.body).not.toHaveProperty('movie');
  });

  test('POST /history - should not be able to create history without title ID', async () => {
    const responseWith = await request(app)
      .post('/history')
      .set('Authorization', `Bearer ${tokenADM}`)
      .send({ seriesId, movieId });
    const responseWithout = await request(app)
      .post('/history')
      .set('Authorization', `Bearer ${tokenADM}`)
      .send({});

    [responseWith, responseWithout].forEach((response) => {
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual('Send only series or movie');
    });
  });

  test('POST /history - should not be able to create a history without authentication', async () => {
    const response = await request(app).post('/history').send({ movieId });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual('Missing authorization token');
  });

  test('POST /history - should not be able to create a history without authentication', async () => {
    const response = await request(app)
      .post('/history')
      .set('Authorization', `Bearer ${tokenADM}`)
      .send({ movieId: 'invalidUUID' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(['Must be a v4 UUID']);
  });

  test('GET /history/movies - should be able to list all movies history', async () => {
    const response = await request(app)
      .get('/history/movies')
      .set('Authorization', `Bearer ${tokenADM}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body).not.toHaveProperty('message');
  });

  test('GET /history/movies - should not be able to list movies history without authentication', async () => {
    const response = await request(app).get('/history/movies');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual('Missing authorization token');
  });

  test('GET /history/series - should be able to list all series history', async () => {
    const response = await request(app)
      .get('/history/series')
      .set('Authorization', `Bearer ${tokenADM}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body).not.toHaveProperty('message');
  });

  test('GET /history/series - should not be able to list series history without authentication', async () => {
    const response = await request(app).get('/history/series');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual('Missing authorization token');
  });

  test('GET /history/movies/:movieId - should be able to list register movie by id as admin', async () => {
    const response = await request(app)
      .get(`/history/movies/${movieId}`)
      .set('Authorization', `Bearer ${tokenADM}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('movie');
    expect(response.body).toHaveProperty('activity');
  });

  test('GET /history/movies/:movieId -  should not be able to list movie history without authentication', async () => {
    const response = await request(app).get(`/history/movies/${movieId}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual('Missing authorization token');
  });

  test('GET /history/movies/:movieId - should not be able to list history movie that not exist', async () => {
    const invalidId = '2640b089-20ad-4c7c-8d38-5f3d7bdc7ce1';
    const response = await request(app)
      .get(`/history/movies/${invalidId}`)
      .set('Authorization', `Bearer ${tokenADM}`);
    console.log(response.error);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual('Movie not found');
  });

  test('GET /history/series/:seriesId - should be able to list history series by id', async () => {
    const response = await request(app)
      .get(`/history/series/${seriesId}`)
      .set('Authorization', `Bearer ${tokenADM}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('series');
    expect(response.body).toHaveProperty('activity');
  });

  test('GET /history/series/:seriesId - should not be able to list series history without authentication', async () => {
    const response = await request(app).get(`/history/series/${seriesId}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual('Missing authorization token');
  });

  test('GET /history/series/:seriesId - should not be able to list history series that not exists', async () => {
    const invalidId = '2640b089-20ad-4c7c-8d38-5f3d7bdc7ce1';
    const response = await request(app)
      .get(`/history/series/${invalidId}`)
      .set('Authorization', `Bearer ${tokenADM}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message');
  });
});
