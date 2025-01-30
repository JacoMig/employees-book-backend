import fastify from 'fastify'
import cors from '@fastify/cors'
import awsLambdaFastify from '@fastify/aws-lambda'
import routes from './routes'
import uploadsServicePlugin from './plugins/uploadsService'
import userServicePlugin from './plugins/userService'
import authServicePlugin from './plugins/authService'
import envVariables from './plugins/envVariables'
import createDbConnection from './libs/dbConnection'


export const app = fastify({
    logger: true,
})

app.register(envVariables)
app.register(async (server) => {
    const env = await server.envVariables
    if(env.DB_URL) 
        await createDbConnection(env.DB_URL)

})
app.register(authServicePlugin)
app.register(userServicePlugin)
app.register(uploadsServicePlugin)
app.register(import('@fastify/multipart'))
app.register(routes)
app.register(import('@fastify/jwt'), {
    secret: 'supersecret',
    sign: { algorithm: 'HS256' },
})
app.register(cors)


// Test route for debugging
app.get('/test', async (request, reply) => {
   return reply.status(200).send({ success: true, message: "Fastify works" })
})

const proxy = awsLambdaFastify(app)
export const handler = async (event: any, context: any) => {
    return await proxy(event, context)
}
