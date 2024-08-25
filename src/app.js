const express = require("express")
const cors = require("cors")
const logger = require('./middleware/logger')

const app = express()

app.use(express.json())
app.use(cors())
app.use(logger)

app.get("/", (req, res) => {
    res.send({"final-project-mvc": "healthy v5"})
})



// This block is route for database testing can be deleted later on
const db = require('./db/connect')
app.get("/database", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM power_rangers");
        res.json(result.rows);
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
//

module.exports = app