import { LLDConcept } from './types';

// ==========================================
// 1. AUTOCOMPLETE SNIPPETS
// ==========================================
const useDebounceCode = `import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce a value
 * @param value The value to debounce
 * @param delay The debounce delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timer to update the debounced value after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if the value changes or the component unmounts
    // This is the core LLD concept of debouncing!
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}`;

const mockApiCode = `/**
 * Simulates a network API search call with cancelability via AbortSignal
 * @param query The search string
 * @param signal AbortSignal from AbortController
 * @param delay Simulated network latency in ms
 */
export const searchProductsMockApi = (
  query: string,
  signal?: AbortSignal,
  delay: number = 600
): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    // Check if already aborted before doing work
    if (signal?.aborted) {
      return reject(new DOMException('Aborted', 'AbortError'));
    }

    const timer = setTimeout(() => {
      const allItems = [
        'React state management',
        'React performance optimization',
        'Vite build configuration',
        'TypeScript utility types',
        'CSS grid systems',
        'Intersection Observer infinite scroll',
        'Low-level system design patterns',
        'Singleton pattern toast manager',
        'Drag and drop kanban columns',
        'Recursive directory folder structure',
        'Debounce vs Throttle functions',
        'Keyboard accessibility guidelines',
        'Glassmorphic layout styles'
      ];

      const filtered = allItems.filter(item =>
        item.toLowerCase().includes(query.toLowerCase())
      );

      resolve(filtered);
    }, delay);

    // Listen to abort signals to cancel the query
    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(timer);
        reject(new DOMException('Aborted', 'AbortError'));
      });
    }
  });
}`;

const autocompleteComponentCode = `import React, { useState, useEffect, useRef } from 'react';
import { useDebounce } from './useDebounce';
import { searchProductsMockApi } from './mockApi';

export const Autocomplete: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [cache, setCache] = useState<Record<string, string[]>>({});
  const [logs, setLogs] = useState<string[]>([]);
  
  const debouncedQuery = useDebounce(query, 400);
  const activeRequestRef = useRef<AbortController | null>(null);

  // Core LLD state machine & side effects
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    // 1. Check local cache (Design pattern: Flyweight / Cache)
    if (cache[debouncedQuery]) {
      setResults(cache[debouncedQuery]);
      log(\`Cache HIT for query: "\${debouncedQuery}"\`);
      return;
    }

    // 2. Abort any previous active request (Request Cancellation pattern)
    if (activeRequestRef.current) {
      activeRequestRef.current.abort();
      log(\`ABORTED previous request for query\`);
    }

    // 3. Spawn a new AbortController
    const controller = new AbortController();
    activeRequestRef.current = controller;

    setLoading(true);
    log(\`INITIATED API request for query: "\${debouncedQuery}"\`);

    searchProductsMockApi(debouncedQuery, controller.signal)
      .then((data) => {
        // Update local cache
        setCache(prev => ({ ...prev, [debouncedQuery]: data }));
        setResults(data);
        log(\`SUCCESS fetched results for: "\${debouncedQuery}"\`);
      })
      .catch((err) => {
        if (err.name === 'AbortError') {
          log(\`CATCH: Request aborted successfully\`);
        } else {
          log(\`ERROR: Failed to fetch\`);
        }
      })
      .finally(() => {
        // Only clear loading state if this is the active controller
        if (activeRequestRef.current === controller) {
          setLoading(false);
          activeRequestRef.current = null;
        }
      });

    return () => {
      controller.abort();
    };
  }, [debouncedQuery]);

  const log = (msg: string) => {
    setLogs(prev => [\`[\${new Date().toLocaleTimeString()}] \${msg}\`, ...prev].slice(0, 10));
  };

  return (
    <div className="autocomplete-widget">
      <input 
        type="text" 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
        placeholder="Type to search..." 
      />
      {loading && <div className="spinner" />}
      <ul className="results">
        {results.map(item => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
};`;

