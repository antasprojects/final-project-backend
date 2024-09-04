const Location = require("../models/Location");
const {fetchDescription} = require("./interestingFacts.js")

async function show(req, res) {
  try {
    const id = parseInt(req.params.id);
    const location = await Location.getOneById(id);
    res.status(200).json(location);
  } catch (err) {
    res.status(404).json({ "error": err.message });
  }
}

async function showImages(req, res) {
  try {
    const id = parseInt(req.params.id);
    const location = await Location.getOneById(id);
    let name = location.name
    const perPage = 5
    
    name = encodeURIComponent(name.replace(" ","").toLowerCase())
    // console.log(name);

    const tags = [name, 'landscape', 'nature']

    // console.log("tags: ", tags);
    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${process.env.FLICKR_API_KEY}&tags=${tags}&tag_mode=all&safe_search=1&sort=relevance&format=json&nojsoncallback=1&per_page=${perPage}`
    // console.log(url);
    const flickr_response = await fetch(url)

    if (!flickr_response.ok) {
      throw new Error(`Flickr API request failed with status ${flickr_response.status}`);
    }

    const data = await flickr_response.json();

    const photoUrls = data.photos.photo.map((photo) => {
      const { id, server, farm, secret } = photo;
      return `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}.jpg`;
    });

    res.status(200).json(photoUrls);
  } catch (err) {
    res.status(404).json({ "error": err.message });
  }
}

async function showWeather(req, res) {
  try {
    const id = parseInt(req.params.id);
    const location = await Location.getOneById(id);

    const lat = location.latitude;
    const lon = location.longitude;

    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}`;

    const weather_response = await fetch(url);
    const data = await weather_response.json();

    const todayDate = new Date().toISOString().split("T")[0];
    const result = [];

    for (let i = 0; i <= 32; i++) {
      if (
        data.list[i].dt_txt.slice(-8) == "15:00:00" ||
        data.list[i].dt_txt.slice(0, 10) == todayDate
      ) {
        let object = {
          date: data.list[i].dt_txt,
          temperature: data.list[i].main.temp - 273.15,
          description: data.list[i].weather[0].description,
          icon_url: `http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png`,
        };
        result.push(object);
      }
    }

    if (!weather_response.ok) {
      throw new Error(`HTTP error! status: ${weather_response.status}`);
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ "error": err.message });
  }
}

async function showFiltered(req, res) {
  try {
    const data = req.body;

    const locations = await Location.getFiltered(data.user_location, data.tags, data.filter_distance);

    res.status(200).json(locations);
  } catch (err) {
    res.status(404).json({ "error": err.message });
  }
}

async function showRecommendations(req, res) {
  try {
    const user_location = req.body.user_location;
    const recommendations = await Location.getRecommendations(user_location);
    res.status(200).json({ recommendations });
  } catch (err) {
    res.status(500).json({ "error": "Cannot retrieve location recommendations: " + err.message });
  }
}

async function showImage(req, res) {

  const id = parseInt(req.params.id);
  const location = await Location.getOneById(id);

  if (!location) {
    res.status(404).json({ "error": err.message });
    }

  if (location.image_url){
    res.status(200).json(location.image_url)
  }
  else {

    try {
      // console.log(location.name);
      const response = await fetch(`https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(location.name)}&searchType=image&key=${process.env.GOOGLE_MAPS_API_KEY}&cx=44bf1ef33a330462e`);
      const data = await response.json();
      // console.log(data);

      if (!data.items || data.items.length === 0) {
        return res.status(404).json({ error: 'No images found' });
      }


      const imageUrls = data.items.map(item => item.link);

      await Location.addImageUrl(imageUrls, id)

      // console.log(imageUrls);



      res.status(200).json(imageUrls)

    } catch (error) {
        console.error('Error fetching images from Google API:', error);
      if (!res.headersSent) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  }
  


}


async function showDescription(req, res) {
  const id = parseInt(req.params.id);
  const location = await Location.getOneById(id);

  if (!location) {
    res.status(404).json({ "error": err.message });
    }

  if (location.description) {
    res.status(200).json(location.description)
  }
  else {
    const description = await fetchDescription(location)

    await Location.addDescription(description, id)

    res.status(200).json(description)
    
  }

}

// Controller to get the save count for a specific place
const getPlaceMetrics = async (req, res) => {
  try {
    const { place_id } = req.params; // Extract place_id from the URL
    const saveCount = await Location.getSaveCount(place_id);

    res.status(200).json({
      place_id: place_id,
      save_count: saveCount,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve metrics' });
  }
};





module.exports = {
  show,
  showImages,
  showImage,
  showWeather,
  showFiltered,
  showRecommendations,
  showDescription,
  getPlaceMetrics
};
