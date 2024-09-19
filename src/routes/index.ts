import { FastifyPluginAsync } from 'fastify';

const routes: FastifyPluginAsync = async (server) => {
    server.register(import('./auth'));
    server.register(import('./user'), {
        prefix: '/user',
      })
}

export default routes

