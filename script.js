document.addEventListener('DOMContentLoaded', () => {
    // Activate scroll lock immediately
    document.body.classList.add('gift-mode');

    document.getElementById('gift-box').addEventListener('click', () => {
        // Remove gift box and unlock scroll
        document.getElementById('gift-box').style.opacity = 0;
        setTimeout(() => {
            document.getElementById('gift-box').style.display = 'none';
            document.body.classList.remove('gift-mode'); // THIS LINE REMOVES SCROLL LOCK
        }, 300);
        
        document.getElementById('main-site').style.display = 'block';
    });

    // Create shooting stars
    function createStars() {
        const container = document.querySelector('.shooting-stars');
        const starCount = 100; // Doubled the star count for more stars!
        
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.innerHTML = '★';
            
            // Random properties for more variation
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 20}s`; // Even longer delay variation
            star.style.fontSize = `${Math.random() * 2 + 1}rem`; // Even larger stars
            
            container.appendChild(star);
        }
    }
    createStars();

    // Clone memory items for infinite loop
    const memoryTrack = document.querySelector('.carousel-track');
    const memoryItems = memoryTrack.querySelectorAll('.memory-item');
    
    memoryItems.forEach(item => {
        const clone = item.cloneNode(true);
        memoryTrack.appendChild(clone);
    });

    // Memory viewer functionality
    const memoryItems2 = document.querySelectorAll('.memory-item img');
    const memoryViewer = document.querySelector('.memory-viewer');
    const memoryImage = memoryViewer.querySelector('img');
    const memoryCaption = memoryViewer.querySelector('.memory-caption');
    const closeMemory = document.querySelector('.close-memory');
    const viewerOverlay = document.querySelector('.viewer-overlay');
    let isScrollPaused = false;

    // Open memory viewer
    memoryItems2.forEach(img => {
        img.addEventListener('click', () => {
            memoryImage.src = img.src;
            memoryCaption.textContent = img.dataset.caption || img.alt;
            memoryViewer.classList.add('active');
            viewerOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent page scrolling
            
            // Pause all animations
            memoryTrack.classList.add('paused');
            document.querySelector('.message-track').classList.add('paused');
            isScrollPaused = true;
        });
    });

    // Close memory viewer function
    function closeMemoryViewer() {
        memoryViewer.classList.remove('active');
        viewerOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        
        // Resume animations if sticky note is not active
        const stickyContainer = document.querySelector('.sticky-note-container');
        
        if (!stickyContainer.classList.contains('active')) {
            memoryTrack.classList.remove('paused');
            document.querySelector('.message-track').classList.remove('paused');
            isScrollPaused = false;
        }
    }
    
    // Multiple ways to close the viewer
    closeMemory.addEventListener('click', closeMemoryViewer);
    
    memoryViewer.addEventListener('click', (e) => {
        if (e.target === memoryViewer) {
            closeMemoryViewer();
        }
    });

    // Sticky note functionality - we'll attach event listeners after loading messages
    const stickyContainer = document.querySelector('.sticky-note-container');
    const noteContent = document.querySelector('.note-content');
    const noteSender = document.querySelector('.note-sender');
    const noteStamp = document.querySelector('.note-stamp');
    const closeNote = document.querySelector('.close-note');

    // Close note function
    function closeNoteViewer() {
        stickyContainer.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        
        // Resume animations if memory viewer is not active
        if (!memoryViewer.classList.contains('active')) {
            memoryTrack.classList.remove('paused');
            document.querySelector('.message-track').classList.remove('paused');
            isScrollPaused = false;
        }
    }
    
    closeNote.addEventListener('click', closeNoteViewer);

    // Music player with multiple songs
    const music = document.getElementById('music');
    const volumeSlider = document.getElementById('volume');
    const volumeDisplay = document.querySelector('.volume-level');
    const playBtn = document.getElementById('play-btn');
    let isPlaying = false;
    
    // Create playlist of songs
    const playlist = [
        "music/Bruno Major - To Let A Good Thing Die (Instrumental).mp3",
        "music/Sparks_(Instrumental).mp3",
        // Add more songs here
    ];
    
    let currentSongIndex = 0;
    
    // Function to load and play the current song
    function loadSong(index) {
        music.src = playlist[index];
        music.load();
        if (isPlaying) {
            music.play();
        }
    }
    
    // Add next and previous song buttons
    const musicControls = document.querySelector('.music-controls');
    
    // Create previous button
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '<i class="fas fa-step-backward"></i>';
    prevBtn.className = 'music-nav-btn prev-btn';
    prevBtn.title = "Previous Song";
    
    // Create next button
    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = '<i class="fas fa-step-forward"></i>';
    nextBtn.className = 'music-nav-btn next-btn';
    nextBtn.title = "Next Song";
    
    // Create song title display
    const songTitle = document.createElement('div');
    songTitle.className = 'song-title';
    songTitle.textContent = "Song 1";
    
    // Add buttons to controls
    musicControls.appendChild(prevBtn);
    musicControls.appendChild(nextBtn);
    musicControls.appendChild(songTitle);
    
    // Update song title display
    function updateSongTitle() {
        const filename = playlist[currentSongIndex].split('/').pop().replace('.mp3', '');
        songTitle.textContent = filename;
    }
    
    // Initialize song title
    updateSongTitle();
    
    // Previous song button event
    prevBtn.addEventListener('click', () => {
        currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
        loadSong(currentSongIndex);
        updateSongTitle();
    });
    
    // Next song button event
    nextBtn.addEventListener('click', () => {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
        loadSong(currentSongIndex);
        updateSongTitle();
    });
    
    // When song ends, play next song
    music.addEventListener('ended', () => {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
        loadSong(currentSongIndex);
        updateSongTitle();
    });

    // Set default volume to 50%
    music.volume = 0.5;
    
    // Auto play music when page loads (may be blocked by browsers)
    window.addEventListener('click', () => {
        if (!isPlaying) {
            music.play().catch(err => {
                console.log("Auto-play prevented by browser:", err);
            });
            playBtn.classList.add('playing');
            isPlaying = true;
        }
    }, { once: true });
    
    // Play/pause toggle with icon change
    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            music.pause();
            playBtn.classList.remove('playing');
        } else {
            music.play().catch(err => {
                console.log("Play prevented by browser:", err);
            });
            playBtn.classList.add('playing');
        }
        isPlaying = !isPlaying;
    });
    
    // Volume control with percentage display for vertical slider
    volumeSlider.addEventListener('input', () => {
        const volumeValue = volumeSlider.value;
        music.volume = volumeValue;
        volumeDisplay.textContent = `${Math.round(volumeValue * 100)}%`;
    });

    // Handle keyboard events for accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (memoryViewer.classList.contains('active')) {
                closeMemoryViewer();
            }
            if (stickyContainer.classList.contains('active')) {
                closeNoteViewer();
            }
            
            // Resume animations if both viewers are closed
            if (!memoryViewer.classList.contains('active') && !stickyContainer.classList.contains('active')) {
                document.querySelector('.carousel-track').classList.remove('paused');
                document.querySelector('.message-track').classList.remove('paused');
                isScrollPaused = false;
            }
        }
    });

    // Preload images to ensure smooth transitions
    function preloadImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            const src = img.getAttribute('src');
            if (src) {
                const newImg = new Image();
                newImg.src = src;
            }
        });
    }
    preloadImages();

    // Sticky note form functionality
    const openNoteBtn = document.getElementById('open-note-form');
    const noteFormContainer = document.querySelector('.sticky-note-form-container');
    const addImagesBtn = document.getElementById('add-images');
    const imageUpload = document.getElementById('image-upload');
    const imagePreviewContainer = document.querySelector('.image-preview-container');
    let uploadedImages = [];

    // Open form
    openNoteBtn.addEventListener('click', () => {
        noteFormContainer.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Image upload handling
    addImagesBtn.addEventListener('click', () => imageUpload.click());

    imageUpload.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        const remainingSlots = 3 - uploadedImages.length;
        
        if (files.length > remainingSlots) {
            alert(`You can only add ${remainingSlots} more images`);
            return;
        }

        files.slice(0, remainingSlots).forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imgContainer = document.createElement('div');
                imgContainer.className = 'image-preview';
                imgContainer.innerHTML = `
                    <img src="${event.target.result}" alt="Preview">
                    <button class="remove-image">&times;</button>
                `;
                imagePreviewContainer.appendChild(imgContainer);
                
                imgContainer.querySelector('.remove-image').addEventListener('click', () => {
                    imgContainer.remove();
                    uploadedImages = uploadedImages.filter(img => img !== file);
                    updateImageCounter();
                });
            };
            reader.readAsDataURL(file);
            uploadedImages.push(file);
        });
        
        updateImageCounter();
    });

    function updateImageCounter() {
        addImagesBtn.innerHTML = `<i class="fas fa-plus"></i> Add Images (${uploadedImages.length}/3)`;
    }

    // Close form
    noteFormContainer.querySelector('.close-note').addEventListener('click', () => {
        noteFormContainer.classList.remove('active');
        document.body.style.overflow = '';
    });

    // IMPROVED FORM HANDLER with error handling
    document.getElementById('note-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Show loading indicator
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending...';
        submitBtn.disabled = true;
        
        try {
            // 1. Get form data
            const formData = new FormData(e.target);
            const message = formData.get('message');
            const sender = formData.get('sender');
            
            // Validate input
            if (!message || !sender) {
                throw new Error('Please fill in both message and sender name');
            }
            
            // Process any uploaded images
            const imageFiles = Array.from(document.querySelectorAll('.image-preview img'))
                .map(img => img.src);
            
            // Add image data to formData if present
            imageFiles.forEach((file, index) => {
                formData.append(`image${index + 1}`, file);
            });
            
            // 2. Generate a random stamp (1-4)
            const stampNumber = Math.floor(Math.random() * 4) + 1;
            const stampUrl = `images/stamp${stampNumber}.png`;
            
            // 3. Add to carousel IMMEDIATELY for instant feedback
            const newMsg = document.createElement('div');
            newMsg.className = 'message';
            newMsg.dataset.msg = message;
            newMsg.dataset.sender = sender;
            newMsg.dataset.stamp = stampUrl;
            newMsg.innerHTML = `<span>A message from ${sender}</span>`;
            
            // Add it to both the original and cloned parts of the track
            const messageTrack = document.querySelector('.message-track');
            messageTrack.prepend(newMsg);
            
            // Clone it once more for the infinite scroll
            const clone = newMsg.cloneNode(true);
            messageTrack.appendChild(clone);
            
            // Attach click event to the new messages
            [newMsg, clone].forEach(item => {
                item.addEventListener('click', () => {
                    noteContent.textContent = item.dataset.msg;
                    noteSender.textContent = `- ${item.dataset.sender}`;
                    noteStamp.style.backgroundImage = `url(${item.dataset.stamp})`;
                    stickyContainer.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    
                    // Pause all animations
                    document.querySelector('.carousel-track').classList.add('paused');
                    document.querySelector('.message-track').classList.add('paused');
                });
            });
            
            // 4. Submit to Netlify
            // Set form attribute to ensure it's directed to the correct form
            formData.append('form-name', 'sticky-notes');
            
            const response = await fetch('/', {
                method: 'POST',
                body: new URLSearchParams(formData),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Form submission error:', errorText);
                throw new Error(`Form submission failed: ${response.status}`);
            } else {
                console.log('Message submitted successfully!');
            }
            
            // 5. Reset form and close it
            e.target.reset();
            document.querySelector('.image-preview-container').innerHTML = '';
            uploadedImages = [];
            updateImageCounter();
            document.querySelector('.sticky-note-form-container').classList.remove('active');
            document.body.style.overflow = '';
            
            // Show confirmation to user
            alert('Your message has been added!');
        } catch (err) {
            console.error("Form submission failed:", err);
            alert(`Error: ${err.message || 'Something went wrong. Please try again.'}`);
        } finally {
            // Restore submit button
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });

    // IMPROVED LOAD EXISTING MESSAGES function with better error handling
    async function loadMessages() {
        // Show loading indicator
        const messageTrack = document.querySelector('.message-track');
        const loadingMsg = document.createElement('div');
        loadingMsg.className = 'loading-message';
        loadingMsg.textContent = 'Loading messages...';
        messageTrack.innerHTML = '';
        messageTrack.appendChild(loadingMsg);
        
        try {
            const response = await fetch('/netlify/functions/getSubmissions');
            
            if (!response.ok) {
                throw new Error(`Failed to load messages: ${response.status} ${response.statusText}`);
            }
            
            const messages = await response.json();
            
            // Remove loading indicator
            messageTrack.innerHTML = '';
            
            if (!Array.isArray(messages) || messages.length === 0) {
                console.log("No existing messages found");
                const noMessages = document.createElement('div');
                noMessages.className = 'message';
                noMessages.innerHTML = '<span>No messages yet. Be the first!</span>';
                messageTrack.appendChild(noMessages);
                return;
            }
            
            console.log(`Loaded ${messages.length} messages`);
            
            // Add real messages from submissions
            messages.forEach(msg => {
                if (!msg.message || !msg.sender) return;
                
                // Use provided stamp or generate a random one
                const stampUrl = msg.stamp || `images/stamp${Math.floor(Math.random() * 4) + 1}.png`;
                
                const div = document.createElement('div');
                div.className = 'message';
                div.dataset.msg = msg.message;
                div.dataset.sender = msg.sender;
                div.dataset.stamp = stampUrl;
                div.innerHTML = `<span>A message from ${msg.sender}</span>`;
                messageTrack.appendChild(div);
                
                // Add click event to view the message
                div.addEventListener('click', () => {
                    noteContent.textContent = div.dataset.msg;
                    noteSender.textContent = `- ${div.dataset.sender}`;
                    noteStamp.style.backgroundImage = `url(${div.dataset.stamp})`;
                    stickyContainer.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    
                    // Pause all animations
                    document.querySelector('.carousel-track').classList.add('paused');
                    document.querySelector('.message-track').classList.add('paused');
                });
            });
            
            // Clone messages for infinite scroll
            const messageItems = messageTrack.querySelectorAll('.message');
            messageItems.forEach(item => {
                const clone = item.cloneNode(true);
                messageTrack.appendChild(clone);
                
                // Need to add the event listener to the clone as well
                clone.addEventListener('click', () => {
                    noteContent.textContent = clone.dataset.msg;
                    noteSender.textContent = `- ${clone.dataset.sender}`;
                    noteStamp.style.backgroundImage = `url(${clone.dataset.stamp})`;
                    stickyContainer.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    
                    // Pause all animations
                    document.querySelector('.carousel-track').classList.add('paused');
                    document.querySelector('.message-track').classList.add('paused');
                });
            });
        } catch (err) {
            console.error("Error loading messages:", err);
            
            // Clear loading message and show error
            messageTrack.innerHTML = '';
            const errorMsg = document.createElement('div');
            errorMsg.className = 'message error';
            errorMsg.innerHTML = '<span>Could not load messages. Please refresh the page.</span>';
            messageTrack.appendChild(errorMsg);
        }
    }

    // Call loadMessages after DOMContentLoaded
    loadMessages();
});
