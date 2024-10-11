import {  UserModel } from '../../userSchema'
import { UserDocument } from '../../routes/dtos'

export interface IUploadsRepository {
    updateCv: (id: string, cvUrl: string) => Promise<UserDocument | null>
    deleteCv: (id: string) => Promise<void>
}

function uploadsRepository(): IUploadsRepository {
    
    const removeCv = async (id: string) => {
        await UserModel.findOneAndUpdate({_id: id}, {cvUrl: ""})
    }

    const updateCv = async (id: string, cvUrl: string) => {
        return await UserModel.findOneAndUpdate({_id: id}, {cvUrl}, {new: true})
    }

    return {
        updateCv,
        deleteCv: removeCv,
    }
}

export default uploadsRepository