// ==========================================
// 2. TOAST MANAGER SNIPPETS
// ==========================================
const toastServiceCode = `type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

type Subscriber = (toasts: Toast[]) => void;

/**
 * ToastManager - Implements the SINGLETON and OBSERVER design patterns.
 * Coordinates all toast operations globally across the application.
 */
class ToastManager {
  private static instance: ToastManager | null = null;
  private toasts: Toast[] = [];
  private subscribers: Set<Subscriber> = new Set();

  private constructor() {
    // Private constructor ensures no external instantiation (Singleton)
  }

  public static getInstance(): ToastManager {
    if (!ToastManager.instance) {
      ToastManager.instance = new ToastManager();
    }
    return ToastManager.instance;
  }

  // OBSERVER pattern implementation (Subscribe)
  public subscribe(callback: Subscriber): () => void {
    this.subscribers.add(callback);
    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notify() {
    this.subscribers.forEach((callback) => callback([...this.toasts]));
  }

  // Toast Queue Actions
  public show(message: string, type: ToastType = 'info', duration: number = 4000) {
    const toast: Toast = {
      id: Math.random().toString(36).substring(2, 9),
      message,
      type,
      duration,
    };

    // Add to internal queue
    this.toasts = [...this.toasts, toast];
    this.notify();

    // Auto-dismiss timing (Lifecycle management)
    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(toast.id);
      }, duration);
    }
  }

  public dismiss(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  public clearAll() {
    this.toasts = [];
    this.notify();
  }

  public getToasts(): Toast[] {
    return [...this.toasts];
  }
}

// Export Singleton Instance
export const toast = ToastManager.getInstance();`;

const useToastHookCode = `import { useState, useEffect } from 'react';
import { toast, Toast } from './toastService';

/**
 * React hook connecting to the Singleton ToastManager.
 * Listens to active notifications via stateful bindings.
 */
export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>(toast.getToasts());

  useEffect(() => {
    // Subscribe to updates (Observer pattern)
    const unsubscribe = toast.subscribe((newToasts) => {
      setToasts(newToasts);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    toasts,
    dismiss: (id: string) => toast.dismiss(id),
    clearAll: () => toast.clearAll(),
    show: (msg: string, type: any, dur?: number) => toast.show(msg, type, dur),
  };
};`;

const toastContainerCode = `import React from 'react';
import { useToast } from './useToast';

export const ToastContainer: React.FC = () => {
  const { toasts, dismiss } = useToast();

  return (
    <div className="toast-portal-container">
      {toasts.map((item) => (
        <div key={item.id} className={\`toast-card \${item.type}\`}>
          <span>{item.message}</span>
          <button onClick={() => dismiss(item.id)}>&times;</button>
        </div>
      ))}
    </div>
  );
};`;

// ==========================================
// 3. NESTED COMMENTS SNIPPETS
// ==========================================
const nestedCommentsTypesCode = `export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  replies: Comment[];
}`;

const nestedCommentsUtilsCode = `import { Comment } from './types';

/**
 * Recursive tree search and insert helper (LLD Algorithm)
 * Appends a reply comment into a target node ID
 */
export const insertComment = (
  tree: Comment[],
  parentId: string,
  newComment: Comment
): Comment[] => {
  return tree.map((node) => {
    if (node.id === parentId) {
      return {
        ...node,
        replies: [newComment, ...node.replies], // Append at head of replies
      };
    }
    if (node.replies && node.replies.length > 0) {
      return {
        ...node,
        replies: insertComment(node.replies, parentId, newComment),
      };
    }
    return node;
  });
};

/**
 * Recursive tree search and update helper
 * Modifies the content of a specific node
 */
export const updateComment = (
  tree: Comment[],
  commentId: string,
  newText: string
): Comment[] => {
  return tree.map((node) => {
    if (node.id === commentId) {
      return {
        ...node,
        text: newText,
      };
    }
    if (node.replies && node.replies.length > 0) {
      return {
        ...node,
        replies: updateComment(node.replies, commentId, newText),
      };
    }
    return node;
  });
};

/**
 * Recursive tree search and delete helper
 * Prunes a comment and all of its recursive subtree
 */
export const deleteCommentNode = (
  tree: Comment[],
  commentId: string
): Comment[] => {
  // Filter out the deleted comment at this level
  const filtered = tree.filter((node) => node.id !== commentId);
  
  // Recursively apply to child node subtrees
  return filtered.map((node) => {
    if (node.replies && node.replies.length > 0) {
      return {
        ...node,
        replies: deleteCommentNode(node.replies, commentId),
      };
    }
    return node;
  });
};`;

