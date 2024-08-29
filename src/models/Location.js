const db = require("../db/connect");





class Location {
        constructor({place_id, name, location_type, description, latitude, longitude, rating, address, phone_number, website_url, image_url, opening_hours, tags }) {
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
          this.tags = tags
        }
      


    static async getOneById(id) {
        const response = await db.query("SELECT * FROM green_places WHERE place_id = $1;", [id]);


        if (response.rows.length != 1) {
          throw new Error("Unable to locate location.")
        }

        const response_tags = await db.query("SELECT tag_name FROM tags WHERE place_id = $1;", [id]);


        if (response_tags.rows.length == 0) {
          throw new Error("Unable to locate tags.")
        }

        const tag_names = response_tags.rows.map(tag => tag.tag_name);

        response.rows[0].tags = tag_names

    
        return new Location(response.rows[0]);
      }
}


module.exports = Location;
