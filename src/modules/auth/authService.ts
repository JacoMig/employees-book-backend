import {
    ForbiddenError,
    InternalServerError,
    NotFoundError,
} from '../../common/errors'
import { IAuthRepository } from './authRepository'
import bcrypt from 'bcrypt'

const authService = (AuthRepository: IAuthRepository) => {
    
    const register = async (
        username: string,
        email: string,
        password: string
    ) => {
        if (!email || !password)
            throw new ForbiddenError('email or password missing')

        let user = await AuthRepository.findOne(email)
        
        if (user.email) throw new ForbiddenError('user already exists')

        try {
            await AuthRepository.create(
                username,
                email,
                password
            )
        } catch (e) {
            console.log(e)
            throw new InternalServerError(e as string)
        }

        console.log('Send Successfully!!!')
    }

    const login = async (usernameOrEmail: string, password: string) => {
        if (!usernameOrEmail || !password) {
            throw new ForbiddenError('username or password missing')
        }

        let user = await AuthRepository.findOne(usernameOrEmail)

        if (!user) {
            throw new NotFoundError('user does not exists!')
        }

        const bcryptPromise = new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, function (err, result) {
                if (err) {
                    reject(err.message)
                }

                if (!result) reject('username or password is wrong')

                resolve('username logged in')
            })
        })

        try {
            await bcryptPromise
        } catch (e) {
            throw new ForbiddenError(e as string)
        }

        return {
            loggedIn: true,
        }
    }

    return {
        register,
        login,
    }
}

export function createAuthService(AuthRepository: IAuthRepository) {
    return authService(AuthRepository)
}
