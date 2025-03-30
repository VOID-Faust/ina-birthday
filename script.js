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

    // Clone message items for infinite loop
    const messageTrack = document.querySelector('.message-track');
    const messageItems = messageTrack.querySelectorAll('.message');
    
    messageItems.forEach(item => {
        const clone = item.cloneNode(true);
        messageTrack.appendChild(clone);
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
            messageTrack.classList.add('paused');
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
            messageTrack.classList.remove('paused');
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

    // Messages sticky note functionality
    const messageItems2 = document.querySelectorAll('.message');
    const stickyContainer = document.querySelector('.sticky-note-container');
    const noteContent = document.querySelector('.note-content');
    const noteSender = document.querySelector('.note-sender');
    const noteStamp = document.querySelector('.note-stamp');
    const closeNote = document.querySelector('.close-note');

    messageItems2.forEach(msg => {
        msg.addEventListener('click', () => {
            noteContent.textContent = msg.dataset.msg;
            noteSender.textContent = `- ${msg.dataset.sender}`;
            noteStamp.style.backgroundImage = `url(${msg.dataset.stamp})`;
            stickyContainer.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent page scrolling
            
            // Pause all animations
            memoryTrack.classList.add('paused');
            messageTrack.classList.add('paused');
            isScrollPaused = true;
        });
    });

    // Close note function
    function closeNoteViewer() {
        stickyContainer.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        
        // Resume animations if memory viewer is not active
        if (!memoryViewer.classList.contains('active')) {
            memoryTrack.classList.remove('paused');
            messageTrack.classList.remove('paused');
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
            music.play();
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
            music.play();
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
                memoryViewer.classList.remove('active');
                overlay.classList.remove('active');
            }
            if (stickyContainer.classList.contains('active')) {
                closeNoteViewer(); // Use the proper function
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
});
