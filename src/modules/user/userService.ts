import { AuthUser } from "../../common/dtos"
import { BadRequestError, ForbiddenError, InternalServerError, NotFoundError, UnauthorizedError } from "../../common/errors"
import { createS3Lib, IS3Library } from "../../libs/s3"
import { UserDocument } from "../../routes/dtos"
import { IUser, UserGroup, UserType } from "../../userSchema"
import { IUserRepository } from "./userRepository"
import S3 from 'aws-sdk/clients/s3'

export type ListCommand = {
    username?: string
}

export type UpdateCommand = {
    firstName?: string,
    lastName?: string,
    jobTitle?: string,
    email?: string,
    username?: string
}


export type CreateUserDto = {
    id: string,
    email: string,
    username: string
    userGroup?: UserGroup,
    firstName?: string,
    lastName?: string,
    jobTitle?: string,
    cvUrl?: string
}



const userService = (UserRepository:IUserRepository, S3Lib: IS3Library) => {
    
    const get = async (id:string) => {
        const user = await UserRepository.findOneById(id) 
        if(!user)
            throw new NotFoundError('user not found')

        return mapOne(user)
    }

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
        userGroup?: UserGroup
    ) => {
        if (!email || !password)
            throw new BadRequestError('email or password missing')

        let user = await UserRepository.findOne(email)
        
        if (user) throw new ForbiddenError('user with the same email already exists')
        
        
        try {
            
            return mapOne(await UserRepository.create(
                username,
                email,
                password,
                userGroup
            ))
            
        } catch (e) {
            throw new InternalServerError(e as string)
        }

    }

    const update = async (id: string, command:UpdateCommand, authUser: AuthUser) => {
        if(authUser.id !== id)
            throw new UnauthorizedError('you are trying to update a user that is not you') 

        try {
            await UserRepository.update(id, command)
        } catch (e) {
            throw new InternalServerError(e as string)
        }
        return {}
       
    }

    const remove = async (id:string) => {
        try {
            await UserRepository.delete(id)

            // delete user object from s3
            await S3Lib.deleteObject({
                Key: id,
                Bucket: process.env.S3_BUCKET!,
            }) 

        } catch(e) {
            throw new InternalServerError(e as string)
        }
        
        return {}
    }

    return {
        get,
        list,
        create,
        update,
        delete: remove
    }
}


const mapOne = (user:Partial<UserDocument>):CreateUserDto => {
    return {
        username: user.username!,
        userGroup: user.userGroup,
        email: user.email!,
        id: user.id as string,
        firstName: user.firstName,
        lastName: user.lastName,
        jobTitle: user.jobTitle,
        cvUrl: user.cvUrl
    }
}

const mapMany = (users:Partial<UserDocument>[]) => {
    return users.map(u => mapOne(u))
}

export const createUserService = (UserRepository:IUserRepository, S3Lib: IS3Library) => {
    return userService(UserRepository, S3Lib)
}