import { FastifyPluginAsync } from "fastify";
import { faker } from '@faker-js/faker'
import { IUser } from "../../userSchema";

type CreateRandomUsersReq = {
    count: number,
    companyName: string,
    companyId: string
}

const usersRoutes:FastifyPluginAsync = async (server) => {
    server.post<{Body: CreateRandomUsersReq}>(
        '/createRandomUsers',
        {   
            schema: {
                params: {
                    type: 'object',
                    properties: {
                        count: {type: 'number'},
                        companyName: {type: 'string'},
                        companyId: {type: 'string'}
                    }
                }
            },
            preHandler: server.auth([
                server.authService.authenticate(['superadmin']),
            ])
        },
        async (response) => {
            const count = response.body.count
            const companyId = response.body.companyId
            const companyName = response.body.companyName

            const users:IUser[] = []

        for (let i = 0; i < count; i++) {
            const firstName = faker.person.firstName()
            const lastName = faker.person.lastName()
            const username = faker.internet.userName()

            const email = faker.internet.email()

            const password = faker.internet.password({
                length: 12,
                pattern: /^[a-zA-Z0-9~_&*%@$]+$/,
            })
            const profileImage = faker.image.avatar()

            const createdAt = faker.date.past()
            const hiringDate = faker.date.past()
            const jobTitle = faker.person.jobTitle()
           

            users.push({
                firstName,
                lastName,
                username,
                profileImage,
                email,
                password,
                createdAt: createdAt.toString(),
                hiringDate: hiringDate.toString(),
                jobTitle,
                cvUrl: "",
                userGroup: "customer",
                companyId,
                companyName
            })
        }

            return await server.userService.createMany(users)
        }
    )
}


export default usersRoutes