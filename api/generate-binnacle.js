const axios = require('axios');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    const { place, description, image } = req.body; // For now, assume form data is parsed (we'll adjust below)

    try {
        // Mock image analysis (in MVP, we'll skip deep AI image processing)
        const imageContext = image ? 'A photo was included' : 'No photo provided';

        // Fetch OpenStreetMap data (coords and description)
        const osmResponse = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}&limit=1`);
        const locationData = osmResponse.data[0];
        const coords = locationData ? `${locationData.lat}° N, ${locationData.lon}° W` : 'Coords unavailable';
        const placeDesc = locationData ? locationData.display_name : place;

        // Fetch Wikipedia facts (simplified to 2-4 sentences)
        const wikiResponse = await axios.get(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${encodeURIComponent(place)}&format=json&exsentences=4`);
        const page = Object.values(wikiResponse.data.query.pages)[0];
        const facts = page ? page.extract.split('\n').filter(f => f.trim()).slice(0, 4) : ['No facts available'];

        // Fetch Quotable quote
        const quoteResponse = await axios.get('https://api.quotable.io/random?maxLength=100');
        const quote = quoteResponse.data.content;

        // Mock Hugging Face AI (use a simple template for MVP)
        const reflection = `This moment of ${description} connects you to the broader tapestry of life, inviting wonder.`;
        const curiosityQuestions = [
            `How does ${place} shape your sense of place?`,
            `What other memories does this evoke?`
        ];

        // Assemble binnacle
        const binnacle = `
Moment: ${placeDesc} at [current time] --- 
Coordinates: ${coords} --- 
Description: ${description} ${imageContext} --- 
Your Words: "${description}" --- 
Facts: ${facts.join(' ')} --- 
Curiosity Sparks: ${curiosityQuestions.join(' ')} --- 
Insight Quote: "${quote}" --- 
Meaning: ${reflection}
        `.trim();

        return res.status(200).json({ binnacle });
    } catch (error) {
        console.error('Backend error:', error);
        return res.status(500).json({ error: 'Failed to generate binnacle' });
    }
}
