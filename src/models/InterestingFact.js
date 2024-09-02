const db = require("../db/connect");

class InterestingFact {
    constructor({ fact_id, place_id, fact, created_at }) {
        this.fact_id = fact_id;
        this.place_id = place_id;
        this.fact = fact;
        this.created_at = created_at;
    }


    static async getOneById(id) {
        const response = await db.query("SELECT * FROM interesting_facts WHERE fact_id = $1;", [id]);

        if (response.rows.length !== 1) {
            throw new Error("Unable to locate fact.");
        }

        return new InterestingFact(response.rows[0]);
    }


    static async getAllByPlaceId(place_id) {
        const response = await db.query("SELECT * FROM interesting_facts WHERE place_id = $1;", [place_id]);

        if (response.rows.length === 0) {
            throw new Error("No interesting facts found for this location.");
        }

        return response.rows.map(row => new InterestingFact(row));
    }


    static async create({ place_id, fact }) {
        const created_at = new Date();
        const response = await db.query(
            "INSERT INTO interesting_facts (place_id, fact, created_at) VALUES ($1, $2, $3) RETURNING fact_id;",
            [place_id, fact, created_at]
        );

        const newFactId = response.rows[0].fact_id;
        return newFactId;
    }
}

module.exports = InterestingFact;







