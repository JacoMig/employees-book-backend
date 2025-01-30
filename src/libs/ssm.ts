import { GetParametersCommand, SSMClient } from '@aws-sdk/client-ssm'

const fetchSSMParameters = async (ssmNames: string[]) => {
    try {
        const ssm = new SSMClient({ region: 'eu-central-1' })

        const command = new GetParametersCommand({
            Names: ssmNames,
            WithDecryption: true, 
        })

        const response = await ssm.send(command)
        if (response.Parameters) {
            const params: { [key: string]: string } = {}
            response.Parameters.forEach((param) => {
                const key = param?.Name?.split('/').pop() as string
                if (key && param.Value) params[key] = param.Value
            })
            return params
        }
        return {}
    } catch (error) {
        console.error('Error fetching parameters from SSM:', error)
        return {}
    }
}

const createSSMClient = (ssmNames: string[]) => {
    return fetchSSMParameters(ssmNames)
}

export default createSSMClient
