const Location = require("../models/Location");



async function show(req, res) {
    try {
      const id = parseInt(req.params.id);
      const location = await Location.getOneById(id);
      res.status(200).json(location);
    } catch (err) {
      res.status(404).json({ "error": err.message })
    }
  }

  module.exports = {
    show
  }