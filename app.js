const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');

let win, loaderWin;
function createWindow() {
    loaderWin = new BrowserWindow({
        show: false,
        frame: false,
        backgroundColor: "#1f1f1f",
        width: 450,
        height: 300,
        maximizable: false,
        minimizable: false,
        movable: false
    });

    loaderWin.removeMenu()
    loaderWin.loadURL(url.format({
        pathname: path.join(__dirname, 'src/loader.html'),
        protocol: 'file',
        slashes: true
    }));

    loaderWin.once('ready-to-show', () => {
        loaderWin.show();
    });

    win = new BrowserWindow({
        show: false,
        frame: false,
        minWidth: 600,
        minHeight: 480,
        backgroundColor: '#000000',
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true
        }
    });

    win.removeMenu();
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'src/index.html'),
        protocol: 'file',
        slashes: true
    }));

    win.once('ready-to-show', () => {
        setTimeout(() => {
            win.show();
            loaderWin.close();
        }, 1500);
    });

    win.on('closed', () => {
        win = null;
    });

    loaderWin.on('closed', () => {
        loaderWin = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});