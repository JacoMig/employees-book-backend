import mongoose, { InferSchemaType, model } from 'mongoose'
import bcrypt from 'bcrypt'

export interface IUser {
    username: string
    email: string
    password: string
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
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(v)
            },
            message: (props) => `${props.value} is not a valid email`,
        },
    },
    password: {
        type: String,
        required: true,
        unique: true,
        min: 8,
        max: 16,
        validate: {
            validator: function (v) {
                return /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/.test(v)
            },
            message: (props) =>
                `${props.value} must have at least one special char, capital letters and numbers`,
        },
    },
})

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword

    next()
})

export type UserType = InferSchemaType<typeof userSchema>

const UserModel = model<UserType>('user', userSchema)

export { UserModel }
