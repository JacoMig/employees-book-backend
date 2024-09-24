import mongoose from "mongoose";

type Areas = 'backend' | 'frontend' | 'cloud' | 'rd' | 'analyst' | 'machinelearning'

export interface IDepartment {
    name: string,
    areas: Areas
}

const departmentSchema = new mongoose.Schema<IDepartment>({
    
})