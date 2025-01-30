import { FastifyPluginAsync } from "fastify";
import { CreateUserRequestDto, ILoginRequestDto, LoginResponseDto, RegisterRequestDto, RegisterResponseDto } from "./dtos";

const authRoutes:FastifyPluginAsync = async (server) => {
    server.post<{ Body: ILoginRequestDto; /* Reply: LoginResponseDto */ }>(
        '/login',
        {
            schema: {
              body: ILoginRequestDto,
            },
        },
        async (request) => {
            const {usernameOrEmail, password} = request.body
           
            return await server.authService.login(usernameOrEmail, password)
            
        }
    )
    server.post<{Body: CreateUserRequestDto}>(
      '/register',
      {
        schema: {
            body: CreateUserRequestDto,
            response: {
              201: RegisterResponseDto
            }
        }
      },
      async (request, response) => {
        const { username, email, password } = request.body

        return await server.authService.register({
          username,
          email,
          password,
        })
      }
    )
}

export default authRoutes