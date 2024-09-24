import { FastifyPluginAsync } from 'fastify'
import userRepository, { IUserRepository } from '../modules/user/userRepository'
import { createUserService, ListCommand } from '../modules/user/userService'
import fp from 'fastify-plugin'
import { UserDocument } from '../routes/dtos'
import { UserGroup, UserType } from '../userSchema'

export interface IUserService {
    list: (command:ListCommand) => Promise<Partial<UserDocument>[]>,
    create: (
        username: string,
        email: string,
        password: string,
        userGroup: UserGroup
    ) => Promise<Partial<UserDocument> | null>
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
