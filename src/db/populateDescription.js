const db = require("./connect");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const Location = require("../models/Location");
const {fetchDescription} = require("../controllers/interestingFacts.js");



async function populateDescription() {

  
    try {
        const query = 'SELECT * FROM green_places;';
        const result = await db.query(query);

        const adjusted_limit = result.rows.length
    
    for (let i = 0; i < adjusted_limit; i++){
        if (!result.rows[i].description){
            
            const location = new Location(result.rows[i])

            const description = await fetchDescription(location)


            await Location.addDescription(description, i + 1)
            console.log(`added description for ${result.rows[i].name}`);
            await new Promise(resolve => setTimeout(resolve, 4000))

        }


    }

}

    catch (error) {
        console.error('Error fetching description:', error.message);
        throw error;
    }
}


if (require.main === module) {
    populateDescription();
}