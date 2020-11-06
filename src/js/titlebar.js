(function () {
    const { remote } = require('electron');
    const BrowserWindow = remote.getCurrentWindow();

    function init() {
        document.getElementById("min-btn").addEventListener("click", function (e) {
            BrowserWindow.minimize();
        });

        document.getElementById("max-btn").addEventListener("click", function (e) {
            if(BrowserWindow.isMaximized()) {
                document.getElementById("max-btn").firstChild.classList.toggle("fa-window-restore");
                document.getElementById("max-btn").firstChild.classList.toggle("fa-window-maximize");
                BrowserWindow.restore();
            } else {
                document.getElementById("max-btn").firstChild.classList.toggle("fa-window-maximize");
                document.getElementById("max-btn").firstChild.classList.toggle("fa-window-restore");
                BrowserWindow.maximize();
            }
        });

        document.getElementById("close-btn").addEventListener("click", function (e) {
            BrowserWindow.close();
        });
    };

    document.onreadystatechange = function () {
        if (document.readyState == "complete") {
            init();
        }
    };

})();