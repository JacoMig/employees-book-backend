import mongoose from 'mongoose'
import fastify from 'fastify'
import cors from '@fastify/cors'
import awsLambdaFastify from '@fastify/aws-lambda'
import routes from "./routes"
import uploadsServicePlugin from './plugins/uploadsService'
import userServicePlugin from './plugins/userService'
import authServicePlugin from "./plugins/authService"


export const app = fastify({
    logger: true,
})

app.register(async () => {
    const url = process.env.DB_URL
    if (mongoose.connection.readyState === 0)
        mongoose
            .connect(url!)
            .then(() => console.log('Connected to database'))
            .catch((e) =>
                console.log('Error while connecting to the database', e)
            )
})



app.register(authServicePlugin)
app.register(userServicePlugin)
app.register(uploadsServicePlugin)
app.register(import('@fastify/multipart'))
app.register(routes)
app.register(import('@fastify/jwt'), {
    secret: 'supersecret',
    sign: { algorithm: 'HS256' }
  })
app.register(cors)


export const handler = awsLambdaFastify(app);
