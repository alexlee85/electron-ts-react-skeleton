import * as electron from "electron";

const BrowserWindow = electron.BrowserWindow

export class Application {
    constructor() {
        const mainWin = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                webSecurity: false
            },
            fullscreen: false,
            backgroundColor: '#ffffff',
            show: true,
            frame: true
        })

        console.log("I'm working in " + __dirname)
        mainWin.loadURL("file://" + __dirname + "/../renderer/index.html")
        mainWin.show();
    }
}
