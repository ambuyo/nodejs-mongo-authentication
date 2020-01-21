
const express = require("express")
const bodyparser = require("body-parser")

const user = require("./routes/user")

useUnifiedTopology : true
const IntiateMongoServer = require("./config/db")

IntiateMongoServer()

const app = express()

const PORT = process.env.PORT || 4000

app.get("/", (req, res) => {
    res.json({ message : "API SETUP"})
})

app.listen(PORT, (req,res) =>{
    console.log(`server started at port ${PORT}`)
})