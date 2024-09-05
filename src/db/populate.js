const db = require("./connect");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

async function checkGreenPlaces() {
    try {
        const query = 'SELECT * FROM green_places;';
        const result = await db.query(query);
        console.log('Data from green_places table:', result.rows);
        return result.rows.length;
    } catch (error) {
        console.error('Error fetching data from green_places:', error.message);
        throw error;
    }
}


async function fetchPlacesFromGoogle(tag, nextPageToken = '') {

    const latitude = 51.5074;
    const longitude = -0.1278;
    const radius = 200

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&keyword=${encodeURIComponent(tag)}&key=${process.env.GOOGLE_MAPS_API_KEY}${nextPageToken ? `&pagetoken=${nextPageToken}` : ''}`;
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)     
        }

        const data = await response.json()

        return data

    } catch (error) {
        console.error('Error:', error);
    }
}

async function getPhotoUrl(photo_reference) {
    const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    
    try {
        return url;
    } catch (error) {
        console.error('Error fetching photo URL:', error);
        return 'No photo URL available';
    }
}

async function getDetails(place_id) {


    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)     
        }

        const data = await response.json()
        const place = data.result


        let photoUrl = 'No photos available';

        if (place.photos && place.photos.length > 0) {
            const photoReference = place.photos[0].photo_reference;
            photoUrl = await getPhotoUrl(photoReference);
        }

        console.log(photoUrl);

        const values = {
            address: place.formatted_address || place.vicinity || '',
            photoUrl: photoUrl,
            wheelchairAccessible :place.wheelchair_accessible_entrance || false
        }

        return values



    } catch (error) {
        console.error('Error:', error);
    }




}

async function putIntoDB(result, tag_id) {
    if (result.business_status === 'OPERATIONAL') {

        const checkQuery = `
        SELECT * FROM Green_Places WHERE name = $1;`;


        const query = `
            INSERT INTO Green_Places (name, location_type, latitude, longitude, address, rating, googleid, tag_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (name) DO NOTHING;`

            const values = [
            result.name,
            JSON.stringify(result.types),
            result.geometry.location.lat,
            result.geometry.location.lng,
            result.vicinity,
            result.rating,
            result.place_id,
            tag_id,
        ];

        try {
            const checkResult = await db.query(checkQuery, [result.name]);
            const length = checkResult.rows.length

            if (length >= 1) {
                console.log(`Record with name '${result.name}' already exists. Skipping insertion.`);
            } else {
                await db.query(query, values);
                console.log(`${result.name} data inserted successfully`);
            }

        } catch (error) {
            console.error('Error inserting data into the database:', error);
        }
    }
}

async function populate() {


    const pageLimit = 2;
    try {

        const tags = ['Woods', 'Hiking', 'Park', 'Garden', 'Historic', 'Beach', 'Camping', 'Wildlife', 'Farm', 'Rivers']

        for (let j = 0; j < tags.length; j++) {
            let nextPageToken = '';
            let hasNextPage = true;
            let pageCount = 0;

            while (hasNextPage && pageCount < pageLimit) {

                const data = await fetchPlacesFromGoogle(tags[j], nextPageToken);


                for (let i = 0; i < data.results.length; i++) {

                    if(data.results[i].user_ratings_total > 50){
                        await putIntoDB(data.results[i], j + 1);
                    }
                }

                if (data.next_page_token) {
                    nextPageToken = data.next_page_token;
                    pageCount++;

                    await new Promise(resolve => setTimeout(resolve, 2000));
                } else {
                    hasNextPage = false;
                }
            }
        }

    } catch (err) {
        console.error('Error during population:', err);
    }
}


if (require.main === module) {
    populate();
}

module.exports = { populate, getPhotoUrl };
