import {  UserModel, UserType } from '../../userSchema'
import { UserDocument } from '../../routes/dtos'

export interface IAuthRepository {
    findOne: (usernameOrEmail: string) => Promise<UserDocument | null>
    create: (username: string, email: string, password: string) => Promise<UserType>
}

function authRepository(): IAuthRepository {

    const findOne = async (usernameOrEmail: string) => {
        
        return await UserModel.findOne({
            $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
        })
        
    }

    const create = async (
        username: string,
        email: string,
        password: string
    ) => {
        return await new UserModel({
            username,
            email,
            password,
        }).save()
    }

    return {
        findOne,
        create,
    }
}

export default authRepository