const nestedCommentNodeComponentCode = `import React, { useState } from 'react';
import { Comment } from './types';

interface CommentNodeProps {
  comment: Comment;
  onReply: (parentId: string, text: string) => void;
  onEdit: (commentId: string, text: string) => void;
  onDelete: (commentId: string) => void;
}

export const CommentNode: React.FC<CommentNodeProps> = ({
  comment,
  onReply,
  onEdit,
  onDelete,
}) => {
  const [replyText, setReplyText] = useState('');
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [isEditing, setIsEditing] = useState(false);

  const handleReplySubmit = () => {
    if (replyText.trim()) {
      onReply(comment.id, replyText);
      setReplyText('');
      setShowReplyBox(false);
    }
  };

  const handleEditSubmit = () => {
    if (editText.trim()) {
      onEdit(comment.id, editText);
      setIsEditing(false);
    }
  };

  return (
    <div className="comment-node-card">
      <div className="comment-meta">
        <strong>{comment.author}</strong>
        <span>{comment.timestamp}</span>
      </div>

      {isEditing ? (
        <div className="edit-box">
          <textarea value={editText} onChange={(e) => setEditText(e.target.value)} />
          <button onClick={handleEditSubmit}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <p className="comment-body">{comment.text}</p>
      )}

      {/* Recursive rendering of Replies subtree */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="comment-replies-nest">
          {comment.replies.map((reply) => (
            <CommentNode
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};`;

// ==========================================
// 4. KANBAN BOARD SNIPPETS
// ==========================================
const kanbanBoardCode = `import React, { useState } from 'react';

interface Task {
  id: string;
  title: string;
  column: 'todo' | 'progress' | 'done';
}

export const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 't1', title: 'Design system variables & theme tokens', column: 'done' },
    { id: 't2', title: 'Singleton toast events orchestrator', column: 'progress' },
    { id: 't3', title: 'Recursive nested comment thread tree', column: 'todo' },
  ]);

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  // 1. Triggered on source element when drag starts (LLD drag source)
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  // 2. Triggered on target container when dragged item floats over it (LLD drop target)
  const handleDragOver = (e: React.DragEvent) => {
    // Crucial: Default browser behavior rejects drops. We MUST preventDefault!
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // 3. Triggered on target container when item is dropped (LLD drop execution)
  const handleDrop = (e: React.DragEvent, targetColumn: 'todo' | 'progress' | 'done') => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;

    if (taskId) {
      // Immutably move task to new column state
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === taskId ? { ...t, column: targetColumn } : t
        )
      );
    }
    setDraggedTaskId(null);
  };

  return (
    <div className="kanban-board">
      {(['todo', 'progress', 'done'] as const).map((column) => (
        <div
          key={column}
          className="kanban-column"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column)}
        >
          <h3>{column.toUpperCase()}</h3>
          <div className="task-list">
            {tasks
              .filter((t) => t.column === column)
              .map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  className="task-card"
                >
                  {task.title}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};`;

// ==========================================
// 5. FILE EXPLORER SNIPPETS
// ==========================================
const fileExplorerTypesCode = `export interface FileNode {
  id: string;
  name: string;
  isFolder: boolean;
  items: FileNode[];
}`;

const fileExplorerUtilsCode = `import { FileNode } from './types';

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

const fileExplorerComponentCode = `import React, { useState } from 'react';
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

