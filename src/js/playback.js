const playbackSyncButton = document.getElementById('playbackSyncButton');
let playbackSyncActive = false;
let playingBeforeSeek = false;

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
        packet.time = player.currentTime();
        socket.emit('playback_sync', packet);
        playingBeforeSeek = false;
        packet.seekActive = false;
    }
}

function handlePauseEvent() {
    if (packet.sessionId && playbackSyncActive) {
        packet.action = "PAUSE";
        packet.time = player.currentTime();
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

player.controlBar.progressControl.on('mousedown', () => packet.seekActive = true);
player.controlBar.progressControl.seekBar.on('mousedown', () => packet.seekActive = true);
player.on('keydown', (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        packet.seekActive = true
    }
});
player.on('pause', () => playingBeforeSeek = packet.seekActive ? true : false);
player.on('seeked', () => {
    if (packet.seekActive && !playingBeforeSeek) {
        packet.seekActive = false;
    }
});

socket.on('playback_sync', (packet) => {
    if (playbackSyncActive) {
        switch (packet.action) {
            case "PLAY":
                if (packet.seekActive) {
                    return;
                }
                player.off('play', handlePlayEvent);
                player.one('play', () => {
                    player.on('play', handlePlayEvent);
                });
                player.play();
                chatArea.appendChild(createChatInfoElement(packet.nickname + " played from " + secondsToHms(packet.time)));
                chatArea.scrollTop = chatArea.scrollHeight;
                break;
            case "PAUSE":
                if (packet.seekActive) {
                    return;
                }
                player.off('pause', handlePauseEvent);
                player.one('pause', () => {
                    player.on('pause', handlePauseEvent);
                });
                player.pause();
                chatArea.appendChild(createChatInfoElement(packet.nickname + " paused at " + secondsToHms(packet.time)));
                chatArea.scrollTop = chatArea.scrollHeight;
                break;
            case "SYNC":
                player.currentTime(packet.time);
                chatArea.appendChild(createChatInfoElement(packet.nickname + " synced to " + secondsToHms(packet.time)));
                chatArea.scrollTop = chatArea.scrollHeight;
                break;
            default:
                break;
        }
    }
});

function secondsToHms(d) {
    d = Number(d);
    let h = Math.floor(d / 3600);
    let m = Math.floor(d % 3600 / 60);
    let s = Math.floor(d % 3600 % 60);

    let hDisplay = ((h < 10) ? '0' + h : h) + ":";
    let mDisplay = ((m < 10) ? '0' + m : m) + ":";
    let sDisplay = (s < 10) ? '0' + s : s;
    return (hDisplay === "00:" ? "" : hDisplay) + mDisplay + sDisplay;
}