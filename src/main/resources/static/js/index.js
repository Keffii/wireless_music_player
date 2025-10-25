const musicPlayer = document.querySelector('audio');
const playButton = document.querySelector('.play-button');
const playIcon = playButton.querySelector('#play-pause-icon');
const volumeSlider = document.querySelector('#volume-slider');
const volumeIcon = document.querySelector('#volume-icon');


let currentSongIndex = 0;
let lastSongIndex = null;


const songs = [
    {
    title: "Better Day",
    artist: "penguinmusic",
    src: "/music/better-day-186374.mp3"
    },
    {
    title: "Abstract Beauty",
    artist: "Grand_Project",
    src: "/music/abstract-beauty-378257.mp3"
    },
    {
    title: "Cascade Breathe",
    artist: "NverAvetyanMusic",
    src: "/music/cascade-breathe-future-garage-412839.mp3"
    }
];

function playSong(index) {
    const songTitle = document.querySelector('#song-title');
    const songArtist = document.querySelector('#song-artist');
    const songSource = musicPlayer;
    const song = songs[index];
    songTitle.innerText = song.title;
    songArtist.innerText = song.artist;
    songSource.src = song.src;
}

function playPauseListener() {
    playButton.addEventListener('click', async () => {
        if (musicPlayer.paused) {
            await sendCommand("PLAY");
        } else {
            await sendCommand("PAUSE");
        }
    });
}

function volumeControl() {
    volumeSlider.addEventListener('input', () => {
        musicPlayer.volume = volumeSlider.value / 100;
        sendCommand(`VOLUME:${volumeSlider.value}`);
    });

    volumeIcon.addEventListener('click', () => {
        sendCommand("MUTE");
    });
}


function unlockOverlay() {
    const unlockOverlay = document.querySelector('#audio-unlock');

    unlockOverlay.addEventListener('click', () => {
        musicPlayer.muted = true;
        musicPlayer.play()
            .then(() => {
                musicPlayer.pause();
                musicPlayer.muted = false;
                unlockOverlay.classList.add('hidden');
            });
    });
}

async function sendCommand(cmd) {
    await fetch('/api/player/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd })
    });
    await updateState();
}

async function updateState() {
    const res = await fetch('/api/player/state');
    const data = await res.json();

    // Update debug
    document.getElementById('stateDisplay').innerText =
        JSON.stringify(data, null, 2);

    // Update displayed title + artist
    document.querySelector('#song-title').innerText = data.title;
    document.querySelector('#song-artist').innerText = data.artist;

    currentSongIndex = data.currentSong - 1;

    // Change audio source only if song changed
    if (currentSongIndex !== lastSongIndex) {
        musicPlayer.src = songs[currentSongIndex].src;
        lastSongIndex = currentSongIndex;
        safePlay();
    }

    // Sync playback state
    if (data.isPlaying && musicPlayer.paused) {
        safePlay();
    } else if (!data.isPlaying && !musicPlayer.paused) {
        musicPlayer.pause();
    }

    // Sync volume + mute state
    volumeSlider.value = data.volume;
    musicPlayer.volume = data.volume / 100;
    musicPlayer.muted = data.isMuted;

    if (data.isMuted || data.volume === 0) {
        volumeIcon.classList.replace('fa-volume-up', 'fa-volume-xmark');
    } else {
        volumeIcon.classList.replace('fa-volume-xmark', 'fa-volume-up');
    }

    // Prevent PAUSE icon while muted, always show Play
    if (data.isMuted) {
        playIcon.classList.replace('fa-pause', 'fa-play');
    } else {
        if (data.isPlaying) {
            playIcon.classList.replace('fa-play', 'fa-pause');
        } else {
            playIcon.classList.replace('fa-pause', 'fa-play');
        }
    }
}



function safePlay() {
    musicPlayer.play().catch(() => {
        console.warn("Autoplay blocked — waiting for user interaction.");
    });
}




setInterval(updateState, 1000);
updateState();
unlockOverlay();
playPauseListener();
volumeControl();
playSong(currentSongIndex);