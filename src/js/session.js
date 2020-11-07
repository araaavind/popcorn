let packet = {
    sessionId: undefined,
    nickname: "Anonymous",
    prevname: "Anonymous",
    action: undefined,
    message: "",
    time: 0
};

document.getElementById('nicknameInput').addEventListener('focusout', e => {
    if (packet.nickname !== e.target.value) {
        packet.prevname = packet.nickname;
        packet.nickname = e.target.value;

        if (packet.sessionId) {
            packet.action = "CHANGE_NAME";
            socket.emit('change_nickname', packet);
            chatArea.appendChild(createChatInfoElement("You changed your nickname to " + packet.nickname));
            chatArea.scrollTop = chatArea.scrollHeight;
        }
    }
});

function startNewSession() {
    document.getElementById('newSessionContainer').style.display = "block";
    document.getElementById('joinSessionContainer').style.display = "none";
    document.getElementById('joinedSessionContainer').style.display = "none";
    document.getElementById('chatOpenButton').style.visibility = "visible";
    document.getElementById('playbackSyncButton').style.visibility = "visible";

    if (!playbackSyncActive) {
        Array.from(document.getElementsByClassName('playback-sync-toggle')).forEach(element => {
            switchPlaybackSync(element.firstElementChild, "ON");
        });
    }

    packet.sessionId = makeId(6);
    let sessionIdspan = document.getElementById('sessionIdSpan');
    sessionIdspan.textContent = packet.sessionId;
    copySessionId(document.getElementById("copyButton"));

    packet.action = "CREATE";
    socket.emit('create_session', packet);

    chatArea.innerHTML = "";
    chatArea.appendChild(createChatInfoElement("You created the party :)"));
    chatArea.scrollTop = chatArea.scrollHeight;
}

function generateSessionId() {
    leaveSession();
    startNewSession();
}

function joinSession() {
    sessionId = document.getElementById('sessionJoinId').value;

    document.getElementById('newSessionContainer').style.display = "none";
    document.getElementById('joinSessionContainer').style.display = "none";
    document.getElementById('joinedSessionContainer').style.display = "block";
    document.getElementById('chatOpenButton').style.visibility = "visible";
    document.getElementById('playbackSyncButton').style.visibility = "visible";

    if (!playbackSyncActive) {
        Array.from(document.getElementsByClassName('playback-sync-toggle')).forEach(element => {
            switchPlaybackSync(element.firstElementChild, "ON");
        });
    }

    packet.sessionId = sessionId;
    packet.action = "SUBSCRIBE";
    socket.emit('join_session', packet);

    chatArea.innerHTML = "";
    chatArea.appendChild(createChatInfoElement("You joined the party :D"));
    chatArea.scrollTop = chatArea.scrollHeight;
}

function leaveSession() {
    document.getElementById('newSessionContainer').style.display = "none";
    document.getElementById('joinSessionContainer').style.display = "block";
    document.getElementById('joinedSessionContainer').style.display = "none";
    document.getElementById('chatOpenButton').style.visibility = "hidden";
    document.getElementById('chatRoom').style.visibility = "hidden";
    document.getElementById('playbackSyncButton').style.visibility = "hidden";

    if (playbackSyncActive) {
        Array.from(document.getElementsByClassName('playback-sync-toggle')).forEach(element => {
            switchPlaybackSync(element.firstElementChild, "OFF");
        });
    }

    packet.action = "UNSUBSCRIBE";
    socket.emit('leave_session', packet);

    packet.sessionId = undefined;

    chatArea.appendChild(createChatInfoElement("You left the party :("));
    chatArea.scrollTop = chatArea.scrollHeight;
}

function copySessionId(btn) {
    const el = document.createElement('textarea');
    let sessionIdspan = document.getElementById('sessionIdSpan');
    el.value = sessionIdspan.textContent;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    btn.textContent = "Copied!";

    setTimeout(() => {
        btn.textContent = "Copy to clipboard ";
        const i = document.createElement("i");
        i.setAttribute("class", "fa fa-clipboard fa-fw");
        btn.appendChild(i);
    }, 3000);
}

function makeId(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}