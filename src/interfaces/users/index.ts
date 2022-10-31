import * as core from 'express-serve-static-core';
import { Request, Response } from 'express';

export type IUserRequest = Request<
  core.ParamsDictionary,
  IUserResponseBody,
  IUserRequestBody
>;
export type IUserResponse = Response<IUserResponseBody>;
export type IUserList = Response<IUserResponseBody[]>;

export interface IPaymentInfo {
  name: string;
  cpf: string;
  number: string;
  dueDate: string;
  code: string;
}

export interface IPaymentInfoRes {
  id: string;
  name: string;
  cpf: string;
  number: string;
  dueDate: string;
  code: string;
}

export interface IUserRequestBody {
  name: string;
  email: string;
  password: string;
  isAdm: boolean;
  paymentInfo: IPaymentInfo;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUserUpdateBody {
  name?: string;
  email?: string;
  password?: string;
  paymentInfo?: IPaymentInfo;
}

export interface IUserResponseBody {
  name: string;
  email: string;
  isAdm: boolean;
  id: string;
  paymentInfo: 
  createdAt: Date;
  updatedAt: Date;
}
