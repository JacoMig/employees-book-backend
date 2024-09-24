import { FastifyPluginAsync } from "fastify";
import { ILoginRequestDto, LoginResponseDto } from "./dtos";

const authRoutes:FastifyPluginAsync = async (server) => {
    server.post<{ Body: ILoginRequestDto; Reply: LoginResponseDto }>(
        '/login',
        {
            schema: {
              body: ILoginRequestDto,
              /* response: {
                200: User
              }, */
            },
        },
        async (request) => {
            const {usernameOrEmail, password} = request.body
        
            return server.authService.login(usernameOrEmail, password)
            
        }
    )

}

export default authRoutes