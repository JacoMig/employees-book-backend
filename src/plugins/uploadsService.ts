import { FastifyPluginAsync } from "fastify";
import { createS3Lib } from "../libs/s3";
import { createUploadsService } from "../modules/uploads/uploadsService";
import fp from 'fastify-plugin'
import { FileCV } from "../common/dtos";
import uploadsRepository, { RemoveUploadKey } from "../modules/uploads/uploadsRepository";
import envVariablesLib from "../libs/envVariables";

interface IUploadsService {
    uploadToS3: (id:string, file:FileCV) => Promise<object>
    deleteFromS3: (id:string, filename:string, removeKey:RemoveUploadKey) => Promise<object>
}

declare module 'fastify' {
    interface FastifyInstance{
        UploadsService: IUploadsService
    }
} 

const uploadsService:FastifyPluginAsync = async (server) => {
    const UploadsRepository = uploadsRepository()
    const S3Lib = createS3Lib()
    const envVarsLibs = await envVariablesLib()
    const s3Bucket = envVarsLibs.S3_BUCKET
    const service = createUploadsService(S3Lib, UploadsRepository, s3Bucket)
    server.decorate('UploadsService', service)
}

export default fp(uploadsService)