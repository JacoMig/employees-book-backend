import { AuthUser } from "../../common/dtos"
import { BadRequestError, ForbiddenError, InternalServerError, NotFoundError, UnauthorizedError } from "../../common/errors"
import {  IS3Library } from "../../libs/s3"
import { UserDocument } from "../../routes/dtos"
import {  UserGroup } from "../../userSchema"
import { IUserRepository } from "./userRepository"

export type ListCommand = {
    username?: string,
    limit?: number,
    offset?: number
}

export type UpdateCommand = {
    firstName?: string,
    lastName?: string,
    jobTitle?: string,
    email?: string,
    username?: string
    hiringDate?: string
    // profileImage?: string
}


export type CreateUserDto = {
    id: string,
    email: string,
    username: string
    userGroup?: UserGroup,
    firstName?: string,
    lastName?: string,
    jobTitle?: string,
    cvUrl?: string,
    createdAt?: string,
    hiringDate?: string,
    profileImage?: string
}


export type ListResponse = {
    pagination: {
        pages: number,
        currentPage: number,
        offset: number,
        total: number
    },
    users: Partial<UserDocument>[]
}


const userService = (UserRepository:IUserRepository, S3Lib: IS3Library) => {
    
    const get = async (id:string) => {
        const user = await UserRepository.findOneById(id) 
        if(!user)
            throw new NotFoundError('user not found')
        
        return mapOne(user)
    }

    const list = async (command: ListCommand):Promise<ListResponse> => {
        const filter = {
            username: command.username,
            limit: command.limit || 100,
            offset: command.offset || 0
        }
        const aggregateUsers = await UserRepository.list(filter) 
       
        const totalUsers = aggregateUsers[0].metadata[0]?.totalCount 
        const pages =  Math.ceil(totalUsers / filter.limit) 
      
        return {
            users: mapMany(aggregateUsers[0].data),
            pagination: {
                total: totalUsers,
                pages,
                offset: filter.offset,
                currentPage: (filter.offset + 1)
            }
        }
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
                new Date().toISOString(),
                email,
                password,
                userGroup,
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


const mapOne = (user:UserDocument):CreateUserDto => {
    
    return {
        username: user.username!,
        userGroup: user.userGroup,
        email: user.email!,
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        jobTitle: user.jobTitle,
        cvUrl: user.cvUrl,
        createdAt: user.createdAt || undefined,
        hiringDate: user.hiringDate,
        profileImage: user.profileImage || undefined
    }
}

const mapMany = (users:UserDocument[]) => {
    return users.map(u => mapOne(u))
}

export const createUserService = (UserRepository:IUserRepository, S3Lib: IS3Library) => {
    return userService(UserRepository, S3Lib)
}