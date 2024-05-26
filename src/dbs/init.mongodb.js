const mongoose = require('mongoose')
const {
    db: {
        host,
        name,
        port
    }
} = require("../configs/config.mongdb")
// const connectString = `mongodb://${host}:${port}/${name}`
const atlasConnectString = process.env.MONGODB_CONNECT_STRING;

const {
    countConnect
} = require("../helpers/check.connect")
class Database {
    constructor() {
        this.connect()
    }
    // TODO connect
    connect(type = 'mongodb') {
        if (1 === 1) {
            mongoose.set('debug', true)
            mongoose.set('debug', {
                color: true
            })
        }
        mongoose.connect(atlasConnectString, {
            maxPoolSize: 50
        }).then(_ => {
            console.log(`Connect Mongodb Success `, countConnect())
        })
            .catch(err => console.log(err))
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database()
        }
        return Database.instance
    }
}
const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb