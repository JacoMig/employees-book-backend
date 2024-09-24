import { IUser, UserGroup, UserModel, UserType } from '../../userSchema'
import { UserDocument } from '../../routes/dtos'
import { RootFilterQuery } from 'mongoose'

type ListFilter = {
    username?: string
}

export interface IUserRepository {
    list: (filter: ListFilter) => Promise<UserDocument[]>
    findOne: (usernameOrEmail: string) => Promise<UserDocument | null>
    create: (
        username: string,
        email: string,
        password: string,
        userGroup: UserGroup
    ) => Promise<UserType>
    delete: (id: string) => Promise<void>
}

function userRepository(): IUserRepository {
    const list = async (query: ListFilter) => {
       
        let filter: RootFilterQuery<IUser> = {}
        if (query.username) {
            const re = new RegExp(query.username, "i");
            filter = {
                ...filter,
                username: {
                    $regex: re
                },
            }
        }
        
        return await UserModel.find(filter)
    }

    const findOne = async (usernameOrEmail: string) => {
        return await UserModel.findOne({
            $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
        })
    }

    const create = async (
        username: string,
        email: string,
        password: string,
        userGroup: UserGroup
    ) => {
        return await new UserModel({
            username,
            email,
            password,
            userGroup
        }).save()
    }

    const remove = async (id: string) => {
        await UserModel.deleteOne({ _id: id })
    }

    return {
        list,
        findOne,
        create,
        delete: remove,
    }
}

export default userRepository
