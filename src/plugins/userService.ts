import { FastifyPluginAsync } from 'fastify'
import userRepository, { IUserRepository } from '../modules/user/userRepository'
import {
    CreateUserDto,
    createUserService,
    ListCommand,
    UpdateCommand,
} from '../modules/user/userService'
import fp from 'fastify-plugin'
import { UserDocument } from '../routes/dtos'
import { UserGroup, UserType } from '../userSchema'
import { AuthUser } from '../common/dtos'

export interface IUserService {
    get: (id: string) => Promise<Partial<UserDocument>>
    list: (command: ListCommand) => Promise<Partial<UserDocument>[]>
    create: (
        username: string,
        email: string,
        password: string,
        userGroup?: UserGroup
    ) => Promise<CreateUserDto>
    delete: (userId: string) => Promise<{}>
    update: (
        id: string,
        params: UpdateCommand,
        authUser: AuthUser
    ) => Promise<{}>
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
