const axios = require('axios');
const formidable = require('formidable');

export const config = {
    api: {
        bodyParser: false, // Disable default parsing for FormData
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
        const place = fields.place ? fields.place[0] : ''; // Formidable parses as arrays
        const description = fields.description ? fields.description[0] : '';
        const image = files.image ? files.image[0] : null;

        if (!place || (!description && !image)) {
            return res.status(400).json({ error: 'Add place and either text or photo' });
        }

        const imageContext = image ? ` (from a photo capturing the scene)` : '';
        const currentTime = new Date().toLocaleString('en-US', { timeZone: 'Europe/Madrid' }); // Adjust for Madrid/Japan as needed

        // Prompt for Hugging Face: Constrains output to PRD structure
        const prompt = `You are an awe-logging AI inspired by Thomas Berry's vision of interconnectedness and the Overview Effect. Given a user's moment of awe in [place: ${place}], generate a formatted "awe log" binnacle as a single, cohesive, copyable paragraph. Use exactly this structure with --- dividers:

Moment in [place] at [time: ${currentTime}]: [User description: ${description}${imageContext}].
Extra: [1-2 facts about the place/experience, including coords (e.g., 40.4154° N, 3.6836° W)].
Reflection: [Short insight on connection/meaning, evoking wonder and oneness, plus 2-3 curiosity questions and an inspirational quote].

Keep it narrative-driven, poetic, concise (under 300 words), and value-packed to encourage sharing. Output ONLY the formatted binnacle text—no extra comments.`;

        // Call Hugging Face Inference API (free, no key for public model)
        const hfResponse = await axios.post(
            'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1',
            { inputs: prompt, parameters: { max_new_tokens: 250, temperature: 0.7 } },
            { headers: { 'Content-Type': 'application/json' } }
        );

        const binnacle = hfResponse.data[0]?.generated_text.trim() || 'Awe generation paused—try again to connect with the moment.';

        return res.status(200).json({ binnacle });
    } catch (error) {
        console.error('Backend error:', error.message);
        return res.status(500).json({ error: 'Failed to generate binnacle. Check console for details.' });
    }
}