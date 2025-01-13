import mongoose, { InferSchemaType, model } from 'mongoose'
import bcrypt from 'bcrypt'

export type UserGroup = 
    'superadmin' |
    'admin' |
    'customer'


export interface IUser {
    username: string
    email: string
    password: string
    jobTitle: string
    userGroup: UserGroup
    firstName: string
    lastName: string
    cvUrl: string
    createdAt: string
    hiringDate: string
    profileImage: string
    companyId: string
    companyName: string
}

const userSchema = new mongoose.Schema<IUser>({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
            },
            message: (props) => `${props.value} is not a valid email`,
        },
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 16,
        validate: {
            validator: function (v) {
                return /^[a-zA-Z0-9~_&*%@#$]{8,16}$/.test(v)
            },
            message: () =>
                `Password must have letters, numbers and a special char`,
        },
    },
    jobTitle: {
        type: String
    },
    userGroup: {
        type: String,
        enum : ['superadmin','admin', 'customer'],
        default: 'customer',
        required: true
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    cvUrl: {
        type: String
    },
    profileImage: {
        type: String
    },
    createdAt: {
        type: String,
        required: true
    },
    hiringDate: {
        type: String
    },
    companyId: {
        type: String
    },
    companyName: {
        type: String
    }
})

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword

    next()
}) 

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
userSchema.post('save', async function (error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        next(
            new Error(
                `A user with the same value ${Object.values(error.keyValue)[0]} already exists`
            )
        )
    } else {
        next(error)
    }
})

export type UserType = InferSchemaType<typeof userSchema>

const UserModel = model<UserType>('USER', userSchema)

export { UserModel }
