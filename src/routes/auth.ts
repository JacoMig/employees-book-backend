import { FastifyPluginAsync } from "fastify";
import { CreateUserRequestDto, ILoginRequestDto, LoginResponseDto, RegisterRequestDto } from "./dtos";

const authRoutes:FastifyPluginAsync = async (server) => {
    server.post<{ Body: ILoginRequestDto; Reply: LoginResponseDto }>(
        '/login',
        {
            schema: {
              body: ILoginRequestDto,
            },
        },
        async (request) => {
            const {usernameOrEmail, password} = request.body
        
            return server.authService.login(usernameOrEmail, password)
            
        }
    )
    server.post<{Body: CreateUserRequestDto}>(
      '/register',
      {
        schema: {
            body: CreateUserRequestDto,
            response: {
              201: RegisterRequestDto
            }
        }
      },
      async (request, response) => {
        const { username, email, password } = request.body
        response
                .status(201)
                .send(
                    await server.userService.create(
                        username,
                        email,
                        password
                    )
                )
      }
    )
}

export default authRoutes