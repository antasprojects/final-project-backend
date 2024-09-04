const db = require('../db/connect');


async function getUserRecommendationCounts() {
    const query = `
        SELECT 
            UR.recommendation_user_id AS user_id,
            COUNT(UR.recommendation_id) AS recommendation_count
        FROM 
            User_Recommendations UR
        GROUP BY 
            UR.recommendation_user_id;
    `;
    const { rows } = await db.query(query);
    return rows;
}

async function getUserVisitCounts() {
    const query = `
        SELECT 
    UP.user_id,
    COUNT(DISTINCT UP.visited_spots) AS saved_count
FROM 
    Users_Profile UP
GROUP BY 
    UP.user_id;
    `;
    const { rows } = await db.query(query);
    return rows;
}


module.exports = {
    
    getUserRecommendationCounts,
    getUserVisitCounts,
  
};


