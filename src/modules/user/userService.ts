import { BadRequestError, ForbiddenError, InternalServerError } from "../../common/errors"
import { UserType } from "../../userSchema"
import { IUserRepository } from "./userRepository"

const userService = (UserRepository:IUserRepository) => {
    
    const list = async () => {
        return UserRepository.list() 
    }

    const create = async (
        username: string,
        email: string,
        password: string
    ) => {
        if (!email || !password)
            throw new BadRequestError('email or password missing')

        let user = await UserRepository.findOne(email)
        
        if (user) throw new ForbiddenError('user already exists')
        
        let newUser:UserType    
        try {
            newUser = await UserRepository.create(
                username,
                email,
                password
            )
        } catch (e) {
            throw new InternalServerError(e as string)
        }

        
        return newUser
    }

    const remove = async (id:string) => {
        try {
             await UserRepository.delete(id)
        } catch(e) {
            throw new InternalServerError(e as string)
        }
    }

    return {
        list,
        create,
        delete: remove
    }
}

export const createUserService = (UserRepository:IUserRepository) => {
    return userService(UserRepository)
}