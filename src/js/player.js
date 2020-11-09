const player = videojs('videoPlayer', {
    controls: true,
    autoplay: false,
    preload: 'auto',
    playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
    fluid: true,
    aspectRatio: '4:3',
    plugins: {
        hotkeys: {
            enableModifiersForNumbers: false
        }
    }
});

let homeButton = document.getElementById('homeOpenButton');
let partyButton = document.getElementById('watchPartyButton');
let syncButton = document.getElementById('playbackSyncButton');
let chatButton = document.getElementById('chatOpenButton');
let subsButton = document.getElementById('subtitlesButton');

function hideControls() {
    setTimeout(() => {
        homeButton.style.visibility = "hidden";
        partyButton.style.visibility = "hidden";
        syncButton.style.visibility = "hidden";
        subsButton.style.visibility = "hidden";
        if (chatRoom.style.visibility === "hidden") {
            chatButton.style.visibility = "hidden";
        }
    }, 200);
}

function showControls() {
    homeButton.style.visibility = "visible";
    partyButton.style.visibility = "visible";
    subsButton.style.visibility = "visible";
    if (packet.sessionId) {
        syncButton.style.visibility = "visible";
        chatButton.style.visibility = "visible";
    }
}

player.on('userinactive', hideControls);

player.on('useractive', showControls);

player.on('pause', () => {
    player.off('userinactive', hideControls);
    showControls();
});

player.on('play', () => {
    player.on('userinactive', hideControls);
});