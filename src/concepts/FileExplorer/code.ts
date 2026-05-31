export const fileExplorerTypesCode = `export interface FileNode {
  id: string;
  name: string;
  isFolder: boolean;
  items: FileNode[];
}`;

export const fileExplorerUtilsCode = `import { FileNode } from './types';

/**
 * Recursive tree search & insert helper
 * Appends a file or folder inside a targeted parent ID
 */
export const insertNode = (
  tree: FileNode,
  folderId: string,
  item: string,
  isFolder: boolean
): FileNode => {
  // If target folder is found, add the new item inside it
  if (tree.id === folderId && tree.isFolder) {
    const newItem: FileNode = {
      id: Math.random().toString(36).substring(2, 9),
      name: item,
      isFolder,
      items: [],
    };
    return {
      ...tree,
      items: [newItem, ...tree.items],
    };
  }

  // Otherwise recurse down the tree
  const updatedItems = tree.items.map((node) =>
    insertNode(node, folderId, item, isFolder)
  );

  return {
    ...tree,
    items: updatedItems,
  };
};

/**
 * Recursive tree search & delete helper
 * Prunes a specific file or folder by ID
 */
export const deleteNode = (tree: FileNode, id: string): FileNode => {
  // Filter out the deleted node from the immediate children
  const filtered = tree.items.filter((node) => node.id !== id);

  // Recursively apply to all remaining child folders
  const updatedItems = filtered.map((node) => deleteNode(node, id));

  return {
    ...tree,
    items: updatedItems,
  };
};`;

export const fileExplorerComponentCode = `import React, { useState } from 'react';
import { FileNode } from './types';

interface FileNodeComponentProps {
  node: FileNode;
  onInsertNode: (folderId: string, item: string, isFolder: boolean) => void;
  onDeleteNode: (id: string) => void;
}

export const FileNodeComponent: React.FC<FileNodeComponentProps> = ({
  node,
  onInsertNode,
  onDeleteNode,
}) => {
  const [expand, setExpand] = useState(false);
  const [showInput, setShowInput] = useState<{ visible: boolean; isFolder: boolean }>({
    visible: false,
    isFolder: false,
  });

  const handleCreateNode = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      onInsertNode(node.id, e.currentTarget.value, showInput.isFolder);
      setShowInput({ ...showInput, visible: false });
      setExpand(true);
    }
  };

  if (!node.isFolder) {
    return (
      <div className="file-item">
        <span>📄 {node.name}</span>
        <button onClick={() => onDeleteNode(node.id)}>&times;</button>
      </div>
    );
  }

  return (
    <div className="folder-item">
      <div className="folder-header" onClick={() => setExpand(!expand)}>
        <span>📁 {node.name}</span>
        {/* Creation triggers */}
        <button onClick={() => setShowInput({ visible: true, isFolder: false })}>+ File</button>
        <button onClick={() => setShowInput({ visible: true, isFolder: true })}>+ Folder</button>
      </div>

      {expand && (
        <div className="folder-children" style={{ paddingLeft: '1.2rem' }}>
          {/* Node Creation Input Field */}
          {showInput.visible && (
            <input
              autoFocus
              onKeyDown={handleCreateNode}
              onBlur={() => setShowInput({ ...showInput, visible: false })}
            />
          )}

          {/* Recursive Render children */}
          {node.items.map((child) => (
            <FileNodeComponent
              key={child.id}
              node={child}
              onInsertNode={onInsertNode}
              onDeleteNode={onDeleteNode}
            />
          ))}
        </div>
      )}
    </div>
  );
};`;
