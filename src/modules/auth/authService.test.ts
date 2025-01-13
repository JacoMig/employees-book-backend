import { FastifyInstance } from 'fastify'
import { createAuthService } from './authService'
import { IAuthRepository } from './authRepository'
import bcrypt from 'bcrypt'
// import jwt from 'jsonwebtoken'
import { ForbiddenError, NotFoundError, UnauthorizedError, InternalServerError } from '../../common/errors'

import { CreateUserDto } from '../user/userService'
import { UserDocument } from '../../routes/dtos'



jest.mock('bcrypt')


describe('authService', () => {
    let server: FastifyInstance
    let AuthRepository: IAuthRepository
    let createUser: jest.MockedFunction<() => Promise<CreateUserDto>>
    let authService: ReturnType<typeof createAuthService>
   
    beforeEach(() => {
        server = {
            jwt: {
                sign: jest.fn(
                    (payload: any, options
                    ) => 'token'
                ),
                verify: jest.fn()
            },
            log: {
                error: jest.fn(),
                info: jest.fn()
            }
        } as unknown as FastifyInstance

        AuthRepository = {
            findOne: jest.fn()
        } as unknown as IAuthRepository

        createUser = jest.fn()

        authService = createAuthService(server, AuthRepository, createUser)

        
    })

    describe('login', () => {
        it('should throw NotFoundError if user does not exist', async () => {
            (AuthRepository.findOne as jest.Mock).mockResolvedValue(null)

            await expect(authService.login('username', 'password')).rejects.toThrow(NotFoundError)
        })

        it('should throw ForbiddenError if password is incorrect', async () => {
            const user = { username: 'username', password: 'hashedPassword' } as UserDocument
            (AuthRepository.findOne as jest.Mock).mockResolvedValue(user);
            (bcrypt.compare as jest.Mock).mockImplementation((password:string, hash:string, callback:(t:Error|undefined,b:boolean) => void) => callback(new Error('ERR'), false))
           
            await expect(authService.login('username', 'password')).rejects.toThrow(ForbiddenError)
        })

        it('should return token if login is successful', async () => {
            const user = { username: 'username', password: 'hashedPassword', email: 'email', userGroup: 'customer', id: 'id' } as UserDocument
            (AuthRepository.findOne as jest.Mock).mockResolvedValue(user);
            (bcrypt.compare as jest.Mock).mockImplementation((password:string, hash:string, callback:(t:Error|undefined,b:boolean) => void) => callback(undefined, true));
            (server.jwt.sign as jest.Mock).mockImplementationOnce(() => 'token')

            const result = await authService.login('username', 'password')

            expect(result).toEqual({ token: 'token' })
        })
    })

    describe('authenticate', () => {
        it('should throw UnauthorizedError if token is missing', async () => {
            const request = { headers: {} } as any

            await expect(authService.authenticate([])(request)).rejects.toThrow(UnauthorizedError)
        })

        it('should throw UnauthorizedError if user is not authorized', async () => {
            const request = { headers: { authorization: 'Bearer token' } } as any
            (server.jwt.verify as jest.Mock).mockImplementation((token, options, callback) => callback(null, { payload: { userGroup: 'user' } }))

            await expect(authService.authenticate(['admin'])(request)).rejects.toThrow(UnauthorizedError)
        })

        it('should set request.authUser if user is authorized', async () => {
            const request = { headers: { authorization: 'Bearer token' } } as any
            const payload = { userGroup: 'admin', id: 'id', username: 'username' } as any
            (server.jwt.verify as jest.Mock).mockImplementation((token, options, callback) => callback(null, { payload }))

            await authService.authenticate(['admin'])(request)

            expect(request.authUser).toEqual(payload)
        })
    })

    describe('register', () => {
        it('should throw InternalServerError if user creation fails', async () => {
            createUser.mockRejectedValue(new Error('creation error'))

            await expect(authService.register({ username: 'username', email: 'email', password: 'password' })).rejects.toThrow(InternalServerError)
        })

        it('should return user and token if registration is successful', async () => {
            const user = { id: 'id', username: 'username', email: 'email', userGroup: 'superadmin' } as CreateUserDto
            createUser.mockResolvedValue(user)
         
            const result = await authService.register({ username: 'username', email: 'email', password: 'password' })

            expect(result).toEqual({ ...user, token: 'token' })
        })
    })
})