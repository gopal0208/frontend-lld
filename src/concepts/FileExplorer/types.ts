export interface FileNode {
  id: string;
  name: string;
  isFolder: boolean;
  items: FileNode[];
}
