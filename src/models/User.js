const db = require("../db/connect");

class User {
  constructor({ user_id, username, email, password_hash }) {
    this.user_id = user_id;
    this.email = email;
    this.username = username;
    this.password_hash = password_hash;

  }

  static async findByUsername(username) {
    if (!username) throw new Error("Please provide a username");

    const query = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (query.rows.length !== 1) {
      throw new Error("Unable to authenticate user");
    }
    return new User(query.rows[0]);
  }

  static async findByEmail(email) {
    if (!email) throw new Error("Please provide an email");

    const query = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (query.rows.length !== 1) {
      throw new Error("Unable to authenticate user");
    }
    return new User(query.rows[0]);
  }



  static async findById(id) {
    if (!id) throw new Error("Please provide an id");

    const query = await db.query("SELECT * FROM users WHERE user_id = $1", [
      id,
    ]);

    if (query.rows.length !== 1) {
      throw new Error("Unable to authenticate user");
    }

    return new User(query.rows[0]);
  }

  static async create({ username, email, password_hash }) {
    if (!username || !password_hash || !email)
      throw new Error("Please provide required fields");

    const query = await db.query(
      "INSERT INTO users (username , email, password_hash) VALUES ($1 , $2, $3) RETURNING *",
      [username, email, password_hash]
    );

    if (query.rows.length !== 1) {
      throw new Error("Unable to authenticate user");
    }

    return new User(query.rows[0]);
  }

  static async getSavedLocations(user_id) {
    const query = `
        SELECT gp.* 
        FROM Saved_places sp 
        JOIN Green_Places gp ON sp.place_id = gp.place_id 
        WHERE sp.user_id = $1;
    `;
    const result = await db.query(query, [user_id]);
    return result.rows;
}

  static async saveLocation(user_id, place_id) {
    const query = `
        INSERT INTO Saved_places (user_id, place_id) 
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING;
    `;
    await db.query(query, [user_id, place_id]);
}

  static async recommendLocation(recommender_user_id, recommended_user_id, place_id, message) {
    const query = `
      INSERT INTO User_Recommendations (recommender_user_id, recommended_user_id, place_id, message) 
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const result = await db.query(query, [recommender_user_id, recommended_user_id, place_id, message]);
    return result.rows[0];
  }

    static async getRecommendationsForUser(user_id) {
      const query = `
        SELECT ur.*, gp.name AS place_name, u.username AS recommender_username 
        FROM User_Recommendations ur
        JOIN Green_Places gp ON ur.place_id = gp.place_id
        JOIN Users u ON ur.recommender_user_id = u.user_id
        WHERE ur.recommended_user_id = $1;
      `;
      const result = await db.query(query, [user_id]);
      return result.rows;
    }
}

module.exports = User;