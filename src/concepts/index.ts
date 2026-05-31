import React from 'react';
import { LLDConcept } from './types';

// Interactive Playground Demos
import { AutocompleteDemo } from './Autocomplete/AutocompleteDemo';
import { ToastDemo } from './ToastManager/ToastDemo';
import { CommentDemo } from './NestedComments/CommentDemo';
import { KanbanDemo } from './KanbanBoard/KanbanDemo';
import { FileExplorerDemo } from './FileExplorer/FileExplorerDemo';

// Code Snippet Strings
import { useDebounceCode, mockApiCode, autocompleteComponentCode } from './Autocomplete/code';
import { toastServiceCode, useToastHookCode, toastContainerCode } from './ToastManager/code';
import { nestedCommentsTypesCode, nestedCommentsUtilsCode, nestedCommentNodeComponentCode } from './NestedComments/code';
import { kanbanBoardCode } from './KanbanBoard/code';
import { fileExplorerTypesCode, fileExplorerUtilsCode, fileExplorerComponentCode } from './FileExplorer/code';

export const LLD_CONCEPTS_REGISTRY: LLDConcept[] = [
  {
    id: 'autocomplete',
    title: 'Autocomplete (Typeahead)',
    description: 'Highly responsive search bar with custom debouncing, response caching, and AbortController request cancellation.',
    difficulty: 'Medium',
    tags: ['Debouncing', 'AbortController', 'Caching', 'UI States'],
    media: {
      type: 'youtube',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder default embed. User can easily replace!
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
    demoComponent: React.createElement(AutocompleteDemo),
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
    demoComponent: React.createElement(ToastDemo),
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
    demoComponent: React.createElement(CommentDemo),
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
    demoComponent: React.createElement(KanbanDemo),
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
`
    ,
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
    demoComponent: React.createElement(FileExplorerDemo),
    codeFiles: [
      { filename: 'types.ts', code: fileExplorerTypesCode, language: 'typescript' },
      { filename: 'utils.ts', code: fileExplorerUtilsCode, language: 'typescript' },
      { filename: 'FileNode.tsx', code: fileExplorerComponentCode, language: 'typescript' }
    ]
  }
];
