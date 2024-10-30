import { FileCV } from '../../common/dtos'
import { BadRequestError, InternalServerError } from '../../common/errors'
import { IS3Library } from '../../libs/s3'
import { IUploadsRepository, RemoveUploadKey } from './uploadsRepository'

const uploadsService = (S3Lib:IS3Library, UploadsRepository:IUploadsRepository) => {
    const uploadToS3 = async (id: string, file: FileCV) => {
        if (!file) throw new BadRequestError('No file sent to the request')
        
        const filename = file.type === 'application/pdf' ? file.name : file.fieldname

        const params = {
            Key: `${filename!}`,
            Bucket: `${process.env.S3_BUCKET!}/${id}`,
            Body: file.file,
            ContentType: file.type,
        } 
        try {
            const uploaded = await S3Lib.uploadObject(params)
            const updateKey = file.type === 'application/pdf' ? 'cvUrl' : 'profileImage'
            await UploadsRepository.updateCv(id, {[updateKey]: uploaded.location}) 
        } catch (e) {
            throw new InternalServerError(e as string)
        }

        return {}
    }

    const deleteFromS3 = async (id: string, filename: string, removeKey: RemoveUploadKey) => {
        
        const params = {
            Key: `${id}/${filename}`,
            Bucket: process.env.S3_BUCKET!
        }
        try {
            await S3Lib.deleteObject(params)

            await UploadsRepository.deleteCv(id, removeKey)
        } catch (e) {
            throw new InternalServerError(e as string)
        }

        return {}
    }

    return {
        uploadToS3,
        deleteFromS3
    }
}

export const createUploadsService = (S3Lib:IS3Library, UploadsRepository:IUploadsRepository) => {
    return uploadsService(S3Lib, UploadsRepository)
}
