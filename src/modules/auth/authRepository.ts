import {  IUser, UserModel, UserType } from '../../userSchema'
import { UserDocument } from '../../routes/dtos'

export interface IAuthRepository {
    findOne: (usernameOrEmail: string) => Promise<UserDocument | null>
    
}

function authRepository(): IAuthRepository {

    const findOne = async (usernameOrEmail: string) => {
        
        return await UserModel.findOne({
            $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
        })
        
    }

 
    return {
        findOne,
 
    }
}

export default authRepository
