import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import authRepository from '../modules/auth/authRepository'
import { createAuthService } from '../modules/auth/authService'

export interface IAuthService {
    register: (username: string, email: string, password: string) => void
    login: (usernameOrEmail: string, password: string) => Promise<{loggedIn: boolean}>
}

declare module 'fastify' {
    interface FastifyInstance {
        authService: IAuthService
    }
}

const authService: FastifyPluginAsync = async (server) => {
    const AuthRepository = authRepository()

    const service = createAuthService(AuthRepository)

    server.decorate('authService', service)
}

export default fp(authService)
