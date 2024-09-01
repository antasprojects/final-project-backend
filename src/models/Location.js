const db = require("../db/connect");
const { getBoundaries } = require("./helpers.js");

class Location {
  constructor({
    place_id,
    name,
    location_type,
    description,
    latitude,
    longitude,
    rating,
    address,
    phone_number,
    website_url,
    image_url,
    opening_hours,
    tags,
  }) {
    this.place_id = place_id;
    this.name = name;
    this.location_type = location_type;
    this.description = description;
    this.latitude = latitude;
    this.longitude = longitude;
    this.rating = rating;
    this.address = address;
    this.phone_number = phone_number;
    this.website_url = website_url;
    this.image_url = image_url;
    this.opening_hours = opening_hours;
    this.tags = tags;
  }

  static async getOneById(id) {
    const response = await db.query("SELECT * FROM green_places WHERE place_id = $1;", [id]);

    if (response.rows.length != 1) {
      throw new Error("Unable to locate location.");
    }

    const response_tags = await db.query("SELECT tag_name FROM tags WHERE place_id = $1;", [id]);

    if (response_tags.rows.length == 0) {
      throw new Error("Unable to locate tags.");
    }

    const tag_names = response_tags.rows.map((tag) => tag.tag_name);

    response.rows[0].tags = tag_names;

    return new Location(response.rows[0]);
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

  static async getRecommendations(id) {
    try {
      const response = await db.query(`
        SELECT name, description, address 
        FROM green_places
        WHERE place_id = $1;
      `, [id]);
  
      if (response.rows.length === 0) {
        console.log(`No recommendations found for place_id: ${id}`);
        return [];
      }
  
      const recommendations = response.rows.map((location) => {
        const { name, description, address } = location;
  
        return {
          name,
          description: description || 'No description available',
          address: address || 'No address available'
        };
      });
  
      return recommendations;
    } catch (err) {
      console.error("Error executing getRecommendations query:", err); // Log the exact error
      throw new Error("Error retrieving location recommendations: " + err.message);
    }
  }
}


module.exports = Location;
