const musicPlayer = document.querySelector('#musicPlayer');
const playButton = document.querySelector('.play-button');
const playIcon = playButton.querySelector('i');

playButton.addEventListener('click', () => {
    if (musicPlayer.paused) {
        musicPlayer.play();
        playIcon.classList.replace('fa-play', 'fa-pause');
    } else {
        musicPlayer.pause();
        playIcon.classList.replace('fa-pause', 'fa-play');
    }

});

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
}

setInterval(updateState, 2000);
updateState();