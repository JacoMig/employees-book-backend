import { FastifyPluginAsync } from "fastify";
import { CreateUserRequestDto, CreateUserResponseDto, GetUserQueryString, UpdateUserParams, UpdateUserRequestDto, UserDocument } from "./dtos";
import { UserType } from "../userSchema";

const userRoutes:FastifyPluginAsync = async (server) => {
    
    server.get<{ Querystring: GetUserQueryString }>(
        '/',
        {
            schema: {
              querystring: GetUserQueryString,
            },
        },
        async (request) => {
            return await server.userService.list(request.query)
        }
    )
    
    server.post<{ Body: CreateUserRequestDto; Reply: CreateUserResponseDto }>(
        '/',
        async (request,response) => {
            const {username, email, password, userGroup} = request.body
            response.status(201).send(
                await server.userService.create(username, email, password, userGroup)
            )
        }
    )

    server.patch<{Body: UpdateUserRequestDto,  Params: UpdateUserParams}>(
        '/:id', 
        {
            schema: {
                body: UpdateUserRequestDto,
                params: UpdateUserParams
            }
        },
        async (request) => {

        }
    )

    server.delete<{ Params: {id: string} }>(
        '/:id',
        {
        preHandler: server.auth([
            server.authService.authenticate(['superadmin'])
        ])
        },
        async (request, response) => {
            const {id} = request.params
            await server.userService.delete(id)

            response.status(204);
        }
    )
}

export default userRoutes