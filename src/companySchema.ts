import mongoose, { InferSchemaType, model } from 'mongoose'

export interface ICompany {
    name: string
    email: string
}

const companySchema = new mongoose.Schema<ICompany>({
    name: {
        type: String,
        required: true,
        unique: true,
        min: 3,
        max: 40,
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
})

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
companySchema.post('save', async function (error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        next(
            new Error(
                `A company with the same value ${error.keyValue.name} already exists`
            )
        )
    } else {
        next(error)
    }
})

export type CompanyType = InferSchemaType<typeof companySchema>

const CompanyModel = model<CompanyType>('company', companySchema)

export { CompanyModel }
