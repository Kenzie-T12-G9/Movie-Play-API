import * as core from 'express-serve-static-core';
import { Request, Response } from 'express';

export type IUserRequest = Request<
  core.ParamsDictionary,
  IUserResponseBody,
  IUserRequestBody
>;

export type IUserUpdate = Request<
  core.ParamsDictionary,
  IUserResponseBody,
  IUserUpdateBody
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
  id?:string;
  name: string;
  email: string;
  password: string;
  isAdm: boolean;
  paymentInfo: IPaymentInfo;
}

export interface IUserLoginBody {
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
  paymentInfo: IPaymentInfoRes;
  createdAt: Date;
  updatedAt: Date;
}
