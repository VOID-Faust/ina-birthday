document.addEventListener('DOMContentLoaded', () => {
    // Messages data structure - add all your friends' messages here
    const friendMessages = {
        friend1: {
            name: "Friend 1's Name",
            message: "Your personalized birthday message for Ina from Friend 1. Add more text as needed to fill out the message with memories and well wishes.",
            photos: ["images/ina_image6.jpg", "images/friend1_photo2.jpg", "images/friend1_photo3.jpg"]
        },
        friend2: {
            name: "Friend 2's Name",
            message: "Another personalized birthday message from Friend 2. Share special memories and birthday wishes.",
            photos: ["images/friend2_photo1.jpg", "images/friend2_photo2.jpg"]
        },
        friend3: {
            name: "Friend 3's Name",
            message: "Another personalized birthday message from Friend 3. Share special memories and birthday wishes.",
            photos: ["images/friend2_photo1.jpg", "images/friend2_photo2.jpg"]
        }
        // Add more friends as needed
    };

    // Gift box functionality - IMPROVED for faster animations and to play music on open
    const giftBox = document.getElementById('gift-box');
    const music = document.getElementById('music');
    let isPlaying = false;
    
    if (giftBox) {
        // Activate scroll lock immediately
        document.body.classList.add('gift-mode');
        
        giftBox.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            giftBox.style.opacity = '0';
            
            // Play music when gift box is opened
            if (music && !isPlaying) {
                music.play().catch(err => console.log("Auto-play prevented:", err));
                const playBtn = document.getElementById('play-btn');
                if (playBtn) playBtn.classList.add('playing');
                isPlaying = true;
            }
            
            // Faster transition (reduced from 300ms to 150ms)
            setTimeout(() => {
                giftBox.style.display = 'none';
                document.body.classList.remove('gift-mode');
            }, 150);
        });
    }

    // Create shooting stars
    function createStars() {
        const container = document.querySelector('.shooting-stars');
        if (!container) return;

        const starCount = 100;
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.innerHTML = '★';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 20}s`;
            star.style.fontSize = `${Math.random() * 2 + 1}rem`;
            container.appendChild(star);
        }
    }
    createStars();

    // Clone memory items for infinite loop
    const memoryTrack = document.querySelector('.carousel-track');
    if (memoryTrack) {
        const memoryItems = memoryTrack.querySelectorAll('.memory-item');
        memoryItems.forEach(item => {
            const clone = item.cloneNode(true);
            memoryTrack.appendChild(clone);
        });
    }

    // Memory viewer functionality
    const memoryViewer = document.querySelector('.memory-viewer');
    if (memoryViewer) {
        const memoryItems = document.querySelectorAll('.memory-item img');
        const memoryImage = memoryViewer.querySelector('img');
        const memoryCaption = memoryViewer.querySelector('.memory-caption');
        const closeMemory = memoryViewer.querySelector('.close-memory');
        const viewerOverlay = document.querySelector('.viewer-overlay');
        let isScrollPaused = false;

        // Open memory viewer
        memoryItems.forEach(img => {
            img.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent event bubbling
                memoryImage.src = img.src;
                memoryCaption.textContent = img.dataset.caption || img.alt;
                memoryViewer.classList.add('active');
                if (viewerOverlay) viewerOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                if (memoryTrack) memoryTrack.classList.add('paused');
                isScrollPaused = true;
            });
        });

        // Close memory viewer function
        function closeMemoryViewer() {
            memoryViewer.classList.remove('active');
            if (viewerOverlay) viewerOverlay.classList.remove('active');
            document.body.style.overflow = '';
            
            const stickyContainer = document.querySelector('.sticky-note-container');
            if (!stickyContainer || !stickyContainer.classList.contains('active')) {
                if (memoryTrack) memoryTrack.classList.remove('paused');
                isScrollPaused = false;
            }
        }
        
        closeMemory.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            closeMemoryViewer();
        });
        
        memoryViewer.addEventListener('click', (e) => {
            if (e.target === memoryViewer) closeMemoryViewer();
        });
    }

    // Sticky note functionality
    const stickyContainer = document.querySelector('.sticky-note-container');
    if (stickyContainer) {
        const messages = document.querySelectorAll('.message');
        const noteContent = document.querySelector('.note-content');
        const noteSender = document.querySelector('.note-sender');
        const closeNote = document.querySelector('.close-note');

        messages.forEach(msg => {
            msg.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent event bubbling
                noteContent.textContent = msg.dataset.msg;
                noteSender.textContent = `- ${msg.dataset.sender}`;
                stickyContainer.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                if (memoryTrack) memoryTrack.classList.add('paused');
                isScrollPaused = true;
            });
        });

        function closeNoteViewer() {
            stickyContainer.classList.remove('active');
            document.body.style.overflow = '';
            
            if (!memoryViewer || !memoryViewer.classList.contains('active')) {
                if (memoryTrack) memoryTrack.classList.remove('paused');
                isScrollPaused = false;
            }
        }
        
        closeNote.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            closeNoteViewer();
        });
    }

    // Music player functionality
    if (music) {
        const volumeSlider = document.getElementById('volume');
        const volumeDisplay = document.querySelector('.volume-level');
        const playBtn = document.getElementById('play-btn');
        
        const playlist = [
            "music/Sparks_(Instrumental).mp3",
            "music/Bruno Major - To Let A Good Thing Die (Instrumental).mp3"
        ];
        
        let currentSongIndex = 0;
        
        function loadSong(index) {
            music.src = playlist[index];
            music.load();
            if (isPlaying) music.play();
        }
        
        const musicControls = document.querySelector('.music-controls');
        if (musicControls) {
            const prevBtn = document.createElement('button');
            prevBtn.innerHTML = '<i class="fas fa-step-backward"></i>';
            prevBtn.className = 'music-nav-btn prev-btn';
            prevBtn.title = "Previous Song";
            
            const nextBtn = document.createElement('button');
            nextBtn.innerHTML = '<i class="fas fa-step-forward"></i>';
            nextBtn.className = 'music-nav-btn next-btn';
            nextBtn.title = "Next Song";
            
            const songTitle = document.createElement('div');
            songTitle.className = 'song-title';
            
            musicControls.appendChild(prevBtn);
            musicControls.appendChild(nextBtn);
            musicControls.appendChild(songTitle);
            
            function updateSongTitle() {
                const filename = playlist[currentSongIndex].split('/').pop().replace('.mp3', '');
                songTitle.textContent = filename;
            }
            
            updateSongTitle();
            
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent event bubbling
                currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
                loadSong(currentSongIndex);
                updateSongTitle();
            });
            
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent event bubbling
                currentSongIndex = (currentSongIndex + 1) % playlist.length;
                loadSong(currentSongIndex);
                updateSongTitle();
            });
            
            music.addEventListener('ended', () => {
                currentSongIndex = (currentSongIndex + 1) % playlist.length;
                loadSong(currentSongIndex);
                updateSongTitle();
            });

            music.volume = 0.5;
            
            // Removed auto-play on window click since we now play music when gift box is opened
            
            playBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent event bubbling
                if (isPlaying) {
                    music.pause();
                    playBtn.classList.remove('playing');
                } else {
                    music.play().catch(err => console.log("Play prevented:", err));
                    playBtn.classList.add('playing');
                }
                isPlaying = !isPlaying;
            });
            
            volumeSlider.addEventListener('input', () => {
                const volumeValue = volumeSlider.value;
                music.volume = volumeValue;
                volumeDisplay.textContent = `${Math.round(volumeValue * 100)}%`;
            });
        }
    }

    // Enhanced mail photo viewer functionality - FIXED to only work when envelope is open
    function setupMailPhotoViewer() {
        const memoryViewer = document.querySelector('.memory-viewer');
        const memoryImage = memoryViewer?.querySelector('img');
        const memoryCaption = memoryViewer?.querySelector('.memory-caption');
        const viewerOverlay = document.querySelector('.viewer-overlay');
        
        // Function to handle mail photo clicks
        document.addEventListener('click', (e) => {
            const envelope = document.querySelector('.envelope');
            
            // Only allow photo clicks when the envelope is open
            if (envelope && envelope.classList.contains('open') && e.target.classList.contains('letter-photo')) {
                const clickedPhoto = e.target;
                
                // Use the existing memory viewer
                if (memoryViewer && memoryImage && memoryCaption) {
                    memoryImage.src = clickedPhoto.src;
                    memoryCaption.textContent = clickedPhoto.alt;
                    memoryViewer.classList.add('active');
                    if (viewerOverlay) viewerOverlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    
                    if (memoryTrack) memoryTrack.classList.add('paused');
                }
                
                // Stop event from closing the envelope
                e.stopPropagation();
            }
        });
    }
    setupMailPhotoViewer();
    
    // Function to enhance envelope experience with direct transition to focused view
    // IMPROVED for faster animations
    function enhanceEnvelopeExperience() {
        const envelope = document.querySelector('.envelope');
        const messagesSection = document.querySelector('.messages-container');
        if (!envelope || !messagesSection) return;

        // Create overlay for focusing on letter content
        const letterOverlay = document.createElement('div');
        letterOverlay.className = 'letter-focus-overlay';
        letterOverlay.style.display = 'none';
        document.body.appendChild(letterOverlay);
        
        // Add styles for letter focus mode with IMPROVED animations
        const focusStyles = document.createElement('style');
        focusStyles.textContent = `
            .letter-focus-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                z-index: 999;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            
            .letter-focus-content {
                background: white;
                width: 90%;
                max-width: 800px;
                max-height: 90vh;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
                position: relative;
                overflow-y: auto;
                transform: scale(1.05);
                animation: letter-appear 0.3s forwards;
            }
            
            @keyframes letter-appear {
                from { transform: scale(0.95); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            
            .letter-focus-close {
                position: absolute;
                top: 15px;
                right: 15px;
                width: 30px;
                height: 30px;
                background: #ff4757;
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }
            
            .letter-focus-close:hover {
                background: #ff6b6b;
            }
            
            .letter-focus-photos {
                display: flex;
                flex-wrap: wrap;
                gap: 15px;
                margin-top: 20px;
                justify-content: center;
            }
            
            .letter-focus-photos img {
                width: 200px;
                height: auto;
                border-radius: 5px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                transition: transform 0.2s ease;
                cursor: pointer;
            }
            
            .letter-focus-photos img:hover {
                transform: scale(1.05);
            }
            
            .letter-focus-message {
                line-height: 1.6;
                font-size: 18px;
                margin-bottom: 20px;
            }
            
            .letter-focus-from {
                text-align: right;
                font-style: italic;
                margin-top: 30px;
                color: #666;
            }
            
            /* IMPROVED animation for envelope opening and closing */
            .envelope {
                transition: transform 0.3s ease, opacity 0.3s ease;
            }
            
            .envelope.opening {
                animation: envelope-opening 0.3s forwards;
            }
            
            .envelope.closing {
                animation: envelope-closing 0.3s forwards;
            }
            
            @keyframes envelope-opening {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            
            @keyframes envelope-closing {
                0% { transform: scale(1); }
                50% { transform: scale(0.95); }
                100% { transform: scale(1); }
            }
            
            /* Hide footers and bottom elements */
            footer, .gift-box-preview, .message-preview-section, .bottom-previews {
                display: none !important;
            }
        `;
        document.head.appendChild(focusStyles);

        // Function to show focused letter with direct transition
        function showFocusedLetter(friendId) {
            const friend = friendMessages[friendId];
            if (!friend) return;
            
            // First show envelope opening animation
            envelope.classList.add('opening');
            envelope.classList.add('open');
            envelope.classList.remove('closed');
            
            // IMPROVED: Wait for animation to complete before showing focused view (reduced from 600ms to 300ms)
            setTimeout(() => {
                // Create focused letter content
                letterOverlay.innerHTML = '';
                
                const focusedContent = document.createElement('div');
                focusedContent.className = 'letter-focus-content';
                
                const closeButton = document.createElement('button');
                closeButton.className = 'letter-focus-close';
                closeButton.innerHTML = '×';
                closeButton.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent event bubbling
                    closeLetterFocus();
                });
                
                const messageText = document.createElement('div');
                messageText.className = 'letter-focus-message';
                messageText.textContent = friend.message;
                
                const fromText = document.createElement('div');
                fromText.className = 'letter-focus-from';
                fromText.textContent = `From: ${friend.name}`;
                
                focusedContent.appendChild(closeButton);
                focusedContent.appendChild(messageText);
                
                // Add photos if available
                if (friend.photos && friend.photos.length > 0) {
                    const photosContainer = document.createElement('div');
                    photosContainer.className = 'letter-focus-photos';
                    
                    friend.photos.forEach(photoSrc => {
                        const img = document.createElement('img');
                        img.src = photoSrc;
                        img.alt = `Photo from ${friend.name}`;
                        img.addEventListener('click', (e) => {
                            e.stopPropagation(); // Prevent event bubbling
                            if (memoryViewer && memoryViewer.querySelector('img') && memoryViewer.querySelector('.memory-caption')) {
                                memoryViewer.querySelector('img').src = photoSrc;
                                memoryViewer.querySelector('.memory-caption').textContent = `Photo from ${friend.name}`;
                                memoryViewer.classList.add('active');
                                
                                const viewerOverlay = document.querySelector('.viewer-overlay');
                                if (viewerOverlay) viewerOverlay.classList.add('active');
                            }
                        });
                        photosContainer.appendChild(img);
                    });
                    
                    focusedContent.appendChild(photosContainer);
                }
                
                focusedContent.appendChild(fromText);
                letterOverlay.appendChild(focusedContent);
                
                // Show the overlay
                letterOverlay.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                
                // Add click event to close when clicking outside content
                letterOverlay.addEventListener('click', (e) => {
                    if (e.target === letterOverlay) {
                        closeLetterFocus();
                    }
                });
            }, 300); // IMPROVED: Match this timing with the envelope opening animation duration
        }
        
        // Function to close letter focus and envelope
        function closeLetterFocus() {
            letterOverlay.style.display = 'none';
            document.body.style.overflow = '';
            
            // Close the envelope with animation
            envelope.classList.remove('opening');
            envelope.classList.add('closing');
            envelope.classList.remove('open');
            envelope.classList.add('closed');
            
            // Reset classes after animation completes (reduced from 600ms to 300ms)
            setTimeout(() => {
                envelope.classList.remove('closing');
            }, 300);
        }
        
        // Add click event for Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && letterOverlay.style.display !== 'none') {
                closeLetterFocus();
            }
        });
        
        // FIXED: Modify event listener for the messages section
        messagesSection.addEventListener('click', function(e) {
            // If the click is outside the envelope and message items
            if (!e.target.closest('.envelope-container') && 
                !e.target.closest('.message-item') && 
                envelope.classList.contains('open')) {
                closeLetterFocus();
            }
        });
        
        // FIXED: Modify the envelope-container click handler
        const envelopeContainer = document.querySelector('.envelope-container');
        if (envelopeContainer) {
            envelopeContainer.addEventListener('click', function(e) {
                // Only trigger if specifically clicking on the envelope itself
                if (e.target.closest('.envelope') && 
                    !e.target.classList.contains('letter-photo') && 
                    !envelope.classList.contains('open')) {
                    
                    // Get the active friend button
                    const currentFriendId = document.querySelector('.friend-btn.active')?.dataset.friend;
                    if (currentFriendId) {
                        showFocusedLetter(currentFriendId);
                    }
                    
                    e.stopPropagation();
                }
            });
        }
        
        return showFocusedLetter;
    }
    
    // FIXED: Modified to prevent automatic opening
    function showFriendMessage(friendId) {
        // Do NOT automatically open the message when friend is selected
        // Just highlight the friend button
        
        // Set the corresponding friend button to active
        document.querySelectorAll('.friend-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.friend === friendId) {
                btn.classList.add('active');
            }
        });
    }
    
    // Create message list
    function createMessageList() {
        const messageGrid = document.querySelector('.message-grid');
        if (!messageGrid) return;
        
        messageGrid.innerHTML = ''; // Clear existing content
        
        // Add styles for the message list
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .message-grid {
                display: flex;
                flex-direction: column;
                gap: 10px;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
            }
            
            .message-item {
                background: linear-gradient(145deg, #f8f9fa, #e9ecef);
                border-radius: 10px;
                padding: 15px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                cursor: pointer;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                display: flex;
                align-items: center;
            }
            
            .message-item:hover {
                transform: translateY(-3px);
                box-shadow: 0 6px 12px rgba(0,0,0,0.1);
            }
            
            .message-avatar {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: #ff6b6b;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                margin-right: 15px;
                flex-shrink: 0;
            }
            
            .message-details {
                flex-grow: 1;
            }
            
            .message-sender {
                font-weight: bold;
                font-size: 16px;
                color: #333;
                margin-bottom: 5px;
            }
            
            .message-preview {
                color: #666;
                font-size: 14px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        `;
        document.head.appendChild(styleElement);
        
        // Add message items for each friend
        for (const [friendId, data] of Object.entries(friendMessages)) {
            const messageItem = document.createElement('div');
            messageItem.className = 'message-item';
            messageItem.dataset.friend = friendId;
            
            // Get initials for avatar
            const initials = data.name.split(' ').map(n => n[0]).join('').toUpperCase();
            
            messageItem.innerHTML = `
                <div class="message-avatar">${initials}</div>
                <div class="message-details">
                    <div class="message-sender">${data.name}</div>
                    <div class="message-preview">Open to read birthday message...</div>
                </div>
            `;
            
            // FIXED: Modified click event to select friend but not open message automatically
            messageItem.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent event bubbling
                
                // Just show which friend is selected
                showFriendMessage(friendId);
            });
            
            messageGrid.appendChild(messageItem);
        }
    }

    // Keyboard event handling
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const memoryViewer = document.querySelector('.memory-viewer');
            const stickyContainer = document.querySelector('.sticky-note-container');
            const letterOverlay = document.querySelector('.letter-focus-overlay');
            
            if (memoryViewer && memoryViewer.classList.contains('active')) {
                memoryViewer.classList.remove('active');
                const viewerOverlay = document.querySelector('.viewer-overlay');
                if (viewerOverlay) viewerOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
            
            if (stickyContainer && stickyContainer.classList.contains('active')) {
                stickyContainer.classList.remove('active');
                document.body.style.overflow = '';
            }
            
            if (letterOverlay && letterOverlay.style.display !== 'none') {
                letterOverlay.style.display = 'none';
                document.body.style.overflow = '';
            }
            
            const memoryTrack = document.querySelector('.carousel-track');
            if (memoryTrack) memoryTrack.classList.remove('paused');
        }
    });

    // Preload images
    function preloadImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            const src = img.getAttribute('src');
            if (src) new Image().src = src;
        });
    }
    preloadImages();

    // Initialize the enhanced envelope experience and store the showFocusedLetter function
    window.showFocusedLetterFunction = enhanceEnvelopeExperience();
    
    // FIXED: Modified event listeners for friend buttons
    function setupFriendButtons() {
        const friendButtons = document.querySelectorAll('.friend-btn');
        
        friendButtons.forEach(button => {
            // Skip the "all" button if it exists
            if (button.dataset.friend === 'all') {
                button.style.display = 'none'; // Hide it
                return;
            }
            
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent event bubbling
                
                // Remove active class from all buttons
                friendButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Select the friend but don't automatically open the message
                showFriendMessage(button.dataset.friend);
            });
        });
    }
    
    // Initialize friend buttons
    setupFriendButtons();
    
    // FIXED: Just select the first friend without automatically opening the message
    if (document.querySelector('.message-grid')) {
        const firstFriendId = Object.keys(friendMessages)[0];
        if (firstFriendId) {
            // Set the first friend button as active
            const firstButton = document.querySelector(`.friend-btn[data-friend="${firstFriendId}"]`);
            if (firstButton) {
                firstButton.classList.add('active');
            }
        }
    }
    
    // Create message list
    createMessageList();
    
    // Hide any footers or bottom elements that should be hidden
    document.querySelectorAll('footer, .gift-box-preview, .message-preview-section, .bottom-previews').forEach(elem => {
        if (elem) {
            elem.style.display = 'none';
        }
    });
});
