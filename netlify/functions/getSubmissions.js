exports.handler = async () => {
  try {
    const response = await fetch(`https://api.netlify.com/api/v1/sites/${process.env.SITE_ID}/submissions`, {
      headers: { 
        'Authorization': `Bearer ${process.env.NETLIFY_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    const verified = data.filter(sub => !sub.spam);
    
    return {
      statusCode: 200,
      body: JSON.stringify(verified)
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
