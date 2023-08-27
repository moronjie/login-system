const mongoose = require("mongoose")

const connect = async (url) => {
    mongoose.connect(url, {
        dbName: "login-System"
    })
}

module.exports = connect