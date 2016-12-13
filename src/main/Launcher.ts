import * as electron from "electron";
import {Application} from "./Application";

const app = electron.app;

app.on("ready", () => {
    const application = new Application();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
