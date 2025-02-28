document.addEventListener('DOMContentLoaded', () => {
    

    // Sound sources mapping (using placeholder URLs - replace with actual sound files)
    const soundSources = {
        'Balanced': 'audio/fire.mp3',
        'Bright': 'audio/fire.mp3',
        'Dark': 'audio/fire.mp3',
        'Ocean': 'audio/fire.mp3',
        'Rain': 'audio/fire.mp3',
        'Stream': 'audio/fire.mp3',
        'Night': 'audio/fire.mp3',
        'Fire': 'audio/fire.mp3'
    };

    document.querySelector('.sound-options').innerHTML = `
    ${Object.entries(soundSources).map(e => {
        return `<div class="sound-item" data-sound="${e[0]}">${e[0]}</div>`
    }).join('')}
    `

    // Initialize elements
    const audioPlayer = document.getElementById('audio-player');
    const playPauseBtn = document.querySelector('.play-pause-btn');
    const playIcon = document.querySelector('.play-icon');
    const pauseIcon = document.querySelector('.pause-icon');
    const soundItems = document.querySelectorAll('.sound-item');
    const soundNameDisplay = document.querySelector('.sound-name');
    const volumeSlider = document.querySelector('.volume-slider');

    // Set initial volume
    audioPlayer.volume = volumeSlider.value / 100;

    // Handle volume changes
    volumeSlider.addEventListener('input', (e) => {
        audioPlayer.volume = e.target.value / 100;
    });

    // Toggle play/pause
    function togglePlayPause() {
        if (audioPlayer.paused) {
            audioPlayer.play()
                .then(() => {
                    playIcon.classList.add('hidden');
                    pauseIcon.classList.remove('hidden');
                })
                .catch(error => {
                    console.error('Error playing audio:', error);
                });
        } else {
            audioPlayer.pause();
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
        }
    }

    // Handle play/pause button click
    playPauseBtn.addEventListener('click', togglePlayPause);

    // Handle sound selection
    soundItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            soundItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');

            // Update sound name display
            soundNameDisplay.textContent = item.textContent;

            // Get the sound source
            const soundType = item.getAttribute('data-sound');
            const soundSource = soundSources[soundType];

            // Update audio source and play
            const wasPlaying = !audioPlayer.paused;
            audioPlayer.src = soundSource;
            
            if (wasPlaying) {
                audioPlayer.play()
                    .then(() => {
                        playIcon.classList.add('hidden');
                        pauseIcon.classList.remove('hidden');
                    })
                    .catch(error => {
                        console.error('Error playing audio:', error);
                        playIcon.classList.remove('hidden');
                        pauseIcon.classList.add('hidden');
                    });
            }
        });
    });

    // Handle audio errors
    audioPlayer.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
    });

    document.getElementById("sbmusicplayer").style.display = "none"
    document.getElementById("sbmusic").addEventListener('click', () => {
        let  = document.getElementById("sbmusicplayer")
        sbmusicplayer.style.display = sbmusicplayer.style.display == "none" ? "block" : "none"
    })

});



