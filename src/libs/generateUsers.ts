import { faker } from '@faker-js/faker';
import { IUser, UserModel, UserType } from '../userSchema'

const mainTask = async () => {
const generateUsers = (num: number) => {
    const users = []

    for (let i = 0; i < num; i++) {
        const firstName = faker.person.firstName()
        const lastName = faker.person.lastName()
        const username = faker.internet.userName()
        const password = faker.internet.password({
            pattern: /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/
        })
        const email = faker.internet.email()
        const createdAt = faker.date.past()
        const hiringDate = faker.date.past()
        const jobTitle = faker.person.jobTitle()

        users.push({
            firstName,
            lastName,
            username,
            password,
            email,
            createdAt,
            jobTitle
        })
    }

    return users
}

const insertMany = async () => {
    UserModel.insertMany(generateUsers(10)).then(s => console.log(s.length)).catch(e => console.log(e))
}

await insertMany()

}

mainTask()