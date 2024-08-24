const express = require("express")
const cors = require("cors")

const logger = require('./logger')

const app = express()

app.use(express.json())
app.use(cors())
app.use(logger)

app.get("/", (req, res) => {
    res.send({"final-project-mvc": "healthy"})
})

module.exports = app