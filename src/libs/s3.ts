import S3, { DeleteObjectOutput } from "aws-sdk/clients/s3"
import { AWSError } from "aws-sdk";

export type DeleteObject = {
    Key: string,
    Bucket: string
}

export type UploadObjectResponse = {
    location: string
}

export interface IS3Library {
    uploadObject: (params: S3.Types.PutObjectRequest) => Promise<UploadObjectResponse>
    deleteObject: (input:DeleteObject) => Promise<boolean>
}

const s3Library = () => {
    const uploadObject = async (params: S3.Types.PutObjectRequest):Promise<UploadObjectResponse> => {
        const s3 = new S3({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY
        });

          
        const uploadPromise:Promise<UploadObjectResponse> = new Promise((resolve, reject) => {
            s3.upload(params, function(err:Error, response:S3.ManagedUpload.SendData) {
                if(err) {
                    reject(err)
                }
                resolve({location: response.Location})
            });
        }) 

        return uploadPromise
    }
    const deleteObject = async (input:DeleteObject):Promise<boolean> => {
        const s3 = new S3({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY
        });
        
        s3.deleteObject(input, function(err:AWSError, response:DeleteObjectOutput) {
            if(err) {
                throw err
            }
        })

        return true
    }

    return {
        uploadObject,
        deleteObject
    }
}

export const createS3Lib = () => {
    return s3Library()
}