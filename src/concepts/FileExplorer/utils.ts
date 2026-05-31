import { FileNode } from './types';

export const insertNode = (
  tree: FileNode,
  folderId: string,
  item: string,
  isFolder: boolean
): FileNode => {
  if (tree.id === folderId && tree.isFolder) {
    const newItem: FileNode = {
      id: 'f' + Math.random().toString(36).substring(2, 9),
      name: item,
      isFolder,
      items: [],
    };
    return {
      ...tree,
      items: [newItem, ...tree.items],
    };
  }

  const updatedItems = tree.items.map((node) =>
    insertNode(node, folderId, item, isFolder)
  );

  return {
    ...tree,
    items: updatedItems,
  };
};

export const deleteNode = (tree: FileNode, id: string): FileNode => {
  const filtered = tree.items.filter((node) => node.id !== id);
  const updatedItems = filtered.map((node) => deleteNode(node, id));

  return {
    ...tree,
    items: updatedItems,
  };
};
