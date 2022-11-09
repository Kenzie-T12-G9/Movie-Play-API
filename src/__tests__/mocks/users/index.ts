export const mockedAdmin = {
  name: 'Francisco Stenico',
  email: 'francisco@teste.com',
  password: '1234teste',
  isAdm: true,
  paymentMethods: {
    name: 'Francisco C Stenico',
    cpf: '12345678900',
    number: '1111222233334444',
    dueDate: '2026-10-21',
    code: '123',
  },
};

export const mockedNotAdmin = {
  name: 'Carolina Maronese',
  email: 'carolina@teste.com',
  password: '1234teste',
  isAdm: false,
  paymentMethods: {
    name: 'Carolina F Maronese',
    cpf: '12345678900',
    number: '1111222233334444',
    dueDate: '2026-10-21',
    code: '123',
  },
};

export const mockedInvalid = {
  invalidField: null,
  name: 'Francisco Stenico',
  email: 'francisco@teste.com',
  password: '1234teste',
  isAdm: true,
  paymentMethods: {
    name: 'Francisco C Stenico',
    cpf: '12345678900',
    number: '1111222233334444',
    dueDate: '2026-10-21',
    code: '123',
  },
};

export const mockedAbsent = {
  email: 'francisco@teste.com',
  password: '1234teste',
  isAdm: true,
  paymentMethods: {
    name: 'Francisco C Stenico',
    cpf: '12345678900',
    number: '1111222233334444',
    dueDate: '2026-10-21',
    code: '123',
  },
};

export const mockedExpired = {
  name: 'Carolina Maronese',
  email: 'carolina@teste.com',
  password: '1234teste',
  isAdm: false,
  paymentMethods: {
    name: 'Carolina F Maronese',
    cpf: '12345678900',
    number: '1111222233334444',
    dueDate: '2021-10-21',
    code: '123',
  },
};

export const mockedPayment = {
  name: 'Carolina Maronese',
  email: 'carolina@teste.com',
  password: '1234teste',
  isAdm: false,
};

export const mockedDeletion = {
  name: 'João Silva',
  email: 'js@teste.com',
  password: '1234teste',
  isAdm: false,
  paymentMethods: {
    name: 'Joao M Silva',
    cpf: '12345678900',
    number: '1111222233334444',
    dueDate: '2026-10-21',
    code: '123',
  },
};
