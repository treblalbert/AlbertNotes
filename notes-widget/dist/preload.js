"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electron', {
    selectFolder: function () { return electron_1.ipcRenderer.invoke('select-folder'); },
    getTextFiles: function (folderPath) { return electron_1.ipcRenderer.invoke('get-text-files', folderPath); },
    readFile: function (filePath) { return electron_1.ipcRenderer.invoke('read-file', filePath); },
    openEditor: function (filePath) { return electron_1.ipcRenderer.invoke('open-editor', filePath); },
    saveFile: function (filePath, content) { return electron_1.ipcRenderer.invoke('save-file', filePath, content); },
    closeWindow: function () { return electron_1.ipcRenderer.send('close-window'); },
    minimizeWindow: function () { return electron_1.ipcRenderer.send('minimize-window'); },
    onLoadConfig: function (callback) {
        electron_1.ipcRenderer.on('load-config', function (_, config) { return callback(config); });
    },
    onLoadFile: function (callback) {
        electron_1.ipcRenderer.on('load-file', function (_, data) { return callback(data); });
    }
});
