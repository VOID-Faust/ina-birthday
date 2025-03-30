exports.handler = async () => {
  try {
    const siteId = process.env.SITE_ID || context.siteInfo.id;
    const response = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/submissions`, {
      headers: { 
        'Authorization': `Bearer ${process.env.NETLIFY_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error('API request failed');
    
    const data = await response.json();
    if (!Array.isArray(data)) return { statusCode: 200, body: JSON.stringify([]) };
    
    const verified = data.filter(sub => !sub.spam && sub.data);
    return {
      statusCode: 200,
      body: JSON.stringify(verified.map(sub => ({
        message: sub.data?.message,
        sender: sub.data?.sender
      })))
    };
  } catch (err) {
    return { statusCode: 200, body: JSON.stringify([]) }; // Fail gracefully
  }
};
