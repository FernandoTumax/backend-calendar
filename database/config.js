const mongoose = require('mongoose')

console.log(process.env)

const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.DB_CONNECT);

        console.log('DB Online')
    } catch (e) {
        console.log(e)
        throw new Error('Error a la hora de inicializar DB')
    }
}

module.exports = {
    dbConnection
}


