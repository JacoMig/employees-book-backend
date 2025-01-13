import { IUser, UserModel } from '../../userSchema'
import { UserDocument } from '../../routes/dtos'
import userRepository from './userRepository'
import mongoose from 'mongoose'

jest.mock('../../userSchema')

describe('userRepository', () => {
    let repo: ReturnType<typeof userRepository>

    beforeAll(() => {
        repo = userRepository()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('findOneById', () => {
        it('should find a user by id', async () => {
            const mockUser = { id: '1', username: 'testuser' } as UserDocument
            UserModel.findOne = jest.fn().mockResolvedValue(mockUser)

            const result = await repo.findOneById('1')

            expect(UserModel.findOne).toHaveBeenCalledWith({ _id: '1' })
            expect(result).toEqual(mockUser)
        })
    })

    describe('list', () => {
        it('should list users with filters', async () => {
            const mockUsers = [{ id: '1', username: 'testuser' }] as UserDocument[]
            const mockResponse = [{ metadata: [{ totalCount: 1 }], data: mockUsers }]
            UserModel.aggregate = jest.fn().mockResolvedValue(mockResponse)

            const filter = { companyId: '1', limit: 10, offset: 0, username: 'test' }
            const result = await repo.list(filter)

            expect(UserModel.aggregate).toHaveBeenCalledWith([
                { $match: { companyId: '1', username: { $regex: /test/i } } },
                { $facet: { metadata: [{ $count: 'totalCount' }], data: [{ $skip: 0 }, { $limit: 10 }] } }
            ])
            expect(result).toEqual(mockResponse)
        })
    })

    describe('findOne', () => {
        it('should find a user by username or email', async () => {
            const mockUser = { id: '1', username: 'testuser', email: 'test@example.com' } as UserDocument
            UserModel.findOne = jest.fn().mockResolvedValue(mockUser)

            const result = await repo.findOne('testuser')

            expect(UserModel.findOne).toHaveBeenCalledWith({ $or: [{ username: 'testuser' }, { email: 'testuser' }] })
            expect(result).toEqual(mockUser)
        })
    })

    describe('create', () => {
        it('should create a new user', async () => {
            const mockUser = { id: '1', username: 'testuser' } as UserDocument
            UserModel.prototype.save = jest.fn().mockResolvedValue(mockUser)

            const result = await repo.create({ username: 'testuser' })

            expect(UserModel.prototype.save).toHaveBeenCalled()
            expect(result).toEqual(mockUser)
        })
    })

    describe('createMany', () => {
        it('should create multiple users', async () => {
            const mockUsers = [{ id: '1', username: 'testuser' }] as UserDocument[]
            UserModel.insertMany = jest.fn().mockResolvedValue(mockUsers)

            const result = await repo.createMany(mockUsers)

            expect(UserModel.insertMany).toHaveBeenCalledWith(mockUsers)
            expect(result).toEqual(mockUsers)
        })
    })

    describe('update', () => {
        it('should update a user by id', async () => {
            const mockUser = { id: '1', username: 'updateduser' } as UserDocument
            UserModel.findOneAndUpdate = jest.fn().mockResolvedValue(mockUser)

            const result = await repo.update('1', { username: 'updateduser' })

            expect(UserModel.findOneAndUpdate).toHaveBeenCalledWith({ _id: '1' }, { username: 'updateduser' }, { new: true })
            expect(result).toEqual(mockUser)
        })
    })

    describe('delete', () => {
        it('should delete a user by id', async () => {
            UserModel.deleteOne = jest.fn().mockResolvedValue({})

            await repo.delete('1')

            expect(UserModel.deleteOne).toHaveBeenCalledWith({ _id: '1' })
        })
    })
})