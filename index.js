let {app, BrowserWindow, ipcMain} = require("electron");
const {autoUpdater, AppUpdater} = require("electron-updater");
if(require("electron-squirrel-startup")) app.quit();
const electronLog = require("electron-log");

electronLog.transports.console.format = '{h}:{i}:{s} {text}';

electronLog.log("Starting Scorpio...");

app.on("ready", function(){ligar()});

app.on("quit", function(){desligar()});

app.on("window-all-closed", function(){desligarTudo()});

function ligar(){
    const win = new BrowserWindow({

    });
    electronLog.log("Started scorpio!");
    win.loadURL("http://localhost/login");

    function sendStatusToWindow(obj){
        ipcMain.emit("updates", `${obj}`);
    }

    autoUpdater.on("error", e => {
        sendStatusToWindow({message: `Erro: ${e.message}`});
    });
    autoUpdater.on("checking-for-update", () => {
        sendStatusToWindow({message: `Verificando por atualizações...`});
    });
    autoUpdater.on("update-not-available", () => {
        sendStatusToWindow({clear: true});
    });
    autoUpdater.on("update-available", () => {
        sendStatusToWindow({message: "Atualizações encontradas, baixando..."});
    });
    autoUpdater.on("update-downloaded", () => {
        sendStatusToWindow({message: "Atualizações encontradas, deseja reiniciar o Scorpio agora?", eventClick: true, cmd: autoUpdater.quitAndInstall});
    });
}

function desligar(){
    electronLog.log("Closing scorpio...");
    process.exit(0);
}

function desligarTudo(){app = null}