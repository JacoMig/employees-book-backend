import { FastifyInstance, FastifyRequest } from 'fastify'
import {
    BadRequestError,
    ForbiddenError,
    InternalServerError,
    NotFoundError,
    UnauthorizedError,
} from '../../common/errors'
import { IAuthRepository } from './authRepository'
import bcrypt from 'bcrypt'
import { UserGroup } from '../../userSchema'


const authService = (server:FastifyInstance, AuthRepository: IAuthRepository) =>  {
   
   const login =  async (usernameOrEmail: string, password: string) => {
       
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
        const payload = {
            username: user.username,
            email: user.email,
            userGroup: user.userGroup,
            id: user.id
        }
        const token = server.jwt.sign({ payload, expiresIn: 60 })

        return {
            token
        }
    }

    const authenticate = (userGroups:UserGroup[]) => async (request:FastifyRequest) => {
        
        const Bearer = request.headers.authorization
        const token = Bearer?.split('Bearer ')[1]
        let userGroup = null
        server.jwt.verify(token!, {maxAge: 60},(err, decoded) => {
            if (err) server.log.error(err)
            server.log.info(`Token verified. Token is ${decoded}`)
            userGroup = decoded.userGroup
            if(userGroups.length && !userGroups.includes(userGroup)) 
                throw new UnauthorizedError('User is not authorized to perform this action')
        })
        
    }

    return {
        login,
        authenticate,
       
    }
}

export function createAuthService(server:FastifyInstance, AuthRepository: IAuthRepository) {
    return authService(server, AuthRepository)
}
