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

    // Now fetch ALL submissions for this specific form
    // Set pagination parameters to ensure we get all submissions
    let allSubmissions = [];
    let page = 0;
    const perPage = 100;
    let hasMore = true;

    while (hasMore) {
      const submissionsResponse = await fetch(
        `https://api.netlify.com/api/v1/forms/${noteForm.id}/submissions?page=${page}&per_page=${perPage}`, 
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

      const pageSubmissions = await submissionsResponse.json();
      
      if (!Array.isArray(pageSubmissions)) {
        console.error('Unexpected submissions response format:', pageSubmissions);
        break;
      }

      allSubmissions = [...allSubmissions, ...pageSubmissions];
      
      // If we got fewer results than the page size, we've reached the end
      if (pageSubmissions.length < perPage) {
        hasMore = false;
      } else {
        page++;
      }
    }

    console.log(`Found ${allSubmissions.length} total submissions`);

    // Add persistent local file storage as backup
    const fs = require('fs');
    const path = require('path');
    
    // Ensure the data directory exists
    const dataDir = path.join('/tmp', 'message-data');
    try {
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
    } catch (err) {
      console.error('Error creating data directory:', err);
      // Continue even if this fails - we'll just rely on Netlify Forms
    }

    // Save submissions to local file as backup
    try {
      fs.writeFileSync(
        path.join(dataDir, 'submissions.json'),
        JSON.stringify(allSubmissions)
      );
    } catch (err) {
      console.error('Error saving submissions to file:', err);
      // Continue even if this fails
    }

    // Process submissions
    const messages = allSubmissions
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

    // Return the processed messages, including a timestamp to aid debugging
    return {
      statusCode: 200,
      body: JSON.stringify({
        messages: messages,
        timestamp: new Date().toISOString(),
        count: messages.length
      }),
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
      body: JSON.stringify({ 
        error: err.message || 'Unknown error occurred',
        timestamp: new Date().toISOString()
      }),
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
};
