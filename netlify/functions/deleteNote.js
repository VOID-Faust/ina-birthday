const fetch = require('node-fetch');
const bcrypt = require('bcryptjs');

exports.handler = async (event, context) => {
    const { NETLIFY_API_TOKEN } = process.env;
    const siteId = process.env.SITE_ID;
    const { id, password } = JSON.parse(event.body);
    
    try {
        // 1. Fetch the note to verify password
        const res = await fetch(
            `https://api.netlify.com/api/v1/sites/${siteId}/submissions/${id}`,
            { headers: { Authorization: `Bearer ${NETLIFY_API_TOKEN}` } }
        );
        const note = await res.json();
        
        // 2. Check password
        const passwordMatches = await bcrypt.compare(password, note.data.deletePassword);
        if (!passwordMatches) {
            return { statusCode: 401, body: JSON.stringify({ error: 'Incorrect password' }) };
        }
        
        // 3. Delete if password is correct
        await fetch(
            `https://api.netlify.com/api/v1/sites/${siteId}/submissions/${id}`,
            { method: 'DELETE', headers: { Authorization: `Bearer ${NETLIFY_API_TOKEN}` } }
        );
        
        return { statusCode: 200, body: JSON.stringify({ success: true }) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: 'Failed to delete note' }) };
    }
};
