import React, { useState } from 'react';
import { FileNode } from './types';
import { insertNode, deleteNode } from './utils';
import { Folder, FolderOpen, FileCode, Trash2, Plus, FilePlus, FolderPlus, Terminal } from 'lucide-react';

const initialFolderStructure: FileNode = {
  id: 'root',
  name: 'frontend-lld',
  isFolder: true,
  items: [
    {
      id: 'src',
      name: 'src',
      isFolder: true,
      items: [
        {
          id: 'components',
          name: 'components',
          isFolder: true,
          items: [
            { id: 'f_sb', name: 'Sidebar.tsx', isFolder: false, items: [] },
            { id: 'f_vp', name: 'VideoPlayer.tsx', isFolder: false, items: [] },
          ],
        },
        { id: 'f_app', name: 'App.tsx', isFolder: false, items: [] },
        { id: 'f_main', name: 'main.tsx', isFolder: false, items: [] },
      ],
    },
    {
      id: 'public',
      name: 'public',
      isFolder: true,
      items: [
        { id: 'f_fav', name: 'favicon.svg', isFolder: false, items: [] },
      ],
    },
    { id: 'f_pkg', name: 'package.json', isFolder: false, items: [] },
    { id: 'f_vite', name: 'vite.config.ts', isFolder: false, items: [] },
  ],
};

