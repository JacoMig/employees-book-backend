import {  UserModel } from '../../userSchema'
import { UserDocument } from '../../routes/dtos'

type UploadParams = {
    cvUrl?: string,
    profileImage?: string
}

export type RemoveUploadKey = 'cvUrl' | 'profileImage'

export interface IUploadsRepository {
    updateCv: (id: string, params:UploadParams) => Promise<UserDocument | null>
    deleteCv: (id: string, removeKey:RemoveUploadKey) => Promise<void>
}

function uploadsRepository(): IUploadsRepository {
    
    const removeCv = async (id: string, removeKey:RemoveUploadKey) => {
    
        await UserModel.findOneAndUpdate({_id: id}, {[removeKey]: ""})
    }

    const updateCv = async (id: string, params:UploadParams) => {
        return await UserModel.findOneAndUpdate({_id: id}, params, {new: true})
    }

    return {
        updateCv,
        deleteCv: removeCv,
    }
}

export default uploadsRepository
