import { HydratedDocument } from "mongoose"
import { IUser, UserGroup } from "../userSchema"
import { Static, Type } from "@sinclair/typebox";

export const ILoginRequestDto = Type.Object({
    usernameOrEmail: Type.String(),
    password: Type.String(),
  });
  
export type ILoginRequestDto = Static<typeof ILoginRequestDto>;
  

export type LoginResponseDto = {
    token: string
}

export type RegisterRequestDto = {
    username: string,
    email: string,
    password: string
}

export type CreateUserRequestDto = {
    username: string,
    email: string,
    password: string
    userGroup: UserGroup
}


export type UserDocument = HydratedDocument<IUser>

export type CreateUserResponseDto = Partial<IUser> | null

export const GetUserQueryString = Type.Object({
    username: Type.Optional(Type.String({minLength: 1}))
})


export type GetUserQueryString = Static<typeof GetUserQueryString>


export const UpdateUserRequestDto = Type.Object({
    username: Type.String(),
    email: Type.String({format: 'email'}),
    jobTitle: Type.String({}),
    firstName: Type.String({}),
    lastName: Type.String({}),
})

export type UpdateUserRequestDto = Static<typeof UpdateUserRequestDto>

export const UpdateUserParams = Type.Object({
    id: Type.String()
})

export type UpdateUserParams = Static<typeof UpdateUserParams>