export const FileExplorerDemo: React.FC = () => {
  const [rootNode, setRootNode] = useState<FileNode>(initialFolderStructure);
  const [logs, setLogs] = useState<{ text: string; time: string }[]>([]);

  const addLog = (message: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [{ text: message, time }, ...prev].slice(0, 10));
  };

  const handleInsertNode = (folderId: string, itemName: string, isFolder: boolean) => {
    setRootNode((prevTree) => insertNode(prevTree, folderId, itemName, isFolder));
    addLog(`insertNode: Created ${isFolder ? 'folder' : 'file'} "${itemName}" in parent folder "${folderId}"`);
  };

  const handleDeleteNode = (id: string) => {
    if (id === 'root') {
      addLog('deleteNode: Access denied to delete directory root.');
      return;
    }
    setRootNode((prevTree) => deleteNode(prevTree, id));
    addLog(`deleteNode: Pruned node "${id}" from file explorer tree`);
  };

  const handleResetExplorer = () => {
    setRootNode(initialFolderStructure);
    addLog('File explorer structure reset to default');
  };

  return (
    <div className="playground-container" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2rem' }}>
      {/* File Explorer Panel */}
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '550px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>Recursive File Directory</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Click folders to expand. Create files and folders inside sub-directories recursively.</p>
          </div>
          <button onClick={handleResetExplorer} style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}>Reset Tree</button>
        </div>

        {/* Tree root container */}
        <div style={{ padding: '0.5rem', background: 'rgba(0,0,0,0.1)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <FileNodeComponent
            node={rootNode}
            onInsertNode={handleInsertNode}
            onDeleteNode={handleDeleteNode}
          />
        </div>
      </div>

      {/* Traversal console logs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(8, 12, 24, 0.4)', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
            System Traversal Mechanics
          </h4>
          <div style={{ color: 'var(--text-secondary)' }}>
            This widget maps folders into recursive tree nodes. In LLD:
            <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li><strong>Directory Node Pattern</strong>: Standard structural mapping where folders contain child structures.</li>
              <li><strong>Immutability</strong>: Deep copying is enforced to trigger clean UI updates during state changes.</li>
            </ul>
          </div>
        </div>

        <div className="glass-panel" style={{
          flex: 1,
          background: '#040711',
          padding: '1.5rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)',
        }}>
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.5rem', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>
            &gt; fs_traversal.sh
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '200px' }}>
            {logs.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '3rem' }}>
                Waiting for file system commands...
              </div>
            ) : (
              logs.map((log, index) => (
                <div key={index} style={{ color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>[{log.time}]</span>{' '}
                  <span style={{ color: 'var(--accent-cyan)' }}>[FSUpdate]</span> {log.text}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- DYNAMIC RECURSIVE NODE COMPONENT --- */
interface FileNodeComponentProps {
  node: FileNode;
  onInsertNode: (folderId: string, item: string, isFolder: boolean) => void;
  onDeleteNode: (id: string) => void;
}

const FileNodeComponent: React.FC<FileNodeComponentProps> = ({
  node,
  onInsertNode,
  onDeleteNode,
}) => {
  const [expand, setExpand] = useState(true);
  const [showInput, setShowInput] = useState<{ visible: boolean; isFolder: boolean }>({
    visible: false,
    isFolder: false,
  });
  const [inputVal, setInputVal] = useState('');

  const handleCreateNode = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputVal.trim()) {
      onInsertNode(node.id, inputVal.trim(), showInput.isFolder);
      setShowInput({ ...showInput, visible: false });
      setInputVal('');
      setExpand(true);
    }
  };

  const handleInputBlur = () => {
    setShowInput({ ...showInput, visible: false });
    setInputVal('');
  };

  const triggerInput = (e: React.MouseEvent, isFolder: boolean) => {
    e.stopPropagation(); // Avoid folding the active folder
    setShowInput({ visible: true, isFolder });
    setExpand(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteNode(node.id);
  };

  if (!node.isFolder) {
    return (
      <div
        className="glass-panel"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.4rem 0.75rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid transparent',
          background: 'transparent',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          marginTop: '0.2rem',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.background = 'rgba(255,255,255,0.01)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'transparent'; }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileCode size={14} style={{ color: 'var(--accent-purple)' }} />
          <span>{node.name}</span>
        </div>
        
        <button
          onClick={handleDelete}
          style={{
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            color: 'var(--text-muted)',
            transform: 'none',
            display: 'flex',
            alignItems: 'center',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--error)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <Trash2 size={12} />
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '0.2rem' }}>
      {/* Folder Entry */}
      <div
        onClick={() => setExpand(!expand)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.5rem 0.75rem',
          borderRadius: 'var(--radius-sm)',
          cursor: 'pointer',
          background: 'transparent',
          fontSize: '0.88rem',
          transition: 'background var(--transition-fast)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          {expand ? (
            <FolderOpen size={14} style={{ color: 'var(--accent-cyan)' }} />
          ) : (
            <Folder size={14} style={{ color: 'var(--accent-cyan)' }} />
          )}
          <span>{node.name}</span>
        </div>

        {/* Action button toolbar for folders */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            onClick={(e) => triggerInput(e, false)}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '0.1rem 0.3rem',
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.15rem',
              transform: 'none',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <FilePlus size={12} />
            +File
          </button>
          
          <button
            onClick={(e) => triggerInput(e, true)}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '0.1rem 0.3rem',
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.15rem',
              transform: 'none',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <FolderPlus size={12} />
            +Folder
          </button>

          {node.id !== 'root' && (
            <button
              onClick={handleDelete}
              style={{
                background: 'transparent',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                color: 'var(--text-muted)',
                transform: 'none',
                display: 'flex',
                alignItems: 'center',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--error)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Children list under folders */}
      {expand && (
        <div style={{
          paddingLeft: '1.25rem',
          marginLeft: '0.6rem',
          borderLeft: '1px dashed rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          marginTop: '0.1rem',
        }}>
          {/* Dynamic input box */}
          {showInput.visible && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.2rem 0.75rem' }}>
              <span style={{ fontSize: '0.8rem' }}>{showInput.isFolder ? '📁' : '📄'}</span>
              <input
                autoFocus
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleCreateNode}
                onBlur={handleInputBlur}
                placeholder={`Name of ${showInput.isFolder ? 'folder' : 'file'}...`}
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  borderRadius: '4px',
                  padding: '0.15rem 0.4rem',
                  fontSize: '0.8rem',
                  outline: 'none',
                  width: '180px',
                  fontFamily: 'var(--font-sans)',
                }}
              />
            </div>
          )}

          {/* Children nodes mapping recursive loop */}
          {node.items.map((child) => (
            <FileNodeComponent
              key={child.id}
              node={child}
              onInsertNode={onInsertNode}
              onDeleteNode={onDeleteNode}
            />
          ))}
          {node.items.length === 0 && !showInput.visible && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '0.4rem 0.75rem' }}>
              Empty Directory
            </div>
          )}
        </div>
      )}
    </div>
  );
};
