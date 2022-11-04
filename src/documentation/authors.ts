import { Request, Response } from 'express';

export const authorsPage = (_: Request, res: Response) => {
  const authors = [
    { name: 'Alexandre Borges', email: 'axdborges@outlook.com', gitHub: 'https://github.com/axdborges' },
    { name: 'Francisco Stenico', email: 'francisco.stenico@gmail.com', gitHub: 'https://github.com/FranciscoStenico' },
    { name: 'Guilherme Bernardo', email: 'guilhermebernardo@id.uff.br', gitHub: 'https://github.com/guilhermebernar' },
    { name: 'Kelven Souza', email: 'kelven.souza00@gmail.com', gitHub: "https://github.com/SimksS" },
    { name: 'Myke Macedo', email: 'myke.programacao@gmail.com', gitHub: 'https://github.com/myke-vida-de-macedo' },
    { name: 'Queren Hope', email: 'querenhope@hotmail.com', gitHub: 'https://github.com/QuerenHope' },
  ];
  return res.status(200).send(authors);
};
