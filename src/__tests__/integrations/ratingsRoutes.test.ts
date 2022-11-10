import { DataSource } from 'typeorm';
import request from 'supertest';
import AppDataSource from '../../data-source';
import app from '../../app';
import { mockedAdmin, mockedNotAdmin } from '../mocks/users';
import { userAdm, userNotAdm } from '../mocks/session';
import { createMovie } from '../mocks/Movies';
import { createSerie } from '../mocks/Series';
import { mockedAbsent } from '../mocks/Ratings';
import { IRatingInvalid, IRatingRequest } from '../../interfaces/ratings';

describe('/ratings', () => {
  let connection: DataSource;
  let tokenADM: string;
  let tokenNotADM: string;
  let userId: string;
  let movieId: string;
  let seriesId: string;

  let mockedRating: IRatingRequest;
  let mockedInvalidField: IRatingInvalid;
  let mockedInvalidRate: IRatingRequest;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => {
        connection = res;
      })
      .catch((err) => {
        console.error('Data source initialization error', err);
      });

    await request(app).post('/users').send(mockedAdmin);
    await request(app).post('/users').send(mockedNotAdmin);

    const adminLoginResponse = await request(app).post('/login').send(userAdm);
    const notAdmLoginResponse = await request(app)
      .post('/login')
      .send(userNotAdm);

    tokenADM = adminLoginResponse.body.token;
    tokenNotADM = notAdmLoginResponse.body.token;
    userId = notAdmLoginResponse.body.user.id;

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

    mockedRating = { ...mockedAbsent, userId };
    mockedInvalidField = { ...mockedRating, invalidField: null };
    mockedInvalidRate = { ...mockedRating, rate: 10 };
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test('POST /ratings/movies/:id - should not be able to create a rate without necessarily parameters', async () => {
    const response1 = await request(app)
      .post(`/ratings/movies/${movieId}`)
      .set('Authorization', `Bearer ${tokenNotADM}`)
      .send(mockedAbsent);

    expect(response1.status).toBe(400);
    expect(response1.body).toHaveProperty('message');
    expect(response1.body.message).toEqual(['userId is a required field']);

    const response2 = await request(app)
      .post(`/ratings/movies/${movieId}`)
      .set('Authorization', `Bearer ${tokenNotADM}`)
      .send(mockedInvalidField);

    expect(response2.status).toBe(400);
    expect(response2.body).toHaveProperty('message');
    expect(response2.body.message).toEqual([
      'this field has unspecified keys: invalidField',
    ]);

    const response3 = await request(app)
      .post(`/ratings/movies/${movieId}`)
      .set('Authorization', `Bearer ${tokenNotADM}`)
      .send(mockedInvalidRate);

    expect(response3.status).toBe(400);
    expect(response3.body).toHaveProperty('message');
    expect(response3.body.message).toEqual([
      "Value of argument 'rate' must be an integer between 1 and 5",
    ]);
  });

  test('POST /ratings/movies/:id - should not be able to create a rating without authentication', async () => {
    const response = await request(app)
      .post(`/ratings/movies/${movieId}`)
      .send(mockedRating);

    expect(response.body).toHaveProperty('message');
    expect(response.status).toBe(401);
  });

  test('POST /ratings/movies/:id - Able to post a rate to a movie', async () => {
    const response = await request(app)
      .post(`/ratings/movies/${movieId}`)
      .set('Authorization', `Bearer ${tokenNotADM}`)
      .send(mockedRating);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('rate');
    expect(response.body).toHaveProperty('comment');
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user).toHaveProperty('name');
    expect(response.body.user).toHaveProperty('email');
    expect(response.body.movie).toHaveProperty('id');
    expect(response.body.movie).toHaveProperty('name');
    expect(response.body.movie).toHaveProperty('year');
    expect(response.body.movie).toHaveProperty('duration');
    expect(response.body.movie).toHaveProperty('direction');
    expect(response.body.movie).toHaveProperty('description');
  });

  test('POST /ratings/series/:id - should not be able to create a without necessarily parameters', async () => {
    const response1 = await request(app)
      .post(`/ratings/series/${seriesId}`)
      .set('Authorization', `Bearer ${tokenNotADM}`)
      .send(mockedAbsent);

    expect(response1.status).toBe(400);
    expect(response1.body).toHaveProperty('message');

    const response2 = await request(app)
      .post(`/ratings/series/${seriesId}`)
      .set('Authorization', `Bearer ${tokenNotADM}`)
      .send(mockedInvalidField);

    expect(response2.status).toBe(400);
    expect(response2.body).toHaveProperty('message');

    const response3 = await request(app)
      .post(`/ratings/series/${seriesId}`)
      .set('Authorization', `Bearer ${tokenNotADM}`)
      .send(mockedInvalidRate);

    expect(response3.status).toBe(400);
    expect(response3.body).toHaveProperty('message');
  });

  test('POST /ratings/series/:id - should not be able to create a without authentication', async () => {
    const response = await request(app)
      .post(`/ratings/series/${seriesId}`)
      .send(mockedRating);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message');
  });

  test('POST /ratings/series/:id - Able to create a series', async () => {
    const response = await request(app)
      .post(`/ratings/series/${seriesId}`)
      .set('Authorization', `Bearer ${tokenNotADM}`)
      .send(mockedRating);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('rate');
    expect(response.body).toHaveProperty('comment');
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('series');
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user).toHaveProperty('name');
    expect(response.body.user).toHaveProperty('email');
    expect(response.body.series).toHaveProperty('id');
    expect(response.body.series).toHaveProperty('name');
    expect(response.body.series).toHaveProperty('year');
    expect(response.body.series).toHaveProperty('direction');
    expect(response.body.series).toHaveProperty('description');
  });

  test('GET /ratings/movies - Must be able to list all ratings in all movies', async () => {
    const response = await request(app).get('/ratings/movies');

    expect(response.status).toBe(200);
    expect(response.body).not.toHaveProperty('message');
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('rate');
    expect(response.body[0]).toHaveProperty('comment');
    expect(response.body[0]).toHaveProperty('user');
    expect(response.body[0].user).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('movie');
    expect(response.body[0].movie).toHaveProperty('id');
    expect(response.body).toHaveLength(1);
  });

  test('GET /ratings/series - Must be able to list all ratings in all series', async () => {
    const response = await request(app).get('/ratings/series');

    expect(response.status).toBe(200);
    expect(response.body).not.toHaveProperty('message');
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('rate');
    expect(response.body[0]).toHaveProperty('comment');
    expect(response.body[0]).toHaveProperty('user');
    expect(response.body[0].user).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('series');
    expect(response.body[0].series).toHaveProperty('id');
    expect(response.body).toHaveLength(1);
  });

  test('DELELE /ratings/:id - Should not be able to delete a rating with invalid ids', async () => {
    const invalidUUID = 'd3fa00e4-bcd9-4c59-9609-c7ac9a931074';
    const response = await request(app)
      .delete(`/ratings/${invalidUUID}`)
      .set('Authorization', `Bearer ${tokenNotADM}`);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual('Rating not found');
    expect(response.status).toBe(404);
  });

  test('DELELE /ratings/:id - Should not be able to delete a movie rating without authentication', async () => {
    const invalidUUID = 'd3fa00e4-bcd9-4c59-9609-c7ac9a931074';
    const response = await request(app).delete(`/ratings/${invalidUUID}`);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual('Missing authorization headers');
    expect(response.status).toBe(401);
  });

  test('DELELE /ratings/:id - Able to delete rate', async () => {
    const listRating = await request(app)
      .get('/ratings/movies')
      .set('Authorization', `Bearer ${tokenADM}`);

    const response = await request(app)
      .delete(`/ratings/${listRating.body[0].id}`)
      .set('Authorization', `Bearer ${tokenADM}`);

    expect(response.status).toBe(204);
    expect(response.body).not.toHaveProperty('message');
    expect(response.body).not.toHaveProperty('id');
  });
});
