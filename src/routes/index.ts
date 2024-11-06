import { FastifyPluginAsync } from 'fastify'

const routes: FastifyPluginAsync = async (server) => {
    server.register(import('./auth'))
    server.register(import('./user'), {
        prefix: '/user',
    })
    server.register(import('./rpc/uploads'), {
        prefix: 'rpc/uploads',
    })
    server.register(import('./rpc/users'), {
        prefix: 'rpc/users',
    })
}

export default routes
