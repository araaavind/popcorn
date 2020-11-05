function startNewSession() {
    document.getElementById('newSessionContainer').style.display = "block";
    document.getElementById('joinSessionContainer').style.display = "none";
    document.getElementById('joinedSessionContainer').style.display = "none";

    let sessionId = makeId(6);
    let sessionIdspan = document.getElementById('sessionIdSpan');
    sessionIdspan.textContent = sessionId;
    copySessionId(document.getElementById("copyButton"));
}

function stopSession() {
    document.getElementById('newSessionContainer').style.display = "none";
    document.getElementById('joinSessionContainer').style.display = "block";
    document.getElementById('joinedSessionContainer').style.display = "none";
}

function generateSessionId() {
    stopSession();
    startNewSession();
}

function joinSession() {
    let sessionId = document.getElementById('sessionJoinId').value;

    document.getElementById('newSessionContainer').style.display = "none";
    document.getElementById('joinSessionContainer').style.display = "none";
    document.getElementById('joinedSessionContainer').style.display = "block";
}

function leaveSession() {
    document.getElementById('newSessionContainer').style.display = "none";
    document.getElementById('joinSessionContainer').style.display = "block";
    document.getElementById('joinedSessionContainer').style.display = "none";
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