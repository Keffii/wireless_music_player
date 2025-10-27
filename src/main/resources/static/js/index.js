const musicPlayer = document.querySelector('audio');
const playButton = document.querySelector('.play-button');
const playIcon = playButton.querySelector('#play-pause-icon');
const volumeSlider = document.querySelector('#volume-slider');
const volumeIcon = document.querySelector('#volume-icon');
const progressSlider = document.querySelector('#progress-slider');
const currentTimeLabel = document.querySelector('#current-time');
const totalDurationLabel = document.querySelector('#total-duration');
const coverArt = document.querySelector('#cover-art');


let lastSongId = null;
let songs = [];
let songsLoaded = false;
let shuffleEnabled = false;
let repeatEnabled = false;


async function loadSongs() {
    const res = await fetch('/api/player/songs');
    songs = await res.json();
    songsLoaded = true;
    console.log("✅ Songs loaded:", songs);
}

function resolveSongById(id) {
    return songs.find(s => s.id === id);
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
}

function updateStateFromServer(data) {
    document.querySelector('#song-title').innerText = data.title;
    document.querySelector('#song-artist').innerText = data.artist;
    document.getElementById('stateDisplay').innerText =
        JSON.stringify(data, null, 2);

    const song = resolveSongById(data.currentSongId);
    if (!song) return;
    coverArt.classList.add("hidden-album");
    setTimeout(() => {
        coverArt.src = song.coverUrl;
        coverArt.classList.remove("hidden-album");
    }, 200);

    // Detect when current song changes
    if (song.id !== lastSongId) {
        musicPlayer.src = song.srcUrl;
        coverArt.src = song.coverUrl;
        lastSongId = song.id;
        safePlay();
    }

    if (data.isPlaying && musicPlayer.paused) {
        safePlay();
    } else if (!data.isPlaying && !musicPlayer.paused) {
        musicPlayer.pause();
    }

    musicPlayer.volume = data.volume / 100;
    musicPlayer.muted = data.isMuted;
    volumeSlider.value = data.volume;

    if (data.isMuted || data.volume === 0) {
        volumeIcon.classList.replace('fa-volume-up', 'fa-volume-xmark');
    } else {
        volumeIcon.classList.replace('fa-volume-xmark', 'fa-volume-up');
    }

    if (data.isMuted) {
        playIcon.classList.replace('fa-pause', 'fa-play');
    } else if (data.isPlaying) {
        playIcon.classList.replace('fa-play', 'fa-pause');
    } else {
        playIcon.classList.replace('fa-pause', 'fa-play');
    }
}

function progressBar() {
    musicPlayer.addEventListener('timeupdate', () => {
        progressSlider.value = musicPlayer.currentTime;
        currentTimeLabel.innerText = formatTime(musicPlayer.currentTime);
    });

    musicPlayer.addEventListener('loadedmetadata', () => {
        progressSlider.max = musicPlayer.duration;
        totalDurationLabel.innerText = formatTime(musicPlayer.duration);
        musicPlayer.addEventListener('ended', () => {
            if (shuffleEnabled) {
                sendCommand("NEXT");
            } else if (repeatEnabled) {
                sendCommand("NEXT");
            } else {
                console.log("Playback ended, no repeat.");
            }
        });
    });

    progressSlider.addEventListener('input', () => {
        currentTimeLabel.innerText = formatTime(progressSlider.value);
    });

    progressSlider.addEventListener('change', () => {
        const wasPlaying = !musicPlayer.paused;
        musicPlayer.currentTime = progressSlider.value;

        if (wasPlaying) {
            safePlay();
        }
    });
}

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
}

function safePlay() {
    musicPlayer.play().catch(() => {
        console.warn("Autoplay blocked — waiting for user interaction.");
    });
}

function connectSSE() {
    const eventSource = new EventSource("/api/player/stream");

    eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        updateStateFromServer(data);
        shuffleEnabled = data.shuffle;
        repeatEnabled = data.repeat;
        updateShuffleUI();
        updateRepeatUI();
    };

    eventSource.onerror = () => {
        console.warn("SSE connection lost — reconnecting...");
        setTimeout(connectSSE, 2000);
    };
}

function updateShuffleUI() {
    const btn = document.getElementById('shuffle-btn');
    btn.style.opacity = shuffleEnabled ? "1" : "0.3";
}

function updateRepeatUI() {
    const btn = document.getElementById('repeat-btn');
    btn.style.opacity = repeatEnabled ? "1" : "0.3";
}


(async function init() {
    await loadSongs();
    connectSSE();
    unlockOverlay();
    playPauseListener();
    volumeControl();
    progressBar();
    document.getElementById('shuffle-btn').addEventListener('click', () => {
        sendCommand("SHUFFLE");
    });

    document.getElementById('repeat-btn').addEventListener('click', () => {
        sendCommand("REPEAT");
    });
})();