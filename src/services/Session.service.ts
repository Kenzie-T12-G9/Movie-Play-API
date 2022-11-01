import AppDataSource from "../data-source";
import { Users } from "../entities/Users.entity";
import { AppError } from "../error/AppError";
import { IUserLoginBody } from "../interfaces/users";
import { compare } from "bcryptjs"

export default class SessionService {
  static repository = AppDataSource.getRepository(Users)

  static async init( { email, password }: IUserLoginBody) {
    
    const user = await this.repository.findOneBy({email})

    if(!user){
      throw new AppError("Email/password is wong", 401)
    }

    if( !await compare(password, user.password) ){
      throw new AppError("Email/password is wong", 401)
    }
    
    return user
  }
}
