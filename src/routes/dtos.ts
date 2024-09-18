export type LoginRequestDto = {
    usernameOrEmail: string
    password: string
}

export type LoginResponseDto = {
    loggedIn: boolean
}

export type RegisterRequestDto = {
    username: string,
    email: string,
    password: string
}

