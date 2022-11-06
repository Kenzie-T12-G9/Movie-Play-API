import * as core from 'express-serve-static-core';
import { Request, Response } from 'express';
import { Users } from '../../entities/Users.entity';

export type IUserRequest = Request<null, Users, IUserRequestBody>;

export type IUserResponse = Response<Users | any>;
export type IUserList = Response<IUserResponseBody[]>;
export type IUserUpdate = Request<IUserParams, Users, IUserUpdateBody>;
export type IUserDelete = Request<IUserParams>;

interface IUserParams extends core.ParamsDictionary {
  id: string;
}

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
  isActive?: boolean;
  paymentMethods: IPaymentInfo;
}

export interface IUserUpdateRequest {
  name?: string;
  email?: string;
  password?: string;
  isActive?: boolean;
  paymentMethods?: IPaymentInfo;
}

export interface IUserLoginBody {
  email: string;
  password: string;
}

export interface IUserUpdateBody {
  name?: string;
  email?: string;
  password?: string;
  paymentMethods?: IPaymentInfo;
}

export interface IUserResponseBody {
  name: string;
  email: string;
  isAdm: boolean;
  id: string;
  isActive?: boolean;
  paymentMethods: IPaymentInfoRes;
  createdAt: Date;
  updatedAt: Date;
}
