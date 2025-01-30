import mongoose from 'mongoose'

const dbConnection = async (url:string) => {
    if(!url) 
        throw new Error("DB Url is not valid")        
    try {
        if (!mongoose.connection.readyState) {
            await mongoose.connect(url!)
            console.log('Connected to MongoDB')
        }
    } catch (error) {
        console.error('Error connecting to MongoDB', error)
        throw error
    }
}


const createDbConnection = (url:string) => {
    return dbConnection(url)
}

export default createDbConnection