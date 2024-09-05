const db = require('../db/connect');


async function getRecommendationCountDB(user_id) {
    const query = "SELECT COUNT(*) AS recommendation_count FROM User_Recommendations WHERE recommender_user_id = $1;"
    data = await db.query(query, [user_id])

    return data.rows[0];
}

async function getVisitCountDB(user_id) {

    const query = "SELECT COUNT(*) AS visit_count FROM Saved_places WHERE user_id = $1;"

    data = await db.query(query, [user_id])

    return data.rows[0]
}


module.exports = {
    
    getRecommendationCountDB,
    getVisitCountDB,
  
};


