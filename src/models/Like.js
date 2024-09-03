const db = require('../db/connect');

class Like {
    constructor(likeId, userId, placeId, createdAt) {
        this.likeId = likeId;
        this.userId = userId;
        this.placeId = placeId;
        this.createdAt = createdAt;
    }

    static async createLike(userId, placeId) {
        console.log(`Attempting to create like for user ${userId} on place ${placeId}`);
        const query = `
            INSERT INTO likes (user_id, place_id)
            VALUES ($1, $2)
            RETURNING *;
        `;
        const values = [userId, placeId];

        try {
            const { rows } = await db.query(query, values);
            console.log(`Like created:`, rows[0]);
            return new Like(rows[0].like_id, rows[0].user_id, rows[0].place_id, rows[0].created_at);
        } catch (err) {
            console.error('Error creating like:', err);
            throw err;
        }
    }

    static async countLikesByPlaceId(placeId) {
        console.log(`Counting likes for place ID: ${placeId}`);
        const query = `
            SELECT COUNT(*) AS like_count
            FROM likes
            WHERE place_id = $1 ;
        `;
        const values = [placeId];

        try {
            const { rows } = await db.query(query, values);
            console.log(`Number of likes found: ${rows[0].like_count}`);
            return parseInt(rows[0].like_count, 10);
        } catch (err) {
            console.error('Error counting likes:', err);
            throw err;
        }
    }
}

module.exports = Like;
