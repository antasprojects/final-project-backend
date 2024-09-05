// controllers/interestingFacts.js

const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const InterestingFact = require('../models/InterestingFact');
const Location = require('../models/Location');

require('dotenv').config();

const MODEL_NAME = "gemini-1.5-flash";
const API_KEY = process.env.GEMINI_API_KEY;

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(API_KEY);

async function fetchFacts(location) {
    try {
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });
        const tags = ['Woods', 'Hiking', 'Park', 'Garden', 'Historic', 'Beach', 'Camping', 'Wildlife', 'Farm', 'Rivers']

        const prompt = `Give 1/2 short fun/interesting FACTS not summary about "green place" with this data:
                - Name: ${location.name}
        - Type: ${location.location_type}
        - Address: ${location.address}
        - Latitude: ${location.latitude}
        - Longitude: ${location.longitude}
        - Rating: ${location.rating}
        - Image URL: ${location.image_url || 'No image available'}
        - Tags: ${tags[location.tag_id]} 
        do not use too fancy words if you do not have enough information in ur database make a generic believable fake one
        and do not state that you have not enough details, your description will be used on client side of nature connect app`;

        // console.log(prompt);
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.4,
                topK: 1,
                topP: 1,
                maxOutputTokens: 100,
            },
            safetySettings: [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            ],
        });

        // Log the full response for debugging
        // console.log("AI Response:", JSON.stringify(result, null, 2));

        // Check if candidates exist and extract the content
        if (result.response && result.response.candidates && result.response.candidates.length > 0) {
            const candidate = result.response.candidates[0];
            const content = candidate.content.parts.map(part => part.text).join(' ');
            return content;
        } else {
            console.error("No candidates found in AI response.");
            throw new Error('No candidates found in AI response');
        }
    } catch (error) {
        console.error("Error during AI content generation:", error);
        throw new Error('AI content generation failed');
    }
}
   
async function getFacts(req, res) {

    const id = parseInt(req.params.id);
    const location = await Location.getOneById(id);
    if (!location) {
        return res.status(400).json({ error: 'Location is required' });
    }

    try {
        // console.log(`Fetching facts for location: ${location.name}`);

        // Fetch facts using the AI model
        const facts = await fetchFacts(location);
        // console.log(`Facts fetched: ${facts}`);

         // Temporarily skip database 
         //const newFact = {
         // place_id: null,
         //fact: facts,
         //created_at: new Date(),
         //};
         //const factId = await InterestingFact.create(newFact);
         //console.log(`New fact created with ID: ${factId}`);

        // Directly return the fetched facts without saving to the database
        res.json({ facts });

    } catch (error) {
        console.error('Error during fact fetching:', error.message);
        res.status(500).json({ error: 'Something went wrong!' });
    }
}
async function getInfoById(req, res) {

   try {
        const searchId = parseInt(req.params.id);

       const location = await Location.getOneById(searchId)

       

       const searchResult = await InterestingFact.getOneById(location.tag_id);
       res.json(searchResult);
   } catch (error) {
       res.status(404).json({ error: 'No information found for this ID' });
   }
}


async function fetchDescription(location) {
    try {
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        const tags = ['Woods', 'Hiking', 'Park', 'Garden', 'Historic', 'Beach', 'Camping', 'Wildlife', 'Farm', 'Rivers']

        const prompt = `Summarize the most interesting facts about the following "green place" in 2 sentences:
        - Name: ${location.name}
        - Type: ${location.location_type}
        - Address: ${location.address}
        - Latitude: ${location.latitude}
        - Longitude: ${location.longitude}
        - Rating: ${location.rating}
        - Image URL: ${location.image_url || 'No image available'}
        - Tags: ${tags[location.tag_id]} 

        do not use too fancy words if you do not have enough informations come up with generic descritpion and do not state that you have not enough details, your description will be used on client side of nature connect app `;

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.4,
                topK: 1,
                topP: 1,
                maxOutputTokens: 100,
            },
            safetySettings: [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            ],
        });

        // Log the full response for debugging
        // console.log("AI Response:", JSON.stringify(result, null, 2));

        // Check if candidates exist and extract the content
        if (result.response && result.response.candidates && result.response.candidates.length > 0) {
            const candidate = result.response.candidates[0];
            const content = candidate.content.parts.map(part => part.text).join(' ');
            return content;
        } else {
            console.error("No candidates found in AI response.");
            throw new Error('No candidates found in AI response');
        }
    } catch (error) {
        console.error("Error during AI content generation:", error);
        throw new Error('AI content generation failed');
    }
}

module.exports = {
    fetchDescription,
    getFacts,
    getInfoById,
  
};


