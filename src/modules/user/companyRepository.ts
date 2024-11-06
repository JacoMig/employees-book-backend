import { CompanyModel } from "../../companySchema";
import { CompanyDocument } from "../../routes/dtos";

export type CompanyCreateParams = {
    companyName: string,
    companyEmail: string
}

export interface ICompanyRepository {
    create: (params:CompanyCreateParams) => Promise<CompanyDocument>
}

function companyRepository ():ICompanyRepository {
    const create = async (params: CompanyCreateParams):Promise<CompanyDocument> => {
        return await new CompanyModel({
            name: params.companyName,
            email: params.companyEmail
         }).save()
    }

    return {
        create
    }
}

export default companyRepository