export const LLD_CONCEPTS_REGISTRY: LLDConcept[] = [
  {
    id: 'autocomplete',
    title: 'Autocomplete (Typeahead)',
    description: 'Highly responsive search bar with custom debouncing, response caching, and AbortController request cancellation.',
    difficulty: 'Medium',
    tags: ['Debouncing', 'AbortController', 'Caching', 'UI States'],
    frameworks: ['React', 'Vanilla'],
    media: {
      type: 'youtube',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
    diagram: `
+-----------------------------------------------------------+
|               DEBOUNCED AUTOCOMPLETE FLOW                 |
+-----------------------------------------------------------+

   [ User Input ]  --> Rapid keystrokes (e.g. "r", "re", "rea")
          |
          v
   [ Debounce Cooldown ] ---> Delay timer resets on keystrokes
          |
     (After 400ms)
          v
   { Is Query in Cache? }
       /          \\
     YES           NO
     /               \\
    v                 v
[ Cache Hit! ]   [ Abort Prior Active Request ] (Prevents Race Conditions)
Load instantly        |
                      v
                 [ Spawn AbortController ]
                      |
                      v
                 [ Dispatch Async API Call ]
                      |
                      +---> (If input changes before return) --> [ Trigger Abort ]
                      |
                      v
                 [ Success: Update Cache & Render ]
`,
    theory: {
      problemStatement: 'Design a highly responsive and performant search input that handles heavy keystrokes without overloading backend services or rendering obsolete query results.',
      coreChallenges: [
        'Preventing API spamming on rapid keyboard typing (Debouncing).',
        'Preventing race conditions where an older, slow request resolves after a newer, fast one (Request Cancellation).',
        'Caching previous search results in-memory to save bandwidth and decrease latency.',
        'Handling loading, error, and empty result boundary states seamlessly.'
      ],
      designPatterns: [
        'Flyweight/Cache: Save previous API returns to load instantly.',
        'Debounce Strategy: Standard throttle/debounce wrappers governing execution timing.',
        'Command/Abort: AbortController API wrapper to cancel active event streams.'
      ],
      keyTakeaways: [
        'Always clean up active timer hooks when values change to prevent memory leaks.',
        'AbortController.abort() triggers a CATCH block with "AbortError" — handle this case explicitly to avoid false errors.',
        'Enforce memory bounds on simple Javascript cache objects to prevent memory exhaustion in infinite runs.'
      ]
    },
    codeFiles: [
      { filename: 'useDebounce.ts', code: useDebounceCode, language: 'typescript' },
      { filename: 'mockApi.ts', code: mockApiCode, language: 'typescript' },
      { filename: 'Autocomplete.tsx', code: autocompleteComponentCode, language: 'typescript' }
    ]
  },
  {
    id: 'toast-manager',
    title: 'Toast Notification Queue',
    description: 'Centralized notification manager built using the Singleton service and Observer subscription hooks.',
    difficulty: 'Medium',
    tags: ['Singleton', 'Observer', 'Event Emitters', 'Portal'],
    frameworks: ['React', 'Vanilla'],
    media: {
      type: 'youtube',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
    diagram: `
+-----------------------------------------------------------+
|          SINGLETON & OBSERVER TOAST SYSTEM DESIGN         |
+-----------------------------------------------------------+

 [ App Component A ]    [ App Component B ]   [ App Component C ]
        |                      |                     |
        v                      v                     v
   +-----------------------------------------------------+
   |             Static Toast Singleton API              |
   |              (toast.show("Message"))                |
   +-----------------------------------------------------+
                             |
                             v
   +-----------------------------------------------------+
   |           Central Singleton ToastManager            |
   |   -----------------------------------------------   |
   |   - private constructor()  (Singleton)            |
   |   - private toastsQueue[]  (State Data)           |
   |   - private subscribersSet (Observers)            |
   +-----------------------------------------------------+
                             |
                             v  (Notifies Subscriptions)
   +-----------------------------------------------------+
   |               useToast Hook Subscriptions           |
   |        (Syncs React state with Singleton Queue)     |
   +-----------------------------------------------------+
                             |
                             v
   +-----------------------------------------------------+
   |             ToastContainer Overlay UI               |
   |         (Renders slide-in portal items)             |
   +-----------------------------------------------------+
`,
    theory: {
      problemStatement: 'Design a unified toast notification service that can be triggered from anywhere inside the codebase (even outside React, like API interceptors or vanilla helper files) and maintains a synchronized animated queue.',
      coreChallenges: [
        'Triggering visual UI notifications from non-React utility files.',
        'Preventing multiple container portals from mounting and duplicating alerts.',
        'Managing independent slide-out lifecycles for multiple queued toasts.',
        'Supporting responsive mobile layouts and custom edge positions.'
      ],
      designPatterns: [
        'Singleton: Ensure one single source of truth holds the notification registry.',
        'Observer: Components subscribe to changes in the Singleton to update state dynamically.'
      ],
      keyTakeaways: [
        'A private constructor guarantees that no code can instantiate duplicate managers.',
        'Return a clean unsubscribe callback inside useEffect to prevent memory leaks.',
        'React portals let us render the toast elements into the root document overlay, resolving CSS nesting issues.'
      ]
    },
    codeFiles: [
      { filename: 'toastService.ts', code: toastServiceCode, language: 'typescript' },
      { filename: 'useToast.ts', code: useToastHookCode, language: 'typescript' },
      { filename: 'ToastContainer.tsx', code: toastContainerCode, language: 'typescript' }
    ]
  },
  {
    id: 'nested-comments',
    title: 'Recursive Comment Threads',
    description: 'Recursively rendered thread interface demonstrating immutability and algorithms for tree operations (add, edit, delete).',
    difficulty: 'Hard',
    tags: ['Recursion', 'Trees', 'Algorithms', 'Immutability'],
    frameworks: ['React'],
    media: {
      type: 'youtube',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
    diagram: `
+-----------------------------------------------------------+
|             RECURSIVE COMMENT TREE STRUCTURE              |
+-----------------------------------------------------------+

   [ Comments Array State ]
      |
      +---> [ Comment c1 ]
      |        |
      |        +--- replies: [ Comment c2 ]
      |                         |
      |                         +--- replies: [ Comment c3 ] (Infinite Nesting)
      |
      +---> [ Comment c4 ]
               |
               +--- replies: []


 * UPDATE STRATEGY (O(N) DFS Recursive Search):
 
       tree.map(node => {
          if (node.id === targetId) {
             return { ...node, replies: [newItem, ...node.replies] };
          }
          if (node.replies.length > 0) {
             return { ...node, replies: insertComment(node.replies, targetId, newItem) };
          }
          return node;
       })
`,
    theory: {
      problemStatement: 'Design a self-referential threads UI component that displays user replies nested recursively, supporting reply insertions, node edits, and subtree deletions without violating state immutability.',
      coreChallenges: [
        'Designing a recursive React component that calls itself correctly.',
        'Executing node insertions/deletions deep inside nested trees without mutating original arrays.',
        'Adding visual guides (thread lines) that map parent-child connections gracefully.',
        'Optimizing component re-renders when a single comment node is edited.'
      ],
      designPatterns: [
        'Composite/Tree: Group objects into tree structures to represent part-whole hierarchies.',
        'Recursive DFS (Depth-First Search): Traverse nested arrays to locate targeted nodes.'
      ],
      keyTakeaways: [
        'State immutability is preserved by recreating arrays and objects at every parent folder level during map traversal.',
        'Use thread lines styled with CSS borders to improve readability of nested conversations.',
        'Set depth maximum thresholds to prevent layouts from scaling out of screen bounds on mobile devices.'
      ]
    },
    codeFiles: [
      { filename: 'types.ts', code: nestedCommentsTypesCode, language: 'typescript' },
      { filename: 'utils.ts', code: nestedCommentsUtilsCode, language: 'typescript' },
      { filename: 'CommentNode.tsx', code: nestedCommentNodeComponentCode, language: 'typescript' }
    ]
  },
  {
    id: 'kanban-board',
    title: 'Drag-and-Drop Kanban Board',
    description: 'Custom implementation of a Kanban layout using native HTML5 Drag & Drop API hooks and state column transfers.',
    difficulty: 'Medium',
    tags: ['Drag and Drop', 'Events API', 'State Flow', 'Gestures'],
    frameworks: ['React'],
    media: {
      type: 'youtube',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
    diagram: `
+-----------------------------------------------------------+
|               HTML5 DRAG AND DROP LIFECYCLE               |
+-----------------------------------------------------------+

   [ Source Card ]                               [ Drop Column ]
          |                                             |
   (onDragStart)                                        |
   Set payload via e.dataTransfer                       |
          |                                             |
          +-----------> [ Float over column ] ---------->|
          |                  |                          |
          |             (onDragOver)                    |
          |          Call e.preventDefault()            |
          |          Highlight column border            |
          |                  |                          |
          |                  v                          |
          +-----------> [ Card Dropped ] -------------->|
                             |                          |
                         (onDrop)                       |
                    Get payload via dataTransfer        |
                    Update board column state           |
`,
    theory: {
      problemStatement: 'Build an interactive Kanban column layout using HTML5 native Drag & Drop APIs, maintaining strict drop state transfers and hover indicators.',
      coreChallenges: [
        'Interfacing with complex, non-intuitive browser Drag and Drop APIs.',
        'Enabling drop areas correctly (browsers block drops by default).',
        'Transferring unique item IDs cleanly between source elements and destination zones.',
        'Creating smooth transitions and drag highlight indicators.'
      ],
      designPatterns: [
        'Command Transfer: Utilizing standard e.dataTransfer buffers to pass payloads.',
        'State Machine: Modeling cards as floating states shifting columns on drop actions.'
      ],
      keyTakeaways: [
        'Always include e.preventDefault() on your onDragOver callback, otherwise onDrop will never fire.',
        'Clean up drop-zone highlighting using onDragLeave and onDragEnd events.',
        'Use custom transfer payloads via e.dataTransfer.setData to avoid keeping large structures in global variables.'
      ]
    },
    codeFiles: [
      { filename: 'KanbanBoard.tsx', code: kanbanBoardCode, language: 'typescript' }
    ]
  },
  {
    id: 'file-explorer',
    title: 'File Explorer Directory',
    description: 'Recursive system folder tree showing expand actions, path traversals, and file creation and deletion options.',
    difficulty: 'Hard',
    tags: ['Recursion', 'Folders System', 'Tree Traversal', 'CRUD'],
    frameworks: ['React'],
    media: {
      type: 'youtube',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
    diagram: `
+-----------------------------------------------------------+
|             FILE EXPLORER COMPONENT DIRECTORY             |
+-----------------------------------------------------------+

   [ Root Folder: "frontend-lld" ]
      |
      +--- items: [ Folder: "src" ]
      |              |
      |              +--- items: [ File: "App.tsx" ]
      |              +--- items: [ Folder: "components" ]
      |                             |
      |                             +--- items: [ File: "Sidebar.tsx" ]
      |
      +--- items: [ File: "package.json" ]


 * DIRECTORY TRAVERSAL ALGORITHM:
 
    insertNode(tree, parentFolderId, name, isFolder):
       If tree.id matches parentFolderId:
          Append new FileNode into tree.items array
       Else:
          Recursively call insertNode on all child items
`,
    theory: {
      problemStatement: 'Design a file explorer tree widget similar to VS Code, supporting recursive foldering directories, sub-item adding/deletions, and expand toggle states.',
      coreChallenges: [
        'Structuring recursive file objects mapping parent folders to children items.',
        'Designing inline file creation triggers without breaking tree navigation states.',
        'Providing responsive indentation depth and visual folder-open indicators.',
        'Preventing root folder deletion operations.'
      ],
      designPatterns: [
        'Composite Hierarchy: File and Folder nodes inherit the same baseline properties, creating a unified node composite.',
        'Tree Traversals: Searching, inserting, and deleting nodes recursively via DFS.'
      ],
      keyTakeaways: [
        'Treat folder expansions as local component state (expand boolean) rather than global tree data.',
        'Validate inputs during inline creations (avoid duplicate or blank item names).',
        'Block node deletions for folder roots ("root" ID check) to secure folder integrity.'
      ]
    },
    codeFiles: [
      { filename: 'types.ts', code: fileExplorerTypesCode, language: 'typescript' },
      { filename: 'utils.ts', code: fileExplorerUtilsCode, language: 'typescript' },
      { filename: 'FileNode.tsx', code: fileExplorerComponentCode, language: 'typescript' }
    ]
  }
];
