const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    const { NETLIFY_API_TOKEN } = process.env;
    const siteId = process.env.SITE_ID;
    
    try {
        const res = await fetch(
            `https://api.netlify.com/api/v1/sites/${siteId}/forms/sticky-notes/submissions`,
            { headers: { Authorization: `Bearer ${NETLIFY_API_TOKEN}` } }
        );
        const data = await res.json();
        
        return {
            statusCode: 200,
            body: JSON.stringify(data.map(note => ({
                id: note.id,
                name: note.data.sender,
                message: note.data.message,
                images: [
                    note.data.image1,
                    note.data.image2,
                    note.data.image3
                ].filter(Boolean),
                created_at: note.created_at
            })))
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: 'Failed to fetch notes' }) };
    }
};
