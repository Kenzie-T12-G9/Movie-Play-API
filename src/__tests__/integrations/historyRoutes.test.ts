import { DataSource } from 'typeorm';
import request from 'supertest';
import AppDataSource from '../../data-source';
import app from '../../app';

describe('/history', () => {
  let connection: DataSource;

  const temporaryMockedMovieHistory = {
    userId: '1127f3f2-0057-4d67-b68a-a689c3447331',
    movieId: 'e0150833-89fc-436c-aa10-d2a68b0fa32f',
  };

  const temporaryMockedSerieHistory = {
    userId: '1127f3f2-0057-4d67-b68a-a689c3447331',
    seriesId: 'e0150833-89fc-436c-aa10-d2a68b0fa32f',
  };

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => {
        connection = res;
      })
      .catch((err) => {
        console.error('Data source initialization error', err);
      });

    await request(app).post('/users').send('USAR O MOCK DE CRIAR USUÁRIO');
    await request(app).post('/login').send('USAR O MOCK DE LOGAR USUÁRIO');
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test('POST /history - should be able to create a movie history', async () => {
    const response = await request(app)
      .post('/history')
      .send(temporaryMockedMovieHistory);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('watchedAt');
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('movie');
  });

  test('POST /history - should be able to create a serie history', async () => {
    const response = await request(app)
      .post('/history')
      .send(temporaryMockedSerieHistory);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('watchedAt');
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('series');
  });

  test('POST /history - should not be able to create history without title ID', async () => {
    const response = await request(app)
      .post('/history')
      .send({ userId: '1127f3f2-0057-4d67-b68a-a689c3447331' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  test('POST /history - should not be able to create movie history without user ID', async () => {
    const response = await request(app)
      .post('/history')
      .send({ movieId: 'e0150833-89fc-436c-aa10-d2a68b0fa32f' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  test('POST /history - should not be able to create series history without user ID', async () => {
    const response = await request(app)
      .post('/history')
      .send({ seriesId: 'e0150833-89fc-436c-aa10-d2a68b0fa32f' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  test('POST /history - should not be able to create a history without authentication', async () => {
    const response = await request(app)
      .post('/history')
      .set('Authorization', `Bearer ${null}`)
      .send(temporaryMockedMovieHistory);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message');
  });

  test('POST /history - should not be able to create a history with invalid user', async () => {
    const response = await request(app).post('/history').send({
      userId: undefined,
      movieId: 'e0150833-89fc-436c-aa10-d2a68b0fa32f',
    });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message');
  });

  test('GET /history/movies - should be able to list all movies history', async () => {
    await request(app).post('/users').send('CRIAR USER ADMIN COM MOCK');
    const adminLoginResponse = await request(app)
      .post('/login')
      .send('LOGAR COM UM MOCK DE ADMIN');
    const response = await request(app)
      .get('/history/movies')
      .set('Authorization', `Bearer ${adminLoginResponse.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  test('GET /history/movies - should not be able to list movies history without authentication', async () => {
    const response = await request(app).get('/history/movies');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message');
  });

  test('GET /history/movies - should not be able to list history movies not being admin', async () => {
    const userLoginResponse = await request(app)
      .post('/login')
      .send('MOCK DE USER NÃO ADMIN');
    const response = await request(app)
      .get('/history/movies')
      .set('Authorization', `Bearer ${userLoginResponse.body.token}`);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('message');
  });

  test('GET /history/series - should be able to list all series history', async () => {
    await request(app).post('/users').send('CRIAR USER ADMIN COM MOCK');
    const adminLoginResponse = await request(app)
      .post('/login')
      .send('LOGAR COM UM MOCK DE ADMIN');
    const response = await request(app)
      .get('/history/series')
      .set('Authorization', `Bearer ${adminLoginResponse.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  test('GET /history/series - should not be able to list series history without authentication', async () => {
    const response = await request(app).get('/history/series');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message');
  });

  test('GET /history/series - should not be able to list history series not being admin', async () => {
    const userLoginResponse = await request(app)
      .post('/login')
      .send('MOCK DE USER NÃO ADMIN');
    const response = await request(app)
      .get('/history/series')
      .set('Authorization', `Bearer ${userLoginResponse.body.token}`);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('message');
  });

  test('GET /history/movies/:movieId - should be able to list register movie by id', async () => {
    await request(app).post('/users').send('CRIAR USER ADMIN COM MOCK');
    const adminLoginResponse = await request(app)
      .post('/login')
      .send('LOGAR COM UM MOCK DE ADMIN');
    const response = await request(app)
      .get(`/history/movies/${temporaryMockedMovieHistory.movieId}`)
      .set('Authorization', `Bearer ${adminLoginResponse.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('movie');
    expect(response.body).toHaveProperty('activity');
  });

  test('GET /history/movies/:movieId -  should not be able to list movie history without authentication', async () => {
    const response = await request(app).get(`/history/movies/${temporaryMockedMovieHistory.movieId}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message');
  });

  test('GET /history/movies/:movieId -  should not be able to list history movie that not exist', async () => {
    const userLoginResponse = await request(app)
      .post('/login')
      .send('MOCK DE USER NÃO ADMIN');
    const response = await request(app)
      .get(`/history/movies/${undefined}`)
      .set('Authorization', `Bearer ${userLoginResponse.body.token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message');
  });

  test('GET /history/series/:seriesId - should be able to list register series by id', async () => {
    await request(app).post('/users').send('CRIAR USER ADMIN COM MOCK');
    const adminLoginResponse = await request(app)
      .post('/login')
      .send('LOGAR COM UM MOCK DE ADMIN');
    const response = await request(app)
      .get(`/history/series/${temporaryMockedSerieHistory.seriesId}`)
      .set('Authorization', `Bearer ${adminLoginResponse.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('serie');
    expect(response.body).toHaveProperty('activity');
  });

  test('GET /history/series/:seriesId -  should not be able to list series history without authentication', async () => {
    const response = await request(app).get(`/history/series/${temporaryMockedSerieHistory.seriesId}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message');
  });

  test('GET /history/series/:seriesId -  should not be able to list history series that not exist', async () => {
    const userLoginResponse = await request(app)
      .post('/login')
      .send('MOCK DE USER NÃO ADMIN');
    const response = await request(app)
      .get(`/history/series/${undefined}`)
      .set('Authorization', `Bearer ${userLoginResponse.body.token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message');
  });
});
