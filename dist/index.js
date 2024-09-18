"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const fastify_1 = __importDefault(require("fastify"));
exports.app = (0, fastify_1.default)({
    logger: true,
});
/*
app
  .register(import('@fastify/mongodb'), { forceClose: true, url: process.env.DB_URL }) */
exports.app.register(() => __awaiter(void 0, void 0, void 0, function* () {
    const url = process.env.DB_URL;
    if (mongoose_1.default.connection.readyState === 0)
        mongoose_1.default
            .connect(url)
            .then(() => console.log('Connected to database'))
            .catch((e) => console.log('Error while connecting to the database', e));
}));
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
exports.app.register(Promise.resolve().then(() => __importStar(require('./plugins/authService'))));
exports.app.register(Promise.resolve().then(() => __importStar(require('./routes'))));
// Run the server!
exports.app.listen({ port: 3000 }, (err) => {
    if (err) {
        exports.app.log.error(err);
        mongoose_1.default.connection.close();
        process.exit(1);
    }
});
