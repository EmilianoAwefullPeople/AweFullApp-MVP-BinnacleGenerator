const axios = require('axios');
const formidable = require('formidable');

export const config = {
    api: {
        bodyParser: false, // Handle FormData manually
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const form = new formidable.IncomingForm();
    let fields, files;

    try {
        [fields, files] = await form.parse(req);
        const { place, description } = fields;
        const image = files.image ? files.image[0] : null;

        if (!place || !description) {
            return res.status(400).json({ error: 'Missing place or description' });
        }

        const imageContext = image ? ` (accompanied by a photo of the moment)` : '';
        const currentTime = new Date().toLocaleString('en-US', { timeZone: 'Europe/Madrid' }); // Madrid/Japan aware

        // Hugging Face Prompt: Structured for PRD binnacle format
        const prompt = `You are an awe-journaling AI inspired by Thomas Berry's vision of interconnectedness. Given a user's travel moment, generate a formatted "awe log" binnacle as a single, cohesive paragraph. Structure it exactly like this, using --- dividers:

Moment in [place] at [time]: [User description + image context].
Extra: [1-2 AI facts about the place/experience, drawing from knowledge].
Reflection: [Short AI-aided insight on connection/meaning, evoking wonder and oneness].

Incorporate: coords (e.g., 40.4154° N, 3.6836° W for Madrid spots), a curiosity question, and an inspirational quote. Keep it narrative-driven, encouraging revisit/share. Be poetic yet concise.

User input: Place="${place}", Description="${description}${imageContext}", Time="${currentTime}".

Output ONLY the formatted binnacle text.`;

        // Call Hugging Face (free, public model)
        const hfResponse = await axios.post(
            'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1',
            { inputs: prompt, parameters: { max_new_tokens: 300, temperature: 0.7 } },
            { headers: { 'Content-Type': 'application/json' } }
        );

        const binnacle = hfResponse.data[0]?.generated_text || 'Generation failed—try again for awe-inspired magic.';

        return res.status(200).json({ binnacle });
    } catch (error) {
        console.error('Backend error:', error.message);
        return res.status(500).json({ error: 'Failed to generate binnacle—perhaps the universe is pausing for deeper reflection.' });
    }
}
