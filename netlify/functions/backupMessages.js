// functions/backupMessages.js - Add this as a new serverless function

const { schedule } = require('@netlify/functions');
const fs = require('fs');
const path = require('path');

// This function runs on a schedule (once per day)
const handler = async function(event, context) {
  try {
    console.log('Running scheduled backup...');

    // Get site ID and token
    const siteId = context.site.id;
    const netlifyToken = process.env.NETLIFY_TOKEN;

    if (!siteId || !netlifyToken) {
      throw new Error('Missing site ID or Netlify token');
    }

    // Fetch all forms
    const formsResponse = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/forms/`, {
      headers: {
        'Authorization': `Bearer ${netlifyToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!formsResponse.ok) {
      throw new Error(`Failed to fetch forms: ${formsResponse.status}`);
    }

    const forms = await formsResponse.json();
    
    // Find our form
    const noteForm = forms.find(form => 
      form.name === 'sticky-notes' || 
      form.name === 'note-form' || 
      form.name === 'messages'
    );

    if (!noteForm) {
      throw new Error('Form not found');
    }

    // Fetch all submissions
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
        throw new Error(`Failed to fetch submissions: ${submissionsResponse.status}`);
      }

      const pageSubmissions = await submissionsResponse.json();
      
      if (!Array.isArray(pageSubmissions)) {
        throw new Error('Invalid submissions response');
      }

      allSubmissions = [...allSubmissions, ...pageSubmissions];
      
      if (pageSubmissions.length < perPage) {
        hasMore = false;
      } else {
        page++;
      }
    }

    // Process submissions to match our format
    const messages = allSubmissions
      .filter(sub => !sub.spam)
      .map(sub => {
        const formData = sub.data || {};
        const message = formData.message || formData.note || '';
        const sender = formData.sender || formData.name || 'Anonymous';
        
        const imageFields = [
          formData.image, 
          formData.image1, 
          formData.image2, 
          formData.image3,
          ...(Array.isArray(formData.images) ? formData.images : [])
        ].filter(Boolean);

        return {
          id: sub.id,
          message: message,
          sender: sender,
          images: imageFields,
          date: sub.created_at || new Date().toISOString()
        };
      });

    // Create a backup object with metadata
    const backup = {
      timestamp: new Date().toISOString(),
      siteId: siteId,
      formId: noteForm.id,
      formName: noteForm.name,
      messageCount: messages.length,
      messages: messages
    };

    // Save to a persistent storage location (here we use /tmp, but in production
    // you would use a more permanent storage like S3, database, etc.)
    const backupDir = path.join('/tmp', 'message-backups');
    
    try {
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      
      const filename = `backup-${new Date().toISOString().replace(/:/g, '-')}.json`;
      fs.writeFileSync(
        path.join(backupDir, filename),
        JSON.stringify(backup, null, 2)
      );
      
      console.log(`Backup saved to ${filename}`);
    } catch (err) {
      console.error('Error saving backup file:', err);
      throw err;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: `Backup completed with ${messages.length} messages`,
        timestamp: new Date().toISOString()
      })
    };
  } catch (err) {
    console.error('Backup failed:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false, 
        error: err.message || 'Unknown error'
      })
    };
  }
};

// Run once per day (at midnight)
exports.handler = schedule('0 0 * * *', handler);
