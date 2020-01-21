const mongoose = require("mongoose")

// const MONGOURI = "mongodb+srv://makmende:makmende@vikaboni-lqgr1.mongodb.net/test?retryWrites=true&w=majority"
const MONGOURI = "mongodb://test:a12345@ds257698.mlab.com:57698/node-auth";

const IntiateMongoServer = async () => {
    try {
        await mongoose.connect(MONGOURI, {
            useNewUrlParser : true
        })
        console.log("complete connection to database")
    }
    catch (e) {
        console.log(e)
        throw(e)
    }
}

module.exports = IntiateMongoServer