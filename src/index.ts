import mongoose from 'mongoose'
import fastify, { RouteShorthandOptions } from 'fastify'

export const app = fastify({
    logger: true,
})

/* 
app
  .register(import('@fastify/mongodb'), { forceClose: true, url: process.env.DB_URL }) */

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
// support parsing of application/json type post data
/* app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))



app.use(async function (req, res, next) {
    
    const url = process.env.DB_URL
    
    await mongoose.connect(url!)

    // action after response
    const afterResponse = function() {
     console.info("End request");
  
      // any other clean ups
      mongoose.connection.close();
    }
    
    // hooks to execute after response
    res.on('finish', afterResponse);
    
    // do more stuff
  
    next();
  })
 */
// const port = process.env.PORT || 3000
/* 
app.post('/registration', async (req: Request, res, next) => {
    const { username, password, email } = req.body

    if (!email || !password) {
        res.sendStatus(403)
        return
    }

    let user = await UserModel.findOne({ email });
    if (user) {
        res.status(400).send('User already exists.');
        return 
    }

    if(!/^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/.test(password)) {
        res.status(400).send('Password is not valid!');
        return
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    user = new UserModel({
        username,
        email,
        password: hashedPassword
    })
    
   try {
        await user.save();
    } catch (e) {
        if(e instanceof Error) {
            res.status(403).send(e.message)
            console.log('Error: '+e.message)
        }
        return
    } 
    
    console.log('Send Successfully!!!')
    
    res.sendStatus(200)
}) */

app.register(import('./plugins/authService'))
app.register(import('./routes'))

// Run the server!
app.listen({ port: 3000 }, (err) => {
    if (err) {
        app.log.error(err)
        mongoose.connection.close()
        process.exit(1)
    }
})
