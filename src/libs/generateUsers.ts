import { faker } from '@faker-js/faker'
import { IUser, UserModel, UserType } from '../userSchema'
import mongoose from 'mongoose'

const mainTask = async () => {
    const generateUsers = (num: number) => {
        const users = []

        for (let i = 0; i < num; i++) {
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
                createdAt,
                hiringDate,
                jobTitle,
            })
        }

        return users
    }

    const insertMany = async () => {
        const users = generateUsers(2)
      
        

        const url = 'mongodb://localhost:27017/EMPLOYEES_BOOK_DB'
       
        if (mongoose.connection.readyState === 0)
            mongoose
                .connect(url!)
                .then(async () => {
                    UserModel.create(users)
                        .then((s) => console.log(s))
                        .catch((e) => console.log(e))
                        .finally(() => mongoose.connection.close())
                })
                .catch((e) =>
                    console.log('Error while connecting to the database', e)
                )
    }

    await insertMany()
}

mainTask()
