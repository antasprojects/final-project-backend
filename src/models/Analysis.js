const db = require('../db/connect');


async function getMostLikedPlaces() {
    const query = `
        SELECT GP.name, COUNT(L.likes_id) AS like_count
        FROM Green_Places GP
        JOIN Likes L ON GP.place_id = L.place_id
        GROUP BY GP.name
        ORDER BY like_count DESC;
    `;
    const { rows } = await db.query(query);
    return rows;
};

async function getMostSavedPlaces() {
    const query = `
        SELECT GP.name, COUNT(UP.visited_spots) AS save_count
        FROM Green_Places GP
        JOIN Users_Profile UP ON GP.place_id = UP.visited_spots
        GROUP BY GP.name
        ORDER BY save_count DESC;
    `;
    const { rows } = await db.query(query);
    return rows;
};

async function getMostRecommendedPlaces() {
    const query = `
        SELECT GP.name, COUNT(UR.recommendation_id) AS recommendation_count
        FROM Green_Places GP
        JOIN User_Recommendations UR ON GP.place_id = UR.place_id
        GROUP BY GP.name
        ORDER BY recommendation_count DESC;
    `;
    const { rows } = await db.query(query);
    return rows;
};

async function getCombinedMetrics() {
    const query = `
        SELECT 
    GP.name,
    COALESCE(most_liked, 0) AS most_liked,
    COALESCE(most_visited, 0) AS most_visited,
    COALESCE(most_recommended, 0) AS most_recommended
FROM 
    Green_Places GP
LEFT JOIN 
    (SELECT place_id, COUNT(likes_id) AS most_liked
     FROM Likes
     GROUP BY place_id) L ON GP.place_id = L.place_id
LEFT JOIN 
    (SELECT visited_spots AS place_id, COUNT(user_id) AS most_visited
     FROM Users_Profile
     GROUP BY visited_spots) UP ON GP.place_id = UP.place_id
LEFT JOIN 
    (SELECT place_id, COUNT(recommendation_id) AS most_recommended
     FROM User_Recommendations
     GROUP BY place_id) UR ON GP.place_id = UR.place_id
ORDER BY 
    most_liked DESC, most_visited DESC, most_recommended DESC;

    `;
    const { rows } = await db.query(query);
    return rows;
};

module.exports = {
    
    getMostLikedPlaces,
    getMostSavedPlaces,
    getMostRecommendedPlaces,
    getCombinedMetrics
}