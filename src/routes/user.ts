import { FastifyPluginAsync } from "fastify";
import { CreateUserRequestDto } from "./dtos";

const userRoutes:FastifyPluginAsync = async (server) => {
    
    server.get(
        '/',
        async (request) => {
            return await server.userService.list()
        }
    )
    
    server.post<{ Body: CreateUserRequestDto; Reply: any }>(
        '/',
        async (request,response) => {
            const {username, email, password} = request.body
            response.status(201).send(
                await server.userService.create(username, email, password)
            )
        }
    )

    server.delete<{ Params: {id: string} }>(
        '/:id',
        async (request, response) => {
            const {id} = request.params
            await server.userService.delete(id)

            response.status(204);
        }
    )
}

export default userRoutes