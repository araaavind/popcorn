const playbackSyncButton = document.getElementById('playbackSyncButton');
let playbackSyncActive = false;

function togglePlaybackSync(btn) {
    btn.classList.toggle("fa-toggle-off");
    btn.classList.toggle("fa-toggle-on");
    let parent = btn.parentElement;
    if (playbackSyncActive) {
        playbackSyncActive = false;
        parent.textContent = "Turn on playback sync ";
    } else {
        playbackSyncActive = true;
        parent.textContent = "Turn off playback sync ";
    }
    parent.appendChild(btn);
}

function switchPlaybackSync(btn, action) {
    let parent = btn.parentElement;
    if (action === "ON") {
        playbackSyncActive = true;
        btn.setAttribute('class', "fa fa-fw fa-toggle-on");
        parent.textContent = "Turn off playback sync ";
    }
    else if (action === "OFF") {
        playbackSyncActive = false;
        btn.setAttribute('class', "fa fa-fw fa-toggle-off");
        parent.textContent = "Turn on playback sync ";
    }
    parent.appendChild(btn);
}

player.on('play', () => {
    if (packet.sessionId) {
        packet.action = "PLAY";
        socket.emit('playback_sync', packet);
    }
});

player.on('pause', () => {
    if (packet.sessionId) {
        packet.action = "PAUSE";
        socket.emit('playback_sync', packet);
    }
});

playbackSyncButton.addEventListener('click', (e) => {
    if (packet.sessionId) {
        playbackSyncButton.firstElementChild.classList.toggle("fa-spin");
        packet.action = "SYNC";
        packet.time = player.currentTime();
        socket.emit('playback_sync', packet);
        setTimeout(() => {
            playbackSyncButton.firstElementChild.classList.toggle("fa-spin");
        }, 1000);
    }
});

socket.on('playback_sync', (packet) => {
    if (playbackSyncActive) {
        switch (packet.action) {
            case "PLAY":
                player.play();
                break;
            case "PAUSE":
                player.pause();
                break;
            case "SYNC":
                player.currentTime(packet.time);
                break;
            default:
                break;
        }
    }
});