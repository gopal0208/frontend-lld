import React, { useState } from 'react';
import { Copy, Check, FileCode, Terminal } from 'lucide-react';

interface CodeFile {
  filename: string;
  code: string;
  language: string;
}

interface CodeViewerProps {
  files: CodeFile[];
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ files }) => {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (files.length === 0) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        No implementation code available.
      </div>
    );
  }

  const activeFile = files[activeFileIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="code-viewer-container">
      {/* File Selector Tabs if multiple files exist */}
      {files.length > 1 && (
        <div style={{
          display: 'flex',
          gap: '0.25rem',
          background: 'rgba(0, 0, 0, 0.4)',
          borderBottom: '1px solid var(--border-color)',
          padding: '0.5rem 1rem 0',
          overflowX: 'auto',
        }}>
          {files.map((file, index) => {
            const isActive = index === activeFileIndex;
            return (
              <button
                key={file.filename}
                onClick={() => {
                  setActiveFileIndex(index);
                  setCopied(false);
                }}
                style={{
                  background: isActive ? 'rgb(8, 10, 19)' : 'transparent',
                  border: '1px solid ' + (isActive ? 'var(--border-color)' : 'transparent'),
                  borderBottom: isActive ? '1px solid rgb(8, 10, 19)' : 'none',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-mono)',
                  borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transform: 'none',
                  position: 'relative',
                  top: '1px',
                  zIndex: isActive ? 2 : 1,
                }}
              >
                <FileCode size={12} style={{ color: isActive ? 'var(--accent-purple)' : 'inherit' }} />
                {file.filename}
              </button>
            );
          })}
        </div>
      )}

      {/* Code Header Actions */}
      <div className="code-viewer-header">
        <div className="code-viewer-filename">
          <Terminal size={14} style={{ color: 'var(--accent-cyan)' }} />
          <span>{activeFile.filename}</span>
        </div>
        <button
          onClick={handleCopy}
          style={{
            padding: '0.35rem 0.75rem',
            fontSize: '0.75rem',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
          }}
        >
          {copied ? (
            <>
              <Check size={12} style={{ color: 'var(--success)' }} />
              <span style={{ color: 'var(--success)' }}>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      {/* Code Area */}
      <pre className="code-viewer-pre">
        <code className="code-viewer-code">{activeFile.code}</code>
      </pre>
    </div>
  );
};
