import { FastifyPluginAsync } from 'fastify'
import userRepository, { IUserRepository } from '../modules/user/userRepository'
import { createUserService } from '../modules/user/userService'
import fp from 'fastify-plugin'
import { UserDocument } from '../routes/dtos'
import { UserType } from '../userSchema'

export interface IUserService {
    list: () => Promise<UserDocument[] | null>,
    create: (
        username: string,
        email: string,
        password: string
    ) => Promise<UserType | null>
    delete: (
        userId: string
    ) => Promise<void>
}

declare module 'fastify' {
    interface FastifyInstance {
        userService: IUserService
    }
}

const userService: FastifyPluginAsync = async (server) => {
    const UserRepository = userRepository()
    const service = createUserService(UserRepository)

    server.decorate('userService', service)
}

export default fp(userService)
