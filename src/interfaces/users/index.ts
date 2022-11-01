import * as core from 'express-serve-static-core';
import { Request, Response } from 'express';

export type IUserRequest = Request<
  core.ParamsDictionary,
  IUserResponseBody,
  IUserRequestBody
>;
export type IUserResponse = Response<IUserResponseBody>;
export type IUserList = Response<IUserResponseBody[]>;

export interface IUserRequestBody {
  name?: string;
  email?: string;
  password?: string;
  isAdm?: boolean;
}

export interface IUserResponseBody {
  name: string;
  email: string;
  isAdm: boolean;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: true;
}
