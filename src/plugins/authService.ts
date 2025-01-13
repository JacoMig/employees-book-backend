import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import authRepository from '../modules/auth/authRepository'
import { createAuthService, CreateUserParams } from '../modules/auth/authService'
import { FastifyAuthFunction } from '@fastify/auth'
import { UserGroup } from '../userSchema'
import { AuthUser } from '../common/dtos'
import userRepository from '../modules/user/userRepository'
import companyRepository from '../modules/user/companyRepository'
import { createS3Lib } from '../libs/s3'
import { createUserService } from '../modules/user/userService'

export interface IAuthService {
    login: (usernameOrEmail: string, password: string) =>  Promise<{token: string}> 
    authenticate: (userGroup: UserGroup[]) => FastifyAuthFunction,
    register: (params:CreateUserParams) =>  Promise<{token: string}> 
}

declare module 'fastify' {
    interface FastifyInstance {
        authService: IAuthService
    }
    interface FastifyRequest {
        authUser: AuthUser
    }
}

const authService: FastifyPluginAsync = async (server) => {
    const AuthRepository = authRepository()
    const UserRepository = userRepository()
    const CompanyRepository = companyRepository()
    const S3Lib = createS3Lib()
    const UserService = createUserService(UserRepository, CompanyRepository, S3Lib)  
    const createUser = UserService.create
    const service = createAuthService(server, AuthRepository, createUser)
    server.decorate('authService', service).register(import('@fastify/auth'))
    
}

export default fp(authService)
