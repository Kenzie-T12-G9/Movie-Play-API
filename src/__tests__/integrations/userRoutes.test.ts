import request from 'supertest';
import { DataSource } from 'typeorm';
import app from '../../app';
import AppDataSource from '../../data-source';
import { userAdm, userNotAdm } from '../mocks/session';

import { 
  mockedAbsent, mockedAdmin, mockedDeletion, mockedExpired, mockedInvalid, mockedNotAdmin, mockedPayment 
} from '../mocks/users';

describe('/users', () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => {
        connection = res;
      })
      .catch((err) => {
        console.error('Error during data-source initialization', err);
      });
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test('POST /users - Must be able to create a new user', async () => {
    const response = await request(app).post('/users').send(mockedAdmin);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('email');
    expect(response.body).not.toHaveProperty('password');
    expect(response.body).toHaveProperty('isAdm');
    expect(response.body).toHaveProperty('paymentMethods');
    expect(response.body.paymentMethods).toHaveProperty('id');
    expect(response.body.paymentMethods).toHaveProperty('name');
    expect(response.body.paymentMethods).toHaveProperty('cpf');
    expect(response.body.paymentMethods).toHaveProperty('number');
    expect(response.body.paymentMethods).toHaveProperty('dueDate');
    expect(response.body.paymentMethods).toHaveProperty('code');

    expect(response.status).toBe(201);
  });

  test('POST /users - Should not be able to create a user that already exists', async () => {
    const response = await request(app).post('/users').send(mockedAdmin);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual('This email is already being used');

    expect(response.status).toBe(400);
  });
  
  test('POST /users - Should not be able to create a user with a body contaiining invalid fields', async () => {
    const response = await request(app).post('/users').send(mockedInvalid);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(['this field has unspecified keys: invalidField']);

    expect(response.status).toBe(400);
  });

  test('POST /users - Should not be able to create user with absent fields', async () => {
    const response = await request(app).post('/users').send(mockedAbsent);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(['name is a required field']);

    expect(response.status).toBe(400);
  });
  
  test('POST /users - Should not be able to create a user with payment method expired', async () => {
    const response = await request(app).post('/users').send(mockedExpired);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual('The payment card\'s due date has passed. Please try another method');

    expect(response.status).toBe(400);
  });

  test('POST /users - Should not be able to create a user without payment method', async () => {
    const response = await request(app).post('/users').send(mockedPayment);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual('Payment method is required');

    expect(response.status).toBe(402);
  });
  
  test('GET /users - Must be able to list users', async () => {
    await request(app).post('/users').send(mockedNotAdmin);
    const adminLogin = await request(app).post('/login').send(userAdm);
    const response = await request(app).get('/users').set('Authorization', `Bearer ${adminLogin.body.token}`);

    expect(response.body).toHaveLength(2);
    expect(response.status).toBe(200);
  });

  test('GET /users - Should not be able to list users without auth token', async () => {
    const response = await request(app).get('/users');

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual('Missing authorization headers');

    expect(response.status).toBe(401);
  });
  
  test('GET /users - Should not be able to list users with a invalid token', async () => {
    const response = await request(app).get('/users').set('Authorization', `Bearer invalidToken`);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual('Invalid Token');

    expect(response.status).toBe(401);
  });
  
  test('GET /users - Should not be able to list users without admin permissions', async () => {
    const notAdmLogin = await request(app).post('/login').send(userNotAdm);
    const response = await request(app).get('/users').set('Authorization', `Bearer ${notAdmLogin.body.token}`);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual('User is not admin');

    expect(response.status).toBe(403);
  });
  
  test('GET /users/:id - Must be able to list a specific user as an admin, or the logged\'n user\'s own profile', async () => {
    const loggedAdmin = await request(app).post('/login').send(userAdm);
    const loggedUser = await request(app).post('/login').send(userNotAdm);
    
    const otherProfile = await request(app).get(`/users/${loggedUser.body.user.id}`).set('Authorization', `Bearer ${loggedAdmin.body.token}`);
    const ownProfile = await request(app).get(`/users/${loggedUser.body.user.id}`).set('Authorization', `Bearer ${loggedUser.body.token}`);
    
    expect(otherProfile.body).not.toHaveProperty('message');
    expect(otherProfile.body).toHaveProperty('id');
    
    expect(ownProfile.body).not.toHaveProperty('message');
    expect(ownProfile.body).toHaveProperty('id');
    
    expect(otherProfile.status).toBe(200);
    expect(ownProfile.status).toBe(200);
  });
  
  test('GET /users/:id - Should not be able to list a user without authorization headers', async () => {
    const loggedUser = await request(app).post('/login').send(userAdm);
    const response = await request(app).get(`/users/${loggedUser.body.user.id}`);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual('Missing authorization headers');

    expect(response.status).toBe(401);
  });
  
  test('GET /users/:id - Should not be able to list a user with a invalid token', async () => {
    const loggedUser = await request(app).post('/login').send(userAdm);
    const response = await request(app).get(`/users/${loggedUser.body.user.id}`).set('Authorization', `Bearer invalidToken`);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual('Invalid Token');

    expect(response.status).toBe(401);
  });
  
  test('GET /users/:id - Should not be able to list other user without admin permissions', async () => {
    const loggedAdm = await request(app).post('/login').send(userAdm);
    const loggedUser = await request(app).post('/login').send(userNotAdm);
    const response = await request(app).get(`/users/${loggedAdm.body.user.id}`).set('Authorization', `Bearer ${loggedUser.body.token}`);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual('User is not admin');

    expect(response.status).toBe(403);
  });
  
  test('PATCH /users/:id - Must be able to update any user as admin or own profile as standart user', async () => {
    const userUpdates = { name: 'Carolina M Pimentel' };
    const adminUpdates = { name: 'Carolina Maronese Pimentel' };

    const admLogin = await request(app).post('/login').send(userAdm);
    const userLogin = await request(app).post('/login').send(userNotAdm);

    const admToken = `Bearer ${admLogin.body.token}`;
    const userToken = `Bearer ${userLogin.body.token}`;
    const userTobeUpdated = userLogin.body.user.id;

    const userResponse = await request(app).patch(`/users/${userTobeUpdated}`).set('Authorization', userToken).send(userUpdates);
    const admResponse = await request(app).patch(`/users/${userTobeUpdated}`).set('Authorization', admToken).send(adminUpdates);
    
    expect(userResponse.body).not.toHaveProperty('message');
    expect(userResponse.body).toHaveProperty('id');
    expect(userResponse.body).toHaveProperty('name');
    expect(userResponse.body.id).toEqual(userTobeUpdated);
    expect(userResponse.body.name).toEqual(userUpdates.name);
    
    expect(admResponse.body).not.toHaveProperty('message');
    expect(admResponse.body).toHaveProperty('id');
    expect(admResponse.body).toHaveProperty('name');
    expect(admResponse.body.id).toEqual(userTobeUpdated);
    expect(admResponse.body.name).toEqual(adminUpdates.name);

    expect(userResponse.status).toBe(200);
    expect(admResponse.status).toBe(200);
  });
  
  test('PATCH /users/:id - Should not be able to update users with invalid args', async () => {
    const invalidArgs = { invalid: null };

    const userLogin = await request(app).post('/login').send(userNotAdm);
    const userId = userLogin.body.user.id;
    const token = `Bearer ${userLogin.body.token}`;

    const response = await request(app).patch(`/users/${userId}`).set('Authorization', token).send(invalidArgs);
    
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(['this field has unspecified keys: invalid']);
    
    expect(response.status).toBe(400);
  });
  
  test('PATCH /users/:id - Should not be able to update paymentMethods without all fields', async () => {
    const partialPayment = {
      paymentMethods: { name: 'Some random name', code: '133' },
    };

    const userLogin = await request(app).post('/login').send(userNotAdm);
    const userId = userLogin.body.user.id;
    const token = `Bearer ${userLogin.body.token}`;
    
    const response = await request(app).patch(`/users/${userId}`).set('Authorization', token).send(partialPayment);
    
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual('The update of payment method must contain all the following keys: name, cpf, number, dueDate, code');
    
    expect(response.status).toBe(400);
  });

  test('PATCH /users/:id - Should not be able to update user without authorization token', async () => {
    const update = { name: 'Some random name' };

    const userLogin = await request(app).post('/login').send(userNotAdm);
    const userId = userLogin.body.user.id;

    const response = await request(app).patch(`/users/${userId}`).send(update);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual('Missing authorization headers');

    expect(response.status).toBe(401);
  });
  
  test('PATCH /users/:id - Should not be able to update user with a invalid token', async () => {
    const update = { name: 'Some random name' };
    
    const userLogin = await request(app).post('/login').send(userNotAdm);
    const userId = userLogin.body.user.id;
    
    const response = await request(app).patch(`/users/${userId}`).set("Authorization", "Bearer invalidToken").send(update);
    
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual('Invalid Token');
    
    expect(response.status).toBe(401);
  });
  
  test('PATCH /users/:id - Should not be able to update other user without admin permissions', async () => {
    const update = { name: 'Some random name' };
    
    const admLogin = await request(app).post('/login').send(userAdm);
    const userLogin = await request(app).post('/login').send(userNotAdm);
    const admId = admLogin.body.user.id;
    const token = `Bearer ${userLogin.body.token}`;

    const response = await request(app).patch(`/users/${admId}`).set('Authorization', token).send(update);
    
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual('User is not admin');

    expect(response.status).toBe(403);
  });
  
  test('PATCH /users/:id - Should not be able to update user that not exists', async () => {
    const update = { name: 'Some random name' };
    
    const admLogin = await request(app).post('/login').send(userAdm);
    const token = `Bearer ${admLogin.body.token}`;
  
    const response = await request(app).patch(`/users/invalidId`).set('Authorization', token).send(update);
    
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual('User not found');
  
    expect(response.status).toBe(404);
  });

  test('DELETE /users/:id - Should not be able to delete a user without authorization headers', async () => {
    const userLogin = await request(app).post('/login').send(userNotAdm);
    const userId = userLogin.body.user.id;

    const response = await request(app).delete(`/users/${userId}`);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual('Missing authorization headers');

    expect(response.status).toBe(401);
  });
  
  test('DELETE /users/:id - Should not be able to delete a user with a invalid token', async () => {
    const userLogin = await request(app).post('/login').send(userNotAdm);
    const userId = userLogin.body.user.id;

    const response = await request(app).delete(`/users/${userId}`).set('Authorization', 'Bearer invalidToken');

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual('Invalid Token');

    expect(response.status).toBe(401);
  });
  
  test('DELETE /users/:id - Should not be able to delete other user without admin permissions', async () => {
    const admLogin = await request(app).post('/login').send(userAdm);
    const userLogin = await request(app).post('/login').send(userNotAdm);

    const admId = admLogin.body.user.id;
    const token = `Bearer ${userLogin.body.token}`;
  
    const response = await request(app).delete(`/users/${admId}`).set('Authorization', token);
  
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual('User is not admin');
  
    expect(response.status).toBe(403);
  });

  test('DELETE /users/:id - Should not be able to delete a non-existent or inactive user', async () => {
    const newUser = await request(app).post('/users').send(mockedDeletion);
    const admLogin = await request(app).post('/login').send(userAdm);
    const newUserId = newUser.body.id;
    const token = `Bearer ${admLogin.body.token}`;

    await request(app)
      .delete(`/users/${newUserId}`)
      .set('Authorization', token);

    const responseInvalid = await request(app)
      .delete(`/users/${newUserId.replace('a', 'b')}`)
      .set('Authorization', token);
    const responseInactive = await request(app)
      .delete(`/users/${newUserId}`)
      .set('Authorization', token);

    expect(responseInvalid.body).toHaveProperty('message');
    expect(responseInvalid.body.message).toEqual('User not found');

    expect(responseInactive.body).toHaveProperty('message');
    expect(responseInactive.body.message).toEqual('User not found');

    expect(responseInvalid.status).toBe(404);
    expect(responseInactive.status).toBe(404);
  });

  test('DELETE /users/:id - Should be able to soft-delete a user', async () => {
    const newUser = await request(app).post('/users').send(mockedDeletion);
    const admLogin = await request(app).post('/login').send(userAdm);
    const newUserId = newUser.body.id;
    const token = `Bearer ${admLogin.body.token}`;

    const response = await request(app)
      .delete(`/users/${newUserId}`)
      .set('Authorization', token);

    expect(response.body).not.toHaveProperty('message');
    expect(response.status).toBe(204);
  });
});
