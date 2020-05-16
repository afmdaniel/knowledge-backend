const mongoose = require('mongoose')
const { mongodb } = require('../.env')

mongoose
    .connect(
        `mongodb+srv://${mongodb.user}:${mongodb.password}@cluster0-1jjiw.mongodb.net/test?retryWrites=true&w=majority`,
        { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(err => {
        const msg = '[ERROR] Unable to connect with MongoDB'
        console.log('\x1b[41m%s\x1b[37m', msg, '\x1b[0m')
    })

