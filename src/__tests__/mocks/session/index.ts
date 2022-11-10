export const createUserAdm = {
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

export const userAdmLogin = {
  email: 'francisco@mail.com',
  password: 'Teste123@',
};

export const userAdm = {
  email: 'francisco@teste.com',
  password: '1234teste',
};

export const userNotAdm = {
  email: 'carolina@teste.com',
  password: '1234teste',
};

export const userAdmLoginIncorrectMail = {
  email: 'emailErrado@mail.com',
  password: 'Teste123@',
};

export const userAdmLoginIncorrectPassword = {
  email: 'emailErrado@mail.com',
  password: 'Teste123@',
};
