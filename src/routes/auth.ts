import { FastifyPluginAsync } from "fastify";
// import loginService from "../modules/login/login";
import { LoginRequestDto, LoginResponseDto, RegisterRequestDto } from "./dtos";

const authRoutes:FastifyPluginAsync = async (server) => {
    server.post<{ Body: LoginRequestDto; Reply: LoginResponseDto }>(
        '/login',
        async (request) => {
            const {usernameOrEmail, password} = request.body
        
            return server.authService.login(usernameOrEmail, password)
            
        }
    )

    server.post<{ Body: RegisterRequestDto; Reply: any }>(
        '/register',
        async (request) => {
            const {username, email, password} = request.body
        
            return server.authService.register(username, email, password)
            
        }
    )

}

export default authRoutes