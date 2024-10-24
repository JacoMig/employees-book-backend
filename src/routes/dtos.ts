import { HydratedDocument } from 'mongoose'
import { IUser, UserGroup } from '../userSchema'
import { Static, Type } from '@sinclair/typebox'

export const ILoginRequestDto = Type.Object({
    usernameOrEmail: Type.String(),
    password: Type.String(),
})

export type ILoginRequestDto = Static<typeof ILoginRequestDto>

export type LoginResponseDto = {
    token: string
}

export const RegisterRequestDto = Type.Object({
    username: Type.String({minLength:1, maxLength: 20}),
    email: Type.String({format: 'email'})
})

export type RegisterRequestDto = Static<typeof RegisterRequestDto>

export const CreateUserRequestDto = Type.Object({
    username: Type.String({minLength: 1, maxLength: 20}),
    email: Type.String({ format: 'email' }),
    password: Type.String({ minLength: 8, maxLength: 16 }),
    userGroup: Type.Optional(Type.Union([
        Type.Literal('superadmin'),
        Type.Literal('admin'),
        Type.Literal('customer'),
    ])),
   
})

export type CreateUserRequestDto = Static<typeof CreateUserRequestDto>

export const UploadFileReqeustDto = Type.Object({
    file: Type.Object({})
})

export type UploadFileReqeustDto = Static<typeof UploadFileReqeustDto>

export type UserDocument = HydratedDocument<IUser>

export const CreateUserResponseDto = Type.Object(
    {
        id: Type.String(),
        username: Type.String(),
        email: Type.String({format: 'email'}),
        cratedAt: Type.String({format: "date-time"}),
        userGroup: Type.Optional(Type.Union([
            Type.Literal('superadmin'),
            Type.Literal('admin'),
            Type.Literal('customer'),
        ])),
        jobTitle: Type.Optional(Type.String()),
        firstName: Type.Optional(Type.String()),
        lastName: Type.Optional(Type.String()),
    }
)

export type CreateUserResponseDto = Static<typeof CreateUserResponseDto>

export const GetUserQueryString = Type.Object({
    username: Type.Optional(Type.String({ minLength: 1 })),
    limit: Type.Optional(Type.Number()),
    offset: Type.Optional(Type.Number())
})

export type GetUserQueryString = Static<typeof GetUserQueryString>

export const UpdateUserRequestDto = Type.Object({
    username: Type.Optional(Type.String()),
    email: Type.Optional(Type.String({ format: 'email' })),
    jobTitle: Type.Optional(Type.String()),
    firstName: Type.Optional(Type.String()),
    lastName: Type.Optional(Type.String()),
    hiringDate: Type.Optional(Type.String()),
    profileImage: Type.Optional(Type.String())
})

export type UpdateUserRequestDto = Static<typeof UpdateUserRequestDto>

export const UpdateUserParams = Type.Object({
    id: Type.String(),
})

export type UpdateUserParams = Static<typeof UpdateUserParams>


export const DeleteParamsDto = Type.Object({
    id: Type.String()
})
export type DeleteParamsDto = Static<typeof DeleteParamsDto>


export const DeleteResponseDto = Type.Object({})
export type DeleteResponseDto = Static<typeof DeleteResponseDto>

export const PatchResponseDto = Type.Object({})
export type PatchResponseDto = Static<typeof PatchResponseDto>