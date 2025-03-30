exports.handler = async (event, context) => {
  try {
    // Get the site ID from environment or context
    const siteId = process.env.SITE_ID || context.siteInfo?.id;
    
    if (!siteId) {
      console.error('Site ID not found');
      return { 
        statusCode: 200, 
        body: JSON.stringify([]),
        headers: { 'Content-Type': 'application/json' }
      };
    }
    
    // Get Netlify token from environment
    const netlifyToken = process.env.NETLIFY_TOKEN;
    if (!netlifyToken) {
      console.error('Netlify token not found');
      return { 
        statusCode: 200, 
        body: JSON.stringify([]),
        headers: { 'Content-Type': 'application/json' }
      };
    }
    
    // Fetch form submissions from Netlify API
    const response = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/forms/sticky-notes/submissions`, {
      headers: { 
        'Authorization': `Bearer ${netlifyToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error('API request failed:', await response.text());
      throw new Error('API request failed');
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      console.error('Unexpected API response format:', data);
      return { 
        statusCode: 200, 
        body: JSON.stringify([]),
        headers: { 'Content-Type': 'application/json' }
      };
    }
    
    // Process submissions, specifically for sticky-notes form
    const messages = data
      .filter(sub => !sub.spam)
      .map(sub => ({
        message: sub.data?.message || '',
        sender: sub.data?.sender || 'Anonymous',
        // Include image URLs if present
        images: [
          sub.data?.image1,
          sub.data?.image2,
          sub.data?.image3
        ].filter(Boolean),
        date: sub.created_at || new Date().toISOString()
      }));
    
    return {
      statusCode: 200,
      body: JSON.stringify(messages),
      headers: { 'Content-Type': 'application/json' }
    };
  } catch (err) {
    console.error('Error in getSubmissions function:', err);
    
    return { 
      statusCode: 200, 
      body: JSON.stringify([]),
      headers: { 'Content-Type': 'application/json' }
    };
  }
};
