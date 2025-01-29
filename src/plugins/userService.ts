import { FastifyPluginAsync } from 'fastify'
import userRepository from '../modules/user/userRepository'
import {
    CreateUserDto,
    createUserService,
    ListCommand,
    ListResponse,
    UpdateCommand,
} from '../modules/user/userService'
import fp from 'fastify-plugin'
import { UserDocument } from '../routes/dtos'
import { IUser, UserGroup } from '../userSchema'
import { AuthUser } from '../common/dtos'
import { createS3Lib } from '../libs/s3'
import companyRepository from '../modules/user/companyRepository'
import envVariablesLib from '../libs/envVariables'


export interface IUserService {
    get: (id: string) => Promise<Partial<UserDocument>>
    list: (command: ListCommand) => Promise<ListResponse>
    create: (
        username: string,
        email: string,
        password: string,
        userGroup?: UserGroup
    ) => Promise<CreateUserDto>
    createMany: (users:IUser[]) => Promise<{added: number}>
    delete: (userId: string) => Promise<object>
    update: (
        id: string,
        params: UpdateCommand,
        authUser: AuthUser
    ) => Promise<object>
}

declare module 'fastify' {
    interface FastifyInstance {
        userService: IUserService
    }
}

const userService: FastifyPluginAsync = async (server) => {
    const UserRepository = userRepository()
    const CompanyRepository = companyRepository()
    const S3Lib = createS3Lib()
    const envVarsLibs = await envVariablesLib()
    const s3Bucket = await envVarsLibs.S3_BUCKET
    const service = createUserService(UserRepository, CompanyRepository, S3Lib, s3Bucket)

    server.decorate('userService', service)
}

export default fp(userService)
