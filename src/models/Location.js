const db = require("../db/connect");
const { getBoundaries } = require("./helpers.js");

class Location {
  constructor({place_id, name, location_type, description, latitude, longitude, rating, address, image_url, tag_id }) {
    this.place_id = place_id;
    this.name = name;
    this.location_type = location_type;
    this.description = description;
    this.latitude = latitude;
    this.longitude = longitude;
    this.rating = rating;
    this.address = address;
    this.image_url = image_url;
    this.tag_id = tag_id
  }
      
  static async getOneById(id) {
    const response = await db.query("SELECT * FROM green_places WHERE place_id = $1;", [id]);


    if (response.rows.length != 1) {
      throw new Error("Unable to locate location.")
    }

    const response_tag = await db.query("SELECT tag_name FROM tags WHERE tag_id = $1;", [response.rows[0].tag_id]);


    if (response_tag.rows.length == 0) {
      throw new Error("Unable to locate tags.")
    }

    return response.rows[0];
  }


  static async getFiltered(user_location, tags, filter_distance) {

    const { latitude, longitude } = user_location;
    const activeTags = Object.keys(tags).filter((tag) => tags[tag]);
    const { latMin, latMax, lonMin, lonMax } = getBoundaries(latitude, longitude, filter_distance);
    let query;
    let queryParams = [latMin, latMax, lonMin, lonMax];

    if (activeTags.length > 0) {
      query = `
        SELECT DISTINCT p.*
        FROM green_places p
        JOIN tags t ON p.place_id = t.place_id
        WHERE p.latitude BETWEEN $1 AND $2
        AND p.longitude BETWEEN $3 AND $4
        AND t.tag_name = ANY($5::text[]);`;
      queryParams.push(activeTags);

    } else {
      query = `
        SELECT DISTINCT p.* 
        FROM green_places p
        WHERE p.latitude BETWEEN $1 AND $2 
        AND p.longitude BETWEEN $3 AND $4;`;
    }

    const result = await db.query(query, queryParams);

    return result.rows;
  }

  static async getRecommendations(user_location) {
    try {
      const { latitude, longitude } = user_location;
      const { latMin, latMax, lonMin, lonMax } = getBoundaries(latitude, longitude, 20); // 20 km radius

      const query = `
        SELECT name, description, address, rating 
        FROM green_places
        WHERE latitude BETWEEN $1 AND $2
        AND longitude BETWEEN $3 AND $4
        ORDER BY rating DESC
        LIMIT 5;
      `;

      const queryParams = [latMin, latMax, lonMin, lonMax];
      const response = await db.query(query, queryParams);

      if (response.rows.length === 0) {
        console.log(`No recommendations found for the given location.`);
        return [];
      }

      const recommendations = response.rows.map((location) => {
        const { name, description, address, rating } = location;

        return {
          name,
          description: description || 'No description available',
          address: address || 'No address available',
          rating: rating || 'No rating available',
        };
      });

      return recommendations;
    } catch (err) {
      console.error("Error executing getRecommendations query:", err);
      throw new Error("Error retrieving location recommendations: " + err.message);
    }
  }
}

module.exports = Location;
