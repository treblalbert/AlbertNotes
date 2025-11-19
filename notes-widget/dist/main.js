"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = __importStar(require("path"));
var fs = __importStar(require("fs/promises"));
var mainWindow = null;
var editorWindow = null;
var configPath = path.join(electron_1.app.getPath('userData'), 'config.json');
function loadConfig() {
    return __awaiter(this, void 0, void 0, function () {
        var data, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs.readFile(configPath, 'utf-8')];
                case 1:
                    data = _b.sent();
                    return [2 /*return*/, JSON.parse(data)];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, { folderPath: null }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function saveConfig(config) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.writeFile(configPath, JSON.stringify(config, null, 2))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function createMainWindow() {
    mainWindow = new electron_1.BrowserWindow({
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
    }
    else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}
function createEditorWindow(filePath, content) {
    if (editorWindow) {
        editorWindow.focus();
        editorWindow.webContents.send('load-file', { filePath: filePath, content: content });
        return;
    }
    editorWindow = new electron_1.BrowserWindow({
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
    }
    else {
        editorWindow.loadFile(path.join(__dirname, '../dist/editor.html'));
    }
    editorWindow.once('ready-to-show', function () {
        editorWindow === null || editorWindow === void 0 ? void 0 : editorWindow.webContents.send('load-file', { filePath: filePath, content: content });
    });
    editorWindow.on('blur', function () {
        editorWindow === null || editorWindow === void 0 ? void 0 : editorWindow.close();
    });
    editorWindow.on('closed', function () {
        editorWindow = null;
    });
}
electron_1.app.whenReady().then(function () { return __awaiter(void 0, void 0, void 0, function () {
    var config;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                createMainWindow();
                return [4 /*yield*/, loadConfig()];
            case 1:
                config = _a.sent();
                mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.webContents.once('did-finish-load', function () {
                    mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.webContents.send('load-config', config);
                });
                return [2 /*return*/];
        }
    });
}); });
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', function () {
    if (mainWindow === null) {
        createMainWindow();
    }
});
// IPC Handlers
electron_1.ipcMain.handle('select-folder', function () { return __awaiter(void 0, void 0, void 0, function () {
    var result, folderPath, config;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, electron_1.dialog.showOpenDialog({
                    properties: ['openDirectory']
                })];
            case 1:
                result = _a.sent();
                if (!(!result.canceled && result.filePaths.length > 0)) return [3 /*break*/, 4];
                folderPath = result.filePaths[0];
                return [4 /*yield*/, loadConfig()];
            case 2:
                config = _a.sent();
                config.folderPath = folderPath;
                return [4 /*yield*/, saveConfig(config)];
            case 3:
                _a.sent();
                return [2 /*return*/, folderPath];
            case 4: return [2 /*return*/, null];
        }
    });
}); });
electron_1.ipcMain.handle('get-text-files', function (_, folderPath) { return __awaiter(void 0, void 0, void 0, function () {
    var files, textFiles, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, fs.readdir(folderPath)];
            case 1:
                files = _a.sent();
                textFiles = files.filter(function (file) {
                    return /\.(txt|md|markdown|log|json|js|ts|jsx|tsx|css|html|xml|yaml|yml)$/i.test(file);
                });
                return [2 /*return*/, textFiles];
            case 2:
                error_1 = _a.sent();
                console.error('Error reading directory:', error_1);
                return [2 /*return*/, []];
            case 3: return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.handle('read-file', function (_, filePath) { return __awaiter(void 0, void 0, void 0, function () {
    var content, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, fs.readFile(filePath, 'utf-8')];
            case 1:
                content = _a.sent();
                return [2 /*return*/, content];
            case 2:
                error_2 = _a.sent();
                console.error('Error reading file:', error_2);
                return [2 /*return*/, null];
            case 3: return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.handle('open-editor', function (_, filePath) { return __awaiter(void 0, void 0, void 0, function () {
    var content;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fs.readFile(filePath, 'utf-8')];
            case 1:
                content = _a.sent();
                createEditorWindow(filePath, content);
                return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.handle('save-file', function (_, filePath, content) { return __awaiter(void 0, void 0, void 0, function () {
    var error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, fs.writeFile(filePath, content, 'utf-8')];
            case 1:
                _a.sent();
                return [2 /*return*/, true];
            case 2:
                error_3 = _a.sent();
                console.error('Error saving file:', error_3);
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.on('close-window', function (event) {
    var window = electron_1.BrowserWindow.fromWebContents(event.sender);
    window === null || window === void 0 ? void 0 : window.close();
});
electron_1.ipcMain.on('minimize-window', function (event) {
    var window = electron_1.BrowserWindow.fromWebContents(event.sender);
    window === null || window === void 0 ? void 0 : window.minimize();
});
