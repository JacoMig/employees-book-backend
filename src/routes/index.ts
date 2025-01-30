import { FastifyPluginAsync } from 'fastify'
import auth from "./auth"
import userRoutes from "./user"
import rpcUploads from "./rpc/uploads"
import rpcUser from "./rpc/users"

const routes: FastifyPluginAsync = async (server) => {
    server.register(auth)
    server.register(userRoutes, {prefix: "user"})
    server.register(rpcUploads, {prefix: "rpc/uploads"})
    server.register(rpcUser, {prefix: "rpc/users"})
}

export default routes
