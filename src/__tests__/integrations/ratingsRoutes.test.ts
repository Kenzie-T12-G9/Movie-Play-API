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

const temporaryMockednotAdm2 = {
  name: 'Guilherme Bernardo 2',
  email: 'contato2@mail.com',
  isAdm: false,
  password: 'Teste123@',
  paymentMethods: {
    name: 'Guilherme Bernardo 2',
    cpf: '12345612345',
    number: '1111222233334444',
    dueDate: '2026-10-21',
    code: '123',
  },
};

const PostRate = JSON.parse(
  JSON.stringify({
    rate: 5,
    comment: 'Simplesmente incrível, indico a todos com certeza!',
    userId: '1127f3f2-0057-4d67-b68a-a689c3447331',
  })
);

const PostRateNumberInvalid = JSON.parse(
  JSON.stringify({
    rate: 6,
    comment: 'Filme simplesmente incrível, indico a todos com certeza!',
    userId: '1127f3f2-0057-4d67-b68a-a689c3447331',
  })
);

const PostIncompletRating = JSON.parse(
  JSON.stringify({
    rate: 5,
    comment: 'Filme simplesmente incrível, indico a todos com certeza!',
  })
);

const PostInvalidArgRating = JSON.parse(
  JSON.stringify({
    InvalidArg: null,
    rate: 5,
    comment: 'Filme simplesmente incrível, indico a todos com certeza!',
    userId: '1127f3f2-0057-4d67-b68a-a689c3447331',
  })
);

const mockedMovie = JSON.parse(
  JSON.stringify({
    name: 'Django Unchained',
    year: 2012,
    duration: 165,
    direction: 'Quentin Tarantino',
    description:
      'Django (Jamie Foxx) é um escravo liberto cujo passado brutal com seus antigos proprietários leva-o ao encontro do caçador de recompensas alemão Dr. King Schultz (Christoph Waltz). Schultz está em busca dos irmãos assassinos Brittle, e somente Django pode levá-lo a eles. O pouco ortodoxo Schultz compra Django com a promessa de libertá-lo quando tiver capturado os irmãos Brittle, vivos ou mortos.',
  })
);

const mockedSerie = JSON.parse(
  JSON.stringify({
    name: 'Bridgetown',
    year: 2020,
    description:
      'Oito irmãos inseparáveis buscam amor e felicidade na alta sociedade de Londres.',
    direction: 'Shonda Rhimes, Sarah Dollard',
  })
);

describe('/ratings', () => {
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
    await request(app).post('/users').send(temporaryMockednotAdm2);

    const adminLoginResponse = await request(app)
      .post('/login')
      .send(temporaryMockedAdm);

    await request(app)
      .post('/movies')
      .set('Authorization', `Bearer ${adminLoginResponse.body.token}`)
      .send(mockedMovie);

    await request(app)
      .post('/series')
      .set('Authorization', `Bearer ${adminLoginResponse.body.token}`)
      .send(mockedSerie);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test('POST /movies/:id/ratings - should not be able to create a without necessarily parameters', async () => {
    const notAdminLoginResponse = await request(app)
      .post('/login')
      .send(temporaryMockednotAdm);
    const responseGetMovies = await request(app).get('/movies');
    const movieToRating = await request(app).get(
      `/movies/${responseGetMovies.body[0].id}`
    );

    const response1 = await request(app)
      .post(`/movies/${movieToRating}/ratings`)
      .set('Authorization', `Bearer ${notAdminLoginResponse.body.token}`)
      .send(PostIncompletRating);

    expect(response1.body).toHaveProperty('message');
    expect(response1.status).toBe(400);

    const response2 = await request(app)
      .post(`/movies/${movieToRating}/ratings`)
      .set('Authorization', `Bearer ${notAdminLoginResponse.body.token}`)
      .send(PostInvalidArgRating);

    expect(response2.body).toHaveProperty('message');
    expect(response2.status).toBe(400);

    const response3 = await request(app)
      .post(`/movies/${movieToRating}/ratings`)
      .set('Authorization', `Bearer ${notAdminLoginResponse.body.token}`)
      .send(PostRateNumberInvalid);

    expect(response3.body).toHaveProperty('message');
    expect(response3.status).toBe(400);
  });

  test('POST /movies/:id/ratings - should not be able to create a without authentication', async () => {
    const responseGetMovies = await request(app).get('/movies');
    const movieToRating = await request(app).get(
      `/movies/${responseGetMovies.body[0].id}`
    );

    const response = await request(app)
      .post(`/movies/${movieToRating}/ratings`)
      .send(PostRate);

    expect(response.body).toHaveProperty('message');
    expect(response.status).toBe(403);
  });

  test('POST /movies/:id/ratings - Able to post a rate to movie', async () => {
    const notAdminLoginResponse = await request(app)
      .post('/login')
      .send(temporaryMockednotAdm);
    const responseGetMovies = await request(app).get('/movies');
    const movieToRating = await request(app).get(
      `/movies/${responseGetMovies.body[0].id}`
    );

    const response = await request(app)
      .post(`/movies/${movieToRating}/ratings`)
      .set('Authorization', `Bearer ${notAdminLoginResponse.body.token}`)
      .send(PostRate);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('arte');
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

    expect(response.status).toBe(200);
  });

  test('POST /series/:id/ratings - should not be able to create a without necessarily parameters', async () => {
    const notAdminLoginResponse = await request(app)
      .post('/login')
      .send(temporaryMockednotAdm);
    const responseGetSeries = await request(app).get('/series');
    const serieToRating = await request(app).get(
      `/series/${responseGetSeries.body[0].id}`
    );

    const response1 = await request(app)
      .post(`/series/${serieToRating}/ratings`)
      .set('Authorization', `Bearer ${notAdminLoginResponse.body.token}`)
      .send(PostIncompletRating);

    expect(response1.body).toHaveProperty('message');
    expect(response1.status).toBe(400);

    const response2 = await request(app)
      .post(`/series/${serieToRating}/ratings`)
      .set('Authorization', `Bearer ${notAdminLoginResponse.body.token}`)
      .send(PostInvalidArgRating);

    expect(response2.body).toHaveProperty('message');
    expect(response2.status).toBe(400);

    const response3 = await request(app)
      .post(`/series/${serieToRating}/ratings`)
      .set('Authorization', `Bearer ${notAdminLoginResponse.body.token}`)
      .send(PostRateNumberInvalid);

    expect(response3.body).toHaveProperty('message');
    expect(response3.status).toBe(400);
  });

  test('POST /series/:id/ratings - should not be able to create a without authentication', async () => {
    const responseGetMovies = await request(app).get('/series');
    const serieToRate = await request(app).get(
      `/series/${responseGetMovies.body[0].id}`
    );

    const response = await request(app)
      .post(`/movies/${serieToRate}/ratings`)
      .send(PostRate);

    expect(response.body).toHaveProperty('message');
    expect(response.status).toBe(403);
  });

  test('POST /series/:id/ratings - Able to create a series', async () => {
    const notAdminLoginResponse = await request(app)
      .post('/login')
      .send(temporaryMockednotAdm);
    const responseGetSeries = await request(app).get('/series');
    const serieToRating = await request(app).get(
      `/series/${responseGetSeries.body[0].id}`
    );

    const response = await request(app)
      .post(`/series/${serieToRating}/ratings`)
      .set('Authorization', `Bearer ${notAdminLoginResponse.body.token}`)
      .send(PostRate);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('arte');
    expect(response.body).toHaveProperty('comment');
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user).toHaveProperty('name');
    expect(response.body.user).toHaveProperty('email');
    expect(response.body.series).toHaveProperty('id');
    expect(response.body.series).toHaveProperty('name');
    expect(response.body.series).toHaveProperty('year');
    expect(response.body.series).toHaveProperty('duration');
    expect(response.body.series).toHaveProperty('direction');
    expect(response.body.series).toHaveProperty('description');

    expect(response.status).toBe(200);
  });

  test('GET /ratings/movies - Must be able to list all ratings in all movies', async () => {
    const response = await request(app).get('/ratings/movies');
    expect(response.body).toHaveLength(1);
    expect(response.status).toBe(200);
  });

  test('GET /ratings/series - Must be able to list all ratings in all series', async () => {
    const response = await request(app).get('/ratings/series');
    expect(response.body).toHaveLength(1);
    expect(response.status).toBe(200);
  });

  test('DELELE /ratings/:movieId/:userId - Should not be able to delete a movie rating with invalid ids', async () => {
    const adminLoginResponse = await request(app)
      .post('/login')
      .send(temporaryMockedAdm);
    const listUsers = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${adminLoginResponse.body.token}`);

    const loginResponse = await request(app)
      .post('/login')
      .send(temporaryMockednotAdm);

    const userId = listUsers.body[1].id;

    const response = await request(app)
      .delete(`/ratings/13970660-5dbe-423a-9a9d-5c23b37943cf/${userId}`)
      .set('Authorization', `Bearer ${loginResponse.body.token}`);

    expect(response.body).toHaveProperty('message');
    expect(response.status).toBe(404);
  });

  test('DELELE /ratings/:movieId/:userId - Should not be able to delete a movie rating without authentication', async () => {
    const listMovies = await request(app).get('/movies');

    const movieId = listMovies.body[0].id;

    const response = await request(app).delete(
      `/ratings/${movieId}/$13970660-5dbe-423a-9a9d-5c23b37943cf`
    );

    expect(response.body).toHaveProperty('message');
    expect(response.status).toBe(404);
  });

  test('DELELE /ratings/:movieId/:userId - Should not be able to delete a movie rating without admin authentication', async () => {
    const adminLoginResponse = await request(app)
      .post('/login')
      .send(temporaryMockedAdm);
    const listUsers = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${adminLoginResponse.body.token}`);

    const idNotAdmin2 = await request(app)
      .post('/login')
      .send(temporaryMockednotAdm2);

    const listMovies = await request(app).get('/movies');
    const movieId = listMovies.body[0].id;
    const userId = listUsers.body[2].id;

    const response = await request(app)
      .delete(`/ratings/${movieId}/${userId}`)
      .set('Authorization', `Bearer ${idNotAdmin2.body.token}`);

    expect(response.body).toHaveProperty('message');
    expect(response.status).toBe(404);
  });

  test('DELELE /ratings/:movieId/:userId - Able to delete a movie rate', async () => {
    const adminLoginResponse = await request(app)
      .post('/login')
      .send(temporaryMockedAdm);
    const listUsers = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${adminLoginResponse.body.token}`);

    const userId = listUsers.body[0].id;

    const listMovies = await request(app).get('/movies');
    const movieId = listMovies.body[0].id;

    const response = await request(app)
      .delete(`/ratings/${movieId}/${userId}`)
      .set('Authorization', `Bearer ${adminLoginResponse.body.token}`);

    expect(response.status).toBe(204);
  });
});
