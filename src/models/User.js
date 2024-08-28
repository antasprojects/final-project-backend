const db = require("../db/connect");

class User {
  constructor({ user_id, username, email, password }) {
    this.user_id = user_id;
    this.email = email;
    this.username = username;
    this.password = password;

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

  static async create({ username, email, password }) {
    if (!username || !password || !email)
      throw new Error("Please provide required fields");

    const query = await db.query(
      "INSERT INTO users (username , email, password_hash) VALUES ($1 , $2, $3) RETURNING *",
      [username, email, password]
    );

    if (query.rows.length !== 1) {
      throw new Error("Unable to authenticate user");
    }

    return new User(query.rows[0]);
  }
}

module.exports = User;