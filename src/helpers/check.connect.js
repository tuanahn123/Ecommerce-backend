const mongoose = require("mongoose")
const _SECONDS = 50000000
const os = require("os")
const process = require("process")
const countConnect = () => {
    const numConnection = mongoose.connections.length
    console.log(`Number of connection :: ${numConnection}`)
}

// TODO Check over load
const checkOverload = () => {
    // setInterval(() => {
        const numConnection = mongoose.connections.length
        const numCore = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss
        // console.log(`Active Connections:: ${numConnection}`)
        // console.log(`Membory usage:: ${memoryUsage / 1024 / 1024} MB`)
        // Example maximun number of connections based on number osf cores
        const maxConnections = numCore * 5;
        if (numConnection > maxConnections) {
            console.log(`Connection overload detected!`)
        }
    // }, _SECONDS) //Monitor every 5 seconds
}

module.exports = {
    countConnect,
    checkOverload
}