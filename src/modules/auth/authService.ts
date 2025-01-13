import { FastifyInstance, FastifyRequest } from 'fastify'
import {
    ForbiddenError,
    InternalServerError,
    NotFoundError,
    UnauthorizedError,
} from '../../common/errors'
import { IAuthRepository } from './authRepository'
import bcrypt from 'bcrypt'
import { UserGroup } from '../../userSchema'
import { CreateUserDto } from '../user/userService'

export type CreateUserParams = {
    username: string,
    email: string,
    password: string,
    userGroup?: UserGroup
}

type CreateUser = (
    username: string,
    email: string,
    password: string,
    userGroup?: UserGroup
) => Promise<CreateUserDto>

const authService = (
    server: FastifyInstance,
    AuthRepository: IAuthRepository,
    createUser: CreateUser
) => {
    const login = async (usernameOrEmail: string, password: string) => {
        const user = await AuthRepository.findOne(usernameOrEmail)

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
            id: user.id,
        }
        const token = server.jwt.sign({ payload, expiresIn: '1h' })

        return {
            token,
        }
    }

    const authenticate =
        (userGroups: UserGroup[]) => async (request: FastifyRequest) => {
            const Bearer = request.headers.authorization
            const token = Bearer?.split('Bearer ')[1]
            if (!token)
                throw new UnauthorizedError('Token missing in Auth headers')

            server.jwt.verify(token, { maxAge: '1h' }, (err, decoded) => {
                if (err) server.log.error(err)
                server.log.info(`Token verified!`)
                const payload = decoded.payload
                if (
                    userGroups.length &&
                    !userGroups.includes(payload.userGroup)
                ) {
                    throw new UnauthorizedError(
                        'User is not authorized to perform this action'
                    )
                }
                request.authUser = {
                    userGroup: payload.userGroup,
                    id: payload.id,
                    username: payload.username,
                }
            })

            
        }

        const register = async (params:CreateUserParams):Promise<CreateUserDto & {token: string}> => {
            const {username,email, password} = params
            let user:CreateUserDto | undefined = undefined
            try {
                user = await createUser(
                    username,
                    email,
                    password,
                    'superadmin'
                )
            } catch(err) {
                console.log('createUser Error!!!!!!!!!!!!');
                console.log(err);
            }
            
            if (!user || !user.id) {
                throw new InternalServerError('User creation failed')
            }

            const payload = {
                username: username,
                email: email,
                userGroup: 'superadmin',
                id: user.id,
            }
            const token = server.jwt.sign({ payload, expiresIn: '1h' })

            return {
                ...user,
                token
            }

        }

    return {
        login,
        authenticate,
        register
    }
}

export function createAuthService(
    server: FastifyInstance,
    AuthRepository: IAuthRepository,
    createUser: CreateUser
) {
    return authService(server, AuthRepository, createUser)
}
