import { FastifyPluginAsync } from 'fastify';

const routes: FastifyPluginAsync = async (server) => {
    server.register(import('./auth'));
}

export default routes

