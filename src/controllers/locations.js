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



async function showImages(req, res) {
  try {
    const id = parseInt(req.params.id);
    const location = await Location.getOneById(id);
    const name = location.name
    const perPage = 5

    

    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${process.env.FLICKR_API_KEY}&text=${encodeURIComponent(name)}&safe_search=1&format=json&nojsoncallback=1&per_page=${perPage}`;
    const flickr_response = await fetch(url);

    if (!flickr_response.ok) {
      throw new Error(`Flickr API request failed with status ${flickr_response.status}`);
    }

    const data = await flickr_response.json();
  
    const photoUrls = data.photos.photo.map(photo => {
      const { id, server, farm, secret } = photo;
      return `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}.jpg`;
    });

    console.log(photoUrls);

    res.status(200).json(photoUrls);
  } catch (err) {
    res.status(404).json({ "error": err.message })
  }
}



  module.exports = {
    show, showImages
  }