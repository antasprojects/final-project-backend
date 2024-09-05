
const Journey = require('../models/Journey');


async function getJourneyDirections(req, res) {
    console.log("getJourneyDirections called");

    const { startLocation, endLocation, mode } = req.body;
    console.log("Request body:", req.body);

    try {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        console.log("Google Maps API Key:", apiKey);

        // Default latitude and longitude coordinates if the location is an empty string
        const defaultStartLocation = [51.5074, -0.1278]; // Default to London coordinates
        const defaultEndLocation = [53.9667, -1.0833]; // Default to York coordinates

       
        const startIsGeo = Array.isArray(startLocation) && startLocation.length === 2;
        const endIsGeo = Array.isArray(endLocation) && endLocation.length === 2;

        const startLocationParam = startLocation === "" ? `${defaultStartLocation[0]},${defaultStartLocation[1]}` : 
                                 (startIsGeo ? `${startLocation[0]},${startLocation[1]}` : encodeURIComponent(startLocation));

        const endLocationParam = endLocation === "" ? `${defaultEndLocation[0]},${defaultEndLocation[1]}` : 
                               (endIsGeo ? `${endLocation[0]},${endLocation[1]}` : encodeURIComponent(endLocation));

        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${startLocationParam}&destination=${endLocationParam}&mode=${mode}&key=${apiKey}`;

        console.log("Fetching from URL:", url);

        const response = await fetch(url);
        console.log("Response status:", response.status); 

        if (!response.ok) {
            throw new Error(`Failed to fetch from Google Maps API: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Google Maps API Response:", data);

        if (data.status !== 'OK') {
            throw new Error(`Google Maps API error: ${data.status}`);
        }

        const route = data.routes[0];
        const legs = route.legs[0];
        const steps = legs.steps.map(step => ({
            distance: step.distance.text,
            duration: step.duration.text,
            instructions: step.html_instructions.replace(/<[^>]+>/g, ''), 
            location: {
                start: step.start_location,
                end: step.end_location
            }
        }));

        console.log("Steps processed:", steps); 

        const journey = Journey.create(legs.start_address, legs.end_address, mode, steps);

        res.status(200).json(journey);
        console.log("Journey response sent");
    } catch (err) {
        console.log("Error occurred:", err.message);
        res.status(500).json({ "error": err.message });
    }
}

module.exports = { getJourneyDirections };