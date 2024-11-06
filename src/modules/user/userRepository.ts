import { IUser,  UserModel } from '../../userSchema'
import { UserDocument } from '../../routes/dtos'
import {  RootFilterQuery } from 'mongoose'

type ListFilter = {
    companyId: string
    limit: number
    offset: number
    username?: string
}

type UpdateParams = {
    firstName?: string
    lastName?: string
    jobTitle?: string
    email?: string
    username?: string
    hiringDate?: string
    profileImage?: string
    companyId?: string
    companyName?: string
}

type AggregateUsersResponse = {
    metadata: { totalCount: number }[]
    data: UserDocument[]
}

export interface IUserRepository {
    findOneById: (id: string) => Promise<UserDocument | null>
    list: (filter: ListFilter) => Promise<AggregateUsersResponse[]>
    findOne: (usernameOrEmail: string) => Promise<UserDocument | null>
    create: (
        user:Partial<IUser>
    ) => Promise<UserDocument>
    createMany: (
        users: IUser[]
    ) => Promise<UserDocument[]>
    update: (id: string, params: UpdateParams) => Promise<UserDocument | null>
    delete: (id: string) => Promise<void>
}

function userRepository(): IUserRepository {
   
    const findOneById = async (id: string) => {
        return await UserModel.findOne({
            _id: id,
        })
    }
    const list = async (
        query: ListFilter
    ): Promise<AggregateUsersResponse[]> => {
        let filter: RootFilterQuery<IUser> = {
            companyId: query.companyId
        }
        if (query.username) {
            const re = new RegExp(query.username, 'i')
            filter = {
                ...filter,
                username: {
                    $regex: re,
                },
            }
        }

        const skip = query.offset * query.limit

        return await UserModel.aggregate([
            {
                $match: filter
            },
            {
                $facet: {
                    metadata: [{ $count: 'totalCount' }],
                    data: [{ $skip: skip }, { $limit: query.limit }],
                },
            },
        ])
    }

    const findOne = async (usernameOrEmail: string) => {
        return await UserModel.findOne({
            $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
        })
    }

    const create = async (
        user:Partial<IUser>
    ) => {
        return await new UserModel({
           ...user
        }).save()
    }

    const createMany = async (
        users:IUser[]
    ) => {
        return await UserModel.insertMany(users)
    }

    const remove = async (id: string) => {
        await UserModel.deleteOne({ _id: id })
    }

    const update = async (id: string, params: UpdateParams) => {
        return await UserModel.findOneAndUpdate({ _id: id }, params, {
            new: true,
        })
    }

    return {
        findOneById,
        list,
        findOne,
        create,
        createMany,
        update,
        delete: remove,
    }
}

export default userRepository
