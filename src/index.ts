import mongoose from 'mongoose'
import fastify, { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
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



app.register(import('./plugins/authService'))
app.register(import('./plugins/userService'))
app.register(import('./routes'))
app.register(import('@fastify/jwt'), {
    secret: 'supersecret',
    sign: { algorithm: 'HS256' }
  })

// Run the server!
app.listen({ port: 3000 }, (err) => {
    if (err) {
        app.log.error(err)
        mongoose.connection.close()
        process.exit(1)
    }
})
