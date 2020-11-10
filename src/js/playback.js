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

function handlePlayEvent() {
    if (packet.sessionId && playbackSyncActive) {
        packet.action = "PLAY";
        socket.emit('playback_sync', packet);
    }
}

function handlePauseEvent() {
    if (packet.sessionId && playbackSyncActive) {
        packet.action = "PAUSE";
        socket.emit('playback_sync', packet);
    }
}

function handleSyncEvent() {
    if (packet.sessionId && playbackSyncActive) {
        playbackSyncButton.firstElementChild.classList.toggle("fa-spin");
        packet.action = "SYNC";
        packet.time = player.currentTime();
        socket.emit('playback_sync', packet);
        setTimeout(() => {
            playbackSyncButton.firstElementChild.classList.toggle("fa-spin");
        }, 1000);
    }
}

player.on('play', handlePlayEvent);
player.on('pause', handlePauseEvent);
playbackSyncButton.addEventListener('click', handleSyncEvent);

socket.on('playback_sync', (packet) => {
    if (playbackSyncActive) {
        switch (packet.action) {
            case "PLAY":
                player.off('play', handlePlayEvent);
                player.one('play', () => {
                    player.on('play', handlePlayEvent);
                });
                player.play();
                break;
            case "PAUSE":
                player.off('pause', handlePauseEvent);
                player.one('pause', () => {
                    player.on('pause', handlePauseEvent);
                });
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