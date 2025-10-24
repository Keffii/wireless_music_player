const musicPlayer = document.querySelector('audio');
const playButton = document.querySelector('.play-button');
const playIcon = playButton.querySelector('#play-pause-icon');

let currentSongIndex = 0;
let lastSongIndex = null;


const songs = [
    {
    title: "Better Day",
    artist: "penguinmusic",
    src: "music/better-day-186374.mp3"
    },
    {
    title: "Abstract Beauty",
    artist: "Grand_Project",
    src: "music/abstract-beauty-378257.mp3"
    },
    {
    title: "Cascade Breathe",
    artist: "NverAvetyanMusic",
    src: "music/cascade-breathe-future-garage-412839.mp3"
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

    songSource.play();
}

function playPauseListener(){
    playButton.addEventListener('click', () => {
        if (musicPlayer.paused) {
            musicPlayer.play();
            playIcon.classList.replace('fa-play', 'fa-pause');
        } else {
            musicPlayer.pause();
            playIcon.classList.replace('fa-pause', 'fa-play');
        }

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
    document.getElementById('stateDisplay').innerText = JSON.stringify(data, null, 2);
    document.querySelector('#song-title').innerText = data.title;
    document.querySelector('#song-artist').innerText = data.artist;
    currentSongIndex = data.currentSong - 1;
    if (currentSongIndex != lastSongIndex) {
        document.querySelector("audio").src = songs[currentSongIndex].src;
        lastSongIndex = currentSongIndex;
        musicPlayer.play();


        /*if (data.isPlaying & musicPlayer.paused) {
            musicPlayer.play();
            playIcon.classList.replace('fa-pause', 'fa-play');
        }
        else if (!data.isPlaying & musicPlayer.paused) {
            musicPlayer.pause();
            playIcon.classList.replace('fa-play', 'fa-pause');
        }*/
    }
}

setInterval(updateState, 1000);
updateState();
playPauseListener()
playSong(currentSongIndex);