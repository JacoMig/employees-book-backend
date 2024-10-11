import { FileCV } from '../../common/dtos'
import { BadRequestError, InternalServerError } from '../../common/errors'
import { IS3Library } from '../../libs/s3'
import { IUploadsRepository } from './uploadsRepository'

const uploadsService = (S3Lib:IS3Library, UploadsRepository:IUploadsRepository) => {
    const uploadToS3 = async (id: string, file: FileCV) => {
        if (!file) throw new BadRequestError('No file sent to the request')

        const params = {
            Key: `${file.name!}`,
            Bucket: `${process.env.S3_BUCKET!}/${id}`,
            Body: file.file,
            ContentType: file.type,
        }
        try {
            const uploaded = await S3Lib.uploadObject(params)

            await UploadsRepository.updateCv(id, uploaded.location)
        } catch (e) {
            throw new InternalServerError(e as string)
        }

        return {}
    }

    const deleteFromS3 = async (id: string, filename: string) => {
        
        const params = {
            Key: `${id}/${filename}`,
            Bucket: process.env.S3_BUCKET!
        }
        try {
            await S3Lib.deleteObject(params)

            await UploadsRepository.deleteCv(id)
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
