import mongoose, { InferSchemaType, model } from "mongoose";

export interface IDepartment {
    name: string,
    userId: string[]
}

const departmentSchema = new mongoose.Schema<IDepartment>({
    name: { 
        type: String,
        required: true
    },    
    userId: [String]
})

export type DepartmentType = InferSchemaType<typeof departmentSchema>

const DepartmentModel = model<DepartmentType>('department', departmentSchema)

export { DepartmentModel }
