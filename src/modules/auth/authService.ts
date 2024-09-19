import {
    BadRequestError,
    ForbiddenError,
    InternalServerError,
    NotFoundError,
} from '../../common/errors'
import { IAuthRepository } from './authRepository'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const authService = (AuthRepository: IAuthRepository) => {
    
   
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

        const token = jwt.sign({
            data: user
          }, user.email, { expiresIn: 60 * 60 });

        return {
            token
        }
    }

    return {
        login,
    }
}

export function createAuthService(AuthRepository: IAuthRepository) {
    return authService(AuthRepository)
}
