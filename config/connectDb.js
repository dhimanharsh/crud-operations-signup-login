const mongoose = require('mongoose')

const connectdb = async()=>{
    await mongoose.connect('mongodb+srv://harshdhiman484:password%40123@db-star.resb5a4.mongodb.net/')
}


module.exports = connectdb;