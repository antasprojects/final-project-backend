const db = require('../db/connect');

class Like {
    constructor(likeId, userId, placeId, createdAt) {
        this.likeId = likeId;
        this.userId = userId;
        this.placeId = placeId;
        this.createdAt = createdAt;
    }

    static async addLike(placeId) {
        const updateQuery = `
            UPDATE likes
            SET like_count = like_count + 1
            WHERE place_id = $1
            RETURNING *;
        `;
        
        const insertQuery = `
            INSERT INTO likes (place_id, like_count)
            VALUES ($1, 1)
            RETURNING *;
        `;
        const values = placeId;
        try {
            const { rows } = await db.query(updateQuery, [values]);
    
            if (rows.length === 0) {
                const insertResult = await db.query(insertQuery, [values]);
                return {
                    place_id: insertResult.rows[0].place_id,
                    like_count: insertResult.rows[0].like_count
                };
            }
    
            return {
                like_count: rows[0].like_count
            };
        } catch (err) {
            console.error('Error updating like count:', err);
            throw err;
        }
    }

    static async removeLike(placeId) {
        const decrementQuery = `
            UPDATE likes
            SET like_count = like_count - 1
            WHERE place_id = $1 AND like_count > 1
            RETURNING *;
        `;
        
        const deleteQuery = `
            DELETE FROM likes
            WHERE place_id = $1 AND like_count = 1
            RETURNING *;
        `;
        
        const values = [placeId];
    
        try {
            const { rows: decrementRows } = await db.query(decrementQuery, values);
    
            if (decrementRows.length > 0) {
                return {
                    place_id: decrementRows[0].place_id,
                    like_count: decrementRows[0].like_count
                };
            }
    
            const { rows: deleteRows } = await db.query(deleteQuery, values);
    
            if (deleteRows.length > 0) {
                console.log(`Like removed:`, deleteRows[0]);
                return {
                    place_id: deleteRows[0].place_id,
                    like_count: 0 
                };
            }
    
            throw new Error('Place not found or like count is already zero.');
    
        } catch (err) {
            console.error('Error removing like:', err);
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
