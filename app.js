require("dotenv").config()
const express = require('express');
const app = express();
// const morgan = require('morgan')
const helmet = require('helmet');
const compression = require('compression');
// TODO init middlewares
// app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

// TODO init db
require("./src/dbs/init.mongodb")
const {
    checkOverload
} = require("./src/helpers/check.connect")
checkOverload()


// TODO init router
app.use('/', require("./routers/index"))
// TODO handing error

app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || 'Internal Sever Error'
    })
})

module.exports = app