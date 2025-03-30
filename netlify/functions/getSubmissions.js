// functions/getSubmissions.js

exports.handler = async (event, context) => {
  try {
    // Get site ID from context - Netlify provides this automatically
    const siteId = context.site.id;
    if (!siteId) {
      console.error('Site ID not found in context');
      return {
        statusCode: 200,
        body: JSON.stringify([]),
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' 
        }
      };
    }

    // Get Netlify token from environment
    const netlifyToken = process.env.NETLIFY_TOKEN;
    if (!netlifyToken) {
      console.error('Netlify token not found');
      return {
        statusCode: 200,
        body: JSON.stringify([]),
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      };
    }

    console.log(`Fetching submissions for site ID: ${siteId}`);

    // Fetch form submissions from Netlify API
    const response = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/forms/`, {
      headers: {
        'Authorization': `Bearer ${netlifyToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API request to get forms failed: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`API request failed: ${response.status}`);
    }

    // Get all forms to find the correct form ID
    const forms = await response.json();
    
    if (!Array.isArray(forms)) {
      console.error('Unexpected forms API response format:', forms);
      return {
        statusCode: 200,
        body: JSON.stringify([]),
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      };
    }

    // Find the form by name (try multiple possible names)
    const noteForm = forms.find(form => 
      form.name === 'sticky-notes' || 
      form.name === 'note-form' || 
      form.name === 'messages'
    );
    
    if (!noteForm) {
      console.error('Sticky notes form not found. Available forms:', forms.map(f => f.name));
      return {
        statusCode: 200,
        body: JSON.stringify([]),
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      };
    }

    console.log(`Found form: ${noteForm.name} with ID: ${noteForm.id}`);

    // Now fetch submissions for this specific form
    const submissionsResponse = await fetch(
      `https://api.netlify.com/api/v1/forms/${noteForm.id}/submissions`, 
      {
        headers: {
          'Authorization': `Bearer ${netlifyToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!submissionsResponse.ok) {
      const errorText = await submissionsResponse.text();
      console.error(`Submissions request failed: ${submissionsResponse.status}`, errorText);
      throw new Error(`Submissions request failed: ${submissionsResponse.status}`);
    }

    const submissionsData = await submissionsResponse.json();
    
    if (!Array.isArray(submissionsData)) {
      console.error('Unexpected submissions response format:', submissionsData);
      return {
        statusCode: 200,
        body: JSON.stringify([]),
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      };
    }

    console.log(`Found ${submissionsData.length} submissions`);

    // Process submissions
    const messages = submissionsData
      .filter(sub => !sub.spam)
      .map(sub => {
        // Generate a random stamp number (1-4) for each message
        const stampNumber = Math.floor(Math.random() * 4) + 1;
        
        // Extract data safely
        const formData = sub.data || {};
        
        // Handle both form field naming conventions
        const message = formData.message || formData.note || '';
        const sender = formData.sender || formData.name || 'Anonymous';
        
        // Process images - check multiple possible field names
        const imageFields = [
          formData.image, 
          formData.image1, 
          formData.image2, 
          formData.image3,
          ...(Array.isArray(formData.images) ? formData.images : [])
        ].filter(Boolean);

        return {
          id: sub.id || `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          message: message,
          sender: sender,
          stamp: `images/stamp${stampNumber}.png`,
          images: imageFields,
          date: sub.created_at || new Date().toISOString()
        };
      });

    // Return the processed messages
    return {
      statusCode: 200,
      body: JSON.stringify(messages),
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    };
  } catch (err) {
    console.error('Error in getSubmissions function:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Unknown error occurred' }),
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
};
