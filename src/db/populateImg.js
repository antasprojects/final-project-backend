
const db = require("./connect");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const Location = require("../models/Location");




async function populateImg() {

    try {
        const query = 'SELECT * FROM green_places;';
        const result = await db.query(query);

        const limit = 5

        const adjusted_limit = Math.min(limit, result.rows.length)

        for (let i = 0; i < adjusted_limit; i++){
            if (!result.rows[i].image_url){
                const res = await fetch(`https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(result.rows[i].name)}&searchType=image&key=${process.env.GOOGLE_MAPS_API_KEY}&cx=44bf1ef33a330462e`);
                const data = await res.json();
                const imageUrls = data.items.map(item => item.link);

                await Location.addImageUrl(imageUrls, i + 1)
                console.log(`added images for ${result.rows[i].name}`);

            }


        }
    
    }
    catch (error) {
        console.error('Error fetching data from green_places:', error.message);
        throw error;
    }
}

if (require.main === module) {
    populateImg();
}



