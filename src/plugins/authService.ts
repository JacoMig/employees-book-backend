import { FastifyInstance, FastifyPluginAsync, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'
import authRepository from '../modules/auth/authRepository'
import { createAuthService } from '../modules/auth/authService'
import { FastifyAuthFunction } from '@fastify/auth'
import { UserGroup } from '../userSchema'

export interface IAuthService {
    login: (usernameOrEmail: string, password: string) =>  Promise<{token: string}> 
    authenticate: (userGroup: UserGroup[]) => FastifyAuthFunction,
}

declare module 'fastify' {
    interface FastifyInstance {
        authService: IAuthService
    }
}

const authService: FastifyPluginAsync = async (server) => {
    const AuthRepository = authRepository()
        
    const service = createAuthService(server, AuthRepository)
    server.decorate('authService', service).register(import('@fastify/auth'))
    
}

export default fp(authService)
