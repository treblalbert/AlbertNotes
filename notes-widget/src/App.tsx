import React, { useState, useEffect } from 'react';
import './App.css';

declare global {
  interface Window {
    electron: any;
  }
}

interface Note {
  name: string;
  path: string;
}

function App() {
  const [folderPath, setFolderPath] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    window.electron.onLoadConfig((config: any) => {
      if (config.folderPath) {
        setFolderPath(config.folderPath);
        loadNotes(config.folderPath);
      }
    });
  }, []);

  const loadNotes = async (path: string) => {
    const files = await window.electron.getTextFiles(path);
    const notesList = files.map((file: string) => ({
      name: file,
      path: `${path}/${file}`.replace(/\\/g, '/')
    }));
    setNotes(notesList);
  };

  const handleSelectFolder = async () => {
    const path = await window.electron.selectFolder();
    if (path) {
      setFolderPath(path);
      loadNotes(path);
    }
  };

  const handleOpenNote = async (note: Note) => {
    await window.electron.openEditor(note.path);
  };

  const filteredNotes = notes.filter(note =>
    note.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFolderName = (path: string) => {
    return path.split(/[\\/]/).pop() || path;
  };

  return (
    <div className="app-container">
      <div className="titlebar">
        <div className="titlebar-drag">
          <span className="app-title">Notes</span>
        </div>
        <div className="titlebar-controls">
          <button className="titlebar-btn" onClick={() => window.electron.minimizeWindow()}>
            −
          </button>
          <button className="titlebar-btn close" onClick={() => window.electron.closeWindow()}>
            ×
          </button>
        </div>
      </div>

      <div className="content">
        {!folderPath ? (
          <div className="empty-state">
            <svg className="folder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="empty-text">No folder selected</p>
            <button className="select-btn" onClick={handleSelectFolder}>
              Select Notes Folder
            </button>
          </div>
        ) : (
          <>
            <div className="folder-header">
              <div className="folder-info">
                <svg className="small-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="folder-name">{getFolderName(folderPath)}</span>
              </div>
              <button className="change-btn" onClick={handleSelectFolder}>
                Change
              </button>
            </div>

            <div className="search-container">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8" strokeWidth="2"/>
                <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="notes-list">
              {filteredNotes.length === 0 ? (
                <p className="no-notes">No notes found</p>
              ) : (
                filteredNotes.map((note) => (
                  <div
                    key={note.path}
                    className="note-item"
                    onClick={() => handleOpenNote(note)}
                  >
                    <svg className="note-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="note-name">{note.name}</span>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;