import { ssmNames } from "../common/ssmNames"
import createSSMClient from "./ssm"
import dotenv from 'dotenv'


// Load environment variables from .env when running locally
if (process.env.IS_OFFLINE) {
    dotenv.config()
}


export type IEnvVariables = {
    [key:string]: string
}
const envVariablesLib =  async (): Promise<IEnvVariables> => {
        
    if (process.env.IS_OFFLINE) {
        console.log('Running locally, using .env variables')
        return {
            DB_URL: process.env.DB_URL || '',
            S3_BUCKET: process.env.S3_BUCKET || '',
        }
    } else {
        console.log('Running on AWS, fetching from SSM...')
        return await createSSMClient(ssmNames)
    }
    
}

export default envVariablesLib