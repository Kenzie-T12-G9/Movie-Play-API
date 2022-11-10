import {
  IAddEpisodeoSerie,
  ICreateSerie,
  IUpdateSerie,
} from '../../../interfaces/series';
import { IUserLoginBody, IUserRequestBody } from '../../../interfaces/users';

export const createUserADM: IUserRequestBody = {
  name: 'Myke',
  email: 'adm@gmail.com',
  password: '123',
  isAdm: true,
  paymentMethods: {
    name: 'Santander',
    cpf: '13434343334',
    number: '1',
    dueDate: '2024-12-25',
    code: '345',
  },
};

export const createUserNotAdm: IUserRequestBody = {
  name: 'Myke',
  email: 'notAdm@gmail.com',
  password: '123',
  isAdm: false,
  paymentMethods: {
    name: 'Santander',
    cpf: '13434343334',
    number: '1',
    dueDate: '2025-10-23',
    code: '345',
  },
};

export const loginUserAdm: IUserLoginBody = {
  email: 'adm@gmail.com',
  password: '123',
};

export const loginUserNotAdm: IUserLoginBody = {
  email: 'notAdm@gmail.com',
  password: '123',
};

export const createSerie: ICreateSerie = {
  name: 'The mandalorian',
  year: '2020',
  description: 'Yoda',
  direction: 'Lucas',
};

export const createSerieInvalidYear: ICreateSerie = {
  name: 'The mandalorian',
  year: '2020',
  description: 'Yoda',
  direction: 'Lucas',
};

export const createSerieValueless: ICreateSerie = {
  name: '',
  year: '',
  description: '',
  direction: '',
};

export const updateSerie: IUpdateSerie = {
  name: 'The mandalorian 2',
  year: '2023',
  description: 'Indefinido',
  direction: 'Lucas filmes',
};

export const addEpisodesInSeries: IAddEpisodeoSerie = {
  season: 1,
  episode: 1,
  name: 'A  procura 1',
  duration: 500000,
  description: 'Ele procura uma chicara',
};

export const addEpisodesInSeriesValueless = {
  season: '',
  episode: '',
  name: '',
  duration: '',
  description: '',
};
