import { FastifyPluginAsync } from 'fastify'
import {
    CreateUserRequestDto,
    CreateUserResponseDto,
    GetUserQueryString,
    UpdateUserParams,
    UpdateUserRequestDto,
} from './dtos'


const userRoutes: FastifyPluginAsync = async (server) => {
    server.get<{ Querystring: GetUserQueryString }>(
        '/',
        {
            schema: {
                querystring: GetUserQueryString,
            },
            preHandler: server.auth([
                server.authService.authenticate([]),
            ])
        },
        async (request) => {
            return await server.userService.list(request.query)
        }
    )

    server.post<{ Body: CreateUserRequestDto }>(
        '/',
        {
            schema: {
                body: CreateUserRequestDto,
                response: {
                    201: CreateUserResponseDto
                }  
            }, 
            preHandler: server.auth([
                server.authService.authenticate(['superadmin', 'admin']),
            ]),
        },
        async (request, response) => {
            const { username, email, password, userGroup } = request.body
            response
                .status(201)
                .send(
                    await server.userService.create(
                        username,
                        email,
                        password,
                        userGroup
                    )
                )
        }
    )

    server.patch<{
        Body: UpdateUserRequestDto
        Params: UpdateUserParams
    }>(
        '/:id',
        {
            schema: {
                body: UpdateUserRequestDto,
                params: UpdateUserParams,
            },
            preHandler: server.auth([
                server.authService.authenticate([]),
            ])
        },
        async (request) => {
            return await server.userService.update(
                request.params.id,
                request.body,
                request.authUser
            )
        }
    )

    server.delete<{ Params: { id: string } }>(
        '/:id',
        {
            preHandler: server.auth([
                server.authService.authenticate(['superadmin']),
            ]),
        },
        async (request, response) => {
            const { id } = request.params
            await server.userService.delete(id)

            response.status(204)
        }
    )
}

export default userRoutes
