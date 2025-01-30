import { createUserService } from './userService'
import { IUserRepository } from './userRepository'
import { ICompanyRepository } from './companyRepository'
import { IS3Library } from '../../libs/s3'
import { NotFoundError, BadRequestError, ForbiddenError, InternalServerError, UnauthorizedError } from '../../common/errors'
import { CompanyDocument, UserDocument } from '../../routes/dtos'
import { AuthUser } from '../../common/dtos'
import { IUser, UserGroup } from '../../userSchema'
import { ObjectId } from 'mongodb'

const mockUserRepository: jest.Mocked<IUserRepository> = {
    findOneById: jest.fn(),
    list: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createMany: jest.fn(),
}

const mockCompanyRepository: jest.Mocked<ICompanyRepository> = {
    create: jest.fn(),
}

const mockS3Lib: jest.Mocked<IS3Library> = {
    deleteObject: jest.fn(),
    uploadObject: jest.fn()
}
const s3Bucket = "my-bucket"
const userService = createUserService(mockUserRepository, mockCompanyRepository, mockS3Lib, s3Bucket)

describe('UserService', () => {
    describe('get', () => {
        it('should return user data when user is found', async () => {
            
            const user = {
                _id: new ObjectId(),
                id: '1',
                username: 'testuser',
                email: 'test@example.com',
                createdAt: '2023-01-01T00:00:00Z',
                companyId: 'company1',
                companyName: 'Test Company',
            }
            mockUserRepository.findOneById.mockResolvedValue(user as UserDocument)

            const result = await userService.get('1')

            expect(result).toEqual({
                id: user._id.toString(),
                username: 'testuser',
                email: 'test@example.com',
                createdAt: '2023-01-01T00:00:00Z',
                companyId: 'company1',
                companyName: 'Test Company',
                cvUrl: undefined,
                firstName: undefined,
                jobTitle: undefined,
                lastName: undefined,
                profileImage: undefined,
                userGroup: undefined,
                hiringDate: undefined
            })
        })

        it('should throw NotFoundError when user is not found', async () => {
            mockUserRepository.findOneById.mockResolvedValue(null)

            await expect(userService.get('1')).rejects.toThrow(NotFoundError)
        })
    })

    describe('create', () => {
        it('should create a new user and company', async () => {
            const user = {
                _id: new ObjectId(),
                id: '1',
                username: 'testuser',
                email: 'test@example.com',
                createdAt: '2023-01-01T00:00:00Z',
                companyId: 'company1',
                companyName: 'testuser-Company',
            }
            const company = { _id: new ObjectId(), id: 'company1' }

            mockUserRepository.findOne.mockResolvedValue(null)
            mockCompanyRepository.create.mockResolvedValue(company as CompanyDocument)
            mockUserRepository.create.mockResolvedValue(user as UserDocument)

            const result = await userService.create('testuser', 'test@example.com', 'password')

            expect(result).toEqual({
                id: user._id.toString(),
                username: 'testuser',
                email: 'test@example.com',
                createdAt: '2023-01-01T00:00:00Z',
                companyId: 'company1',
                companyName: 'testuser-Company',
                cvUrl: undefined,
                firstName: undefined,
                jobTitle: undefined,
                lastName: undefined,
                profileImage: undefined,
                userGroup: undefined,
                hiringDate: undefined
            })
        })

        it('should throw BadRequestError when email or password is missing', async () => {
            await expect(userService.create('testuser', '', 'password')).rejects.toThrow(BadRequestError)
            await expect(userService.create('testuser', 'test@example.com', '')).rejects.toThrow(BadRequestError)
        })

        it('should throw ForbiddenError when user with the same email already exists', async () => {
            const existingUser = { email: 'test@example.com' }
            mockUserRepository.findOne.mockResolvedValue(existingUser as UserDocument)

            await expect(userService.create('testuser', 'test@example.com', 'password')).rejects.toThrow(ForbiddenError)
        })

        it('should throw InternalServerError on unexpected error', async () => {
            mockUserRepository.findOne.mockResolvedValue(null)
            mockCompanyRepository.create.mockRejectedValue(new Error('Unexpected error'))

            await expect(userService.create('testuser', 'test@example.com', 'password')).rejects.toThrow(InternalServerError)
        })
    })

    describe('update', () => {
        it('should update user data', async () => {
            const authUser: AuthUser = { id: '1', username: "testname", userGroup: "customer" }
            const updateCommand = { firstName: 'Updated' }

            await userService.update('1', updateCommand, authUser)

            expect(mockUserRepository.update).toHaveBeenCalledWith('1', updateCommand)
        })

        it('should throw UnauthorizedError when trying to update another user', async () => {
            const authUser: AuthUser = { id: '2', username: "testname", userGroup: "customer" }
            const updateCommand = { firstName: 'Updated' }

            await expect(userService.update('1', updateCommand, authUser)).rejects.toThrow(UnauthorizedError)
        })

        it('should throw InternalServerError on unexpected error', async () => {
            const authUser: AuthUser = { id: '1',  username: "testname", userGroup: "customer" }
            const updateCommand = { firstName: 'Updated' }

            mockUserRepository.update.mockRejectedValue(new Error('Unexpected error'))

            await expect(userService.update('1', updateCommand, authUser)).rejects.toThrow(InternalServerError)
        })
    })

    describe('delete', () => {
        it('should delete user and S3 object', async () => {
            await userService.delete('1')

            expect(mockUserRepository.delete).toHaveBeenCalledWith('1')
            expect(mockS3Lib.deleteObject).toHaveBeenCalledWith({
                Key: '1',
                Bucket: s3Bucket,
            })
        })

        it('should throw InternalServerError on unexpected error', async () => {
            mockUserRepository.delete.mockRejectedValue(new Error('Unexpected error'))

            await expect(userService.delete('1')).rejects.toThrow(InternalServerError)
        })
    })
})