import { BadRequestError, ForbiddenError, InternalServerError } from "../../common/errors"
import { UserDocument } from "../../routes/dtos"
import { IUser, UserGroup, UserType } from "../../userSchema"
import { IUserRepository } from "./userRepository"

export type ListCommand = {
    username?: string
}

const userService = (UserRepository:IUserRepository) => {
    
    const list = async (command: ListCommand) => {
        const filter = {
            username: command.username
        }
        const users = await UserRepository.list(filter) 
        return mapMany(users)
    }

    const create = async (
        username: string,
        email: string,
        password: string,
        userGroup: UserGroup
    ) => {
        if (!email || !password)
            throw new BadRequestError('email or password missing')

        let user = await UserRepository.findOne(email)
        
        if (user) throw new ForbiddenError('user already exists')
        
        let newUser:Partial<UserDocument> | null = null   
        try {
            newUser = await UserRepository.create(
                username,
                email,
                password,
                userGroup
            )
        } catch (e) {
            throw new InternalServerError(e as string)
        }

        
        return mapOne(newUser)
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


const mapOne = (user:Partial<UserDocument>) => {
    return {
        username: user.username,
        userGroup: user.userGroup,
        email: user.email,
        id: user.id,
    }
}

const mapMany = (users:Partial<UserDocument>[]) => {
    return users.map(u => mapOne(u))
}

export const createUserService = (UserRepository:IUserRepository) => {
    return userService(UserRepository)
}