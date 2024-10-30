import { FastifyPluginAsync } from 'fastify'
import { RemoveUploadKey } from '../../modules/uploads/uploadsRepository'

const uploadsRoutes: FastifyPluginAsync = async (server) => {
    server.post<{ Params: { id: string } }>(
        '/:id/upload-cv',
        {
            schema: {
                params: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                    },
                },
            },
        },
        async (request, response) => {
            const file = await request.file()
            
            response.status(200).send(
                await server.UploadsService.uploadToS3(request.params.id, {
                    file: file?.file,
                    name: file?.filename,
                    type: file?.mimetype,
                    fieldname: file?.fieldname
                })
            )
        }
    )

    server.post<{
        Params: { id: string }
        Body: { filename: string; removeKey: RemoveUploadKey }
    }>(
        '/:id/remove-cv',
        {
            schema: {
                params: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                    },
                },
                body: {
                    type: 'object',
                    properties: {
                        filename: { type: 'string' },
                        removeKey: { type: 'string' },
                    },
                },
            },
        },
        async (request, response) => {
            response
                .status(200)
                .send(
                    await server.UploadsService.deleteFromS3(
                        request.params.id,
                        request.body.filename,
                        request.body.removeKey
                    )
                )
        }
    )
}

export default uploadsRoutes
