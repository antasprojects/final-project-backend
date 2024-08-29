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



async function showWeather(req, res) {

    const id = parseInt(req.params.id);
    const location = await Location.getOneById(id);

    const lat = location.latitude
    const lon = location.longitude

    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}`


    const weather_response = await fetch(url);
    const data = await weather_response.json()

    const todayDate = new Date().toISOString().split('T')[0];
    result = []

    for (let i = 0; i <= 32; i++){

      if (data.list[i].dt_txt.slice(-8) == "15:00:00" || data.list[i].dt_txt.slice(0, 10) == todayDate) {

        let object = {
          date: data.list[i].dt_txt,
          temperature: data.list[i].main.temp - 273.15,
          description: data.list[i].weather[0].description,
          icon_url: `http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png`
        }
        result.push(object)
      }

    }


  if (!weather_response.ok) {
    throw new Error(`HTTP error! status: ${weather_response.status}`);
  }

    res.status(200).json(result);


  }




  module.exports = {
    show, showImages, showWeather
  }