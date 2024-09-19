import { FastifyPluginAsync } from "fastify";
import { LoginRequestDto, LoginResponseDto } from "./dtos";

const authRoutes:FastifyPluginAsync = async (server) => {
    server.post<{ Body: LoginRequestDto; Reply: LoginResponseDto }>(
        '/login',
        async (request) => {
            const {usernameOrEmail, password} = request.body
        
            return server.authService.login(usernameOrEmail, password)
            
        }
    )

}

export default authRoutes