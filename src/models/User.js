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
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
      [username, email, password_hash]
    );

    if (query.rows.length !== 1) {
      throw new Error("Unable to authenticate user");
    }

    return new User(query.rows[0]);
  }

  static async destroy({ user_id, email }) {
    if (!user_id && !email) throw new Error("Please provide a user_id or email");

    const query = {
      text: "DELETE FROM users WHERE",
      values: [],
    };

    if (user_id) {
      query.text += " user_id = $1";
      query.values.push(user_id);
    } else if (email) {
      query.text += " email = $1";
      query.values.push(email);
    }

    const result = await db.query(query.text, query.values);

    if (result.rowCount !== 1) {
      throw new Error("Unable to delete user");
    }

    return true; // Return true on successful deletion
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
    const insertQuery = `
      INSERT INTO User_Recommendations (recommender_user_id, recommended_user_id, place_id, message) 
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const insertResult = await db.query(insertQuery, [recommender_user_id, recommended_user_id, place_id, message]);
    const recommendation = insertResult.rows[0];

    // Fetch the usernames of the recommender and the recommended user
    const userQuery = `
      SELECT 
        (SELECT username FROM Users WHERE user_id = $1) AS recommender_username,
        (SELECT username FROM Users WHERE user_id = $2) AS recommended_username
    `;
    const userResult = await db.query(userQuery, [recommender_user_id, recommended_user_id]);

    // Combine the recommendation data with the usernames
    return {
      ...recommendation,
      recommender_username: userResult.rows[0].recommender_username,
      recommended_username: userResult.rows[0].recommended_username
    };
  }

  static async getRecommendationsForUser(user_id) {
    const query = `
      SELECT ur.*, gp.*, 
             u1.username AS recommender_username, 
             u2.username AS recommended_username
      FROM User_Recommendations ur
      JOIN Green_Places gp ON ur.place_id = gp.place_id
      JOIN Users u1 ON ur.recommender_user_id = u1.user_id
      JOIN Users u2 ON ur.recommended_user_id = u2.user_id
      WHERE ur.recommended_user_id = $1;
    `;
    const result = await db.query(query, [user_id]);
    return result.rows;
  }
}

module.exports = User;

