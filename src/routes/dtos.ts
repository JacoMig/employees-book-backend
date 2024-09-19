import { HydratedDocument } from "mongoose"
import { IUser } from "../userSchema"

export type LoginRequestDto = {
    usernameOrEmail: string
    password: string
}

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
}


export type UserDocument = HydratedDocument<IUser>
