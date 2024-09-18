import { UserModel, UserType } from '../../userSchema'

export interface IAuthRepository {
    findOne: (usernameOrEmail: string) => Promise<UserType> 
    create: (username: string, email: string, password: string) => Promise<UserType>
}

function authRepository(): IAuthRepository {

    const findOne = async (usernameOrEmail: string) => {
        
        const n = await UserModel.findOne({
            $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
        })
        
       
        return {
            username: n?.username!,
            email: n?.email!,
            password: n?.password!
        } 
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
