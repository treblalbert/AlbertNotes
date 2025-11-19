import { app, BrowserWindow, ipcMain, dialog, Tray, Menu } from 'electron';
import * as path from 'path';
import * as fs from 'fs/promises';

let mainWindow: BrowserWindow | null = null;
let editorWindow: BrowserWindow | null = null;
const configPath = path.join(app.getPath('userData'), 'config.json');

interface Config {
  folderPath: string | null;
  windowBounds?: { x: number; y: number; width: number; height: number };
}

async function loadConfig(): Promise<Config> {
  try {
    const data = await fs.readFile(configPath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { folderPath: null };
  }
}

async function saveConfig(config: Config): Promise<void> {
  await fs.writeFile(configPath, JSON.stringify(config, null, 2));
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 320,
    height: 500,
    minWidth: 280,
    minHeight: 400,
    frame: false,
    transparent: true,
    resizable: true,
    alwaysOnTop: true,
    skipTaskbar: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createEditorWindow(filePath: string, content: string) {
  if (editorWindow) {
    editorWindow.focus();
    editorWindow.webContents.send('load-file', { filePath, content });
    return;
  }

  editorWindow = new BrowserWindow({
    width: 700,
    height: 600,
    minWidth: 500,
    minHeight: 400,
    frame: false,
    transparent: true,
    resizable: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  if (process.env.NODE_ENV === 'development') {
    editorWindow.loadURL('http://localhost:5173/editor.html');
  } else {
    editorWindow.loadFile(path.join(__dirname, '../dist/editor.html'));
  }

  editorWindow.once('ready-to-show', () => {
    editorWindow?.webContents.send('load-file', { filePath, content });
  });

  editorWindow.on('blur', () => {
    editorWindow?.close();
  });

  editorWindow.on('closed', () => {
    editorWindow = null;
  });
}

app.whenReady().then(async () => {
  createMainWindow();
  const config = await loadConfig();
  mainWindow?.webContents.once('did-finish-load', () => {
    mainWindow?.webContents.send('load-config', config);
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});

// IPC Handlers
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  if (!result.canceled && result.filePaths.length > 0) {
    const folderPath = result.filePaths[0];
    const config = await loadConfig();
    config.folderPath = folderPath;
    await saveConfig(config);
    return folderPath;
  }
  return null;
});

ipcMain.handle('get-text-files', async (_, folderPath: string) => {
  try {
    const files = await fs.readdir(folderPath);
    const textFiles = files.filter(file => 
      /\.(txt|md|markdown|log|json|js|ts|jsx|tsx|css|html|xml|yaml|yml)$/i.test(file)
    );
    return textFiles;
  } catch (error) {
    console.error('Error reading directory:', error);
    return [];
  }
});

ipcMain.handle('read-file', async (_, filePath: string) => {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    console.error('Error reading file:', error);
    return null;
  }
});

ipcMain.handle('open-editor', async (_, filePath: string) => {
  const content = await fs.readFile(filePath, 'utf-8');
  createEditorWindow(filePath, content);
});

ipcMain.handle('save-file', async (_, filePath: string, content: string) => {
  try {
    await fs.writeFile(filePath, content, 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving file:', error);
    return false;
  }
});

ipcMain.on('close-window', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  window?.close();
});

ipcMain.on('minimize-window', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  window?.minimize();
});