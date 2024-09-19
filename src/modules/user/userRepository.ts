import { UserModel, UserType } from '../../userSchema'
import { UserDocument } from '../../routes/dtos'

export interface IUserRepository {
    list: () => Promise<UserDocument[] | null>,
    findOne: (usernameOrEmail: string) => Promise<UserDocument | null>
    create: (username: string, email: string, password: string) => Promise<UserType>
    delete: (id: string) => Promise<void>
}

function userRepository(): IUserRepository {

    const list = async () => {
        return await UserModel.find()
    }


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

    const remove = async (id:string) => {
        await UserModel.deleteOne({_id: id})
    }

    return {
        list,
        findOne,
        create,
        delete: remove
    }
}

export default userRepository
