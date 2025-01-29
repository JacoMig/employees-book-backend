import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import envVariablesLib, { IEnvVariables } from '../libs/envVariables'


declare module 'fastify' {
    interface FastifyInstance {
        envVariables: Promise<IEnvVariables>
    }
}

const envVariables: FastifyPluginAsync = async (server) => {
    const service = async () => await envVariablesLib()
    server.decorate('envVariables', service())
}

export default fp(envVariables)
