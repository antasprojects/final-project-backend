const Journey = require('../models/Journey');

async function getJourneyDirections(req, res) {
   
    const { startLocation, endLocation, mode } = req.body;
    try {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(startLocation)}&destination=${encodeURIComponent(endLocation)}&mode=${mode}&key=${apiKey}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch from Google Maps API: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.status !== 'OK') {
            throw new Error(`Google Maps API error: ${data.status}`);
        }

        const route = data.routes[0];
        const legs = route.legs[0];
        const steps = legs.steps.map(step => ({
            distance: step.distance.text,
            duration: step.duration.text,
            instructions: step.html_instructions.replace(/<[^>]+>/g, '')
        }));

        const journey = Journey.create(legs.start_address, legs.end_address, mode, steps);

        res.status(200).json(journey);
        console.log("Journey response sent");
    } catch (err) {
        console.log("Error occurred:", err.message);
        res.status(500).json({ "error": err.message });
    }
}

module.exports = { getJourneyDirections };