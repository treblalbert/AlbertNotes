import React, { useState, useEffect } from 'react';
import './Editor.css';

declare global {
  interface Window {
    electron: any;
  }
}

function Editor() {
  const [filePath, setFilePath] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    window.electron.onLoadFile((data: any) => {
      setFilePath(data.filePath);
      setContent(data.content);
      const name = data.filePath.split(/[\\/]/).pop() || 'Note';
      setFileName(name);
    });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    await window.electron.saveFile(filePath, content);
    setTimeout(() => setIsSaving(false), 500);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  return (
    <div className="editor-container">
      <div className="editor-titlebar">
        <div className="editor-titlebar-drag">
          <svg className="doc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" strokeWidth="2"/>
          </svg>
          <span className="editor-title">{fileName}</span>
        </div>
        <div className="editor-titlebar-controls">
          <button className="save-btn" onClick={handleSave} disabled={isSaving}>
            {isSaving ? '✓ Saved' : 'Save'}
          </button>
          <button className="editor-titlebar-btn close" onClick={() => window.electron.closeWindow()}>
            ×
          </button>
        </div>
      </div>

      <div className="editor-content">
        <textarea
          className="editor-textarea"
          value={content}
          onChange={handleContentChange}
          onBlur={handleSave}
          placeholder="Start typing..."
          autoFocus
        />
      </div>
    </div>
  );
}

export default Editor;