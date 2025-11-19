import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  getTextFiles: (folderPath: string) => ipcRenderer.invoke('get-text-files', folderPath),
  readFile: (filePath: string) => ipcRenderer.invoke('read-file', filePath),
  openEditor: (filePath: string) => ipcRenderer.invoke('open-editor', filePath),
  saveFile: (filePath: string, content: string) => ipcRenderer.invoke('save-file', filePath, content),
  closeWindow: () => ipcRenderer.send('close-window'),
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  onLoadConfig: (callback: (config: any) => void) => {
    ipcRenderer.on('load-config', (_, config) => callback(config));
  },
  onLoadFile: (callback: (data: any) => void) => {
    ipcRenderer.on('load-file', (_, data) => callback(data));
  }
});