const app = require("./app");

const PORT = process.env.PORT || 3000

const sever = app.listen(PORT, () => {
    console.log(`Project start with port ${PORT}`);
})

// process.on('SIGINT', () => {
//     sever.close(() => console.log(`Exit Sever`))
// })