import { IUser, UserGroup, UserModel, UserType } from '../../userSchema'
import { UserDocument } from '../../routes/dtos'
import { RootFilterQuery } from 'mongoose'

type ListFilter = {
    username?: string
}

type UpdateParams = {
    firstName?: string,
    lastName?: string,
    jobTitle?: string,
    email?: string,
    username?: string
}

export interface IUserRepository {
    list: (filter: ListFilter) => Promise<UserDocument[]>
    findOne: (usernameOrEmail: string) => Promise<UserDocument | null>
    create: (
        username: string,
        email: string,
        password: string,
        userGroup?: UserGroup
    ) => Promise<IUser>
    update: (id: string, params: UpdateParams) => Promise<UserDocument | null>
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
        userGroup?: UserGroup
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

    const update = async (id: string, params: UpdateParams) => {
        return await UserModel.findOneAndUpdate({_id: id}, params, {new: true})
    }

    return {
        list,
        findOne,
        create,
        update,
        delete: remove,
    }
}

export default userRepository
