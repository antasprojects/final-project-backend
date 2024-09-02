const express = require("express")
const cors = require("cors")
const logger = require('./middleware/logger')
const usersRouter = require("./routers/users");
const locationsRouter = require("./routers/locations");
const interestingFactsRouter = require("./routers/interestingFacts");
const journeyRoutes = require("./routers/journeyRoutes");

// Log the GEMINI_API_KEY to ensure it's loaded
console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY);


const app = express()

app.use(express.json())
app.use(cors())
app.use(logger)

app.use("/users", usersRouter);
app.use("/locations", locationsRouter);
app.use('/name', interestingFactsRouter);
app.use('/journey', journeyRoutes);



app.get("/", (req, res) => {
    const server_name = process.env.SERVER_NAME || 'Local Host';
    res.send({"final-project-backend": "healthy v9", "server-name": server_name})
})


// This block is route for database testing can be deleted later on
const db = require('./db/connect')
app.get("/database", async (req, res) => {
    try {
        const result = await db.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';");
        res.json(result.rows);
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
//

module.exports = app
