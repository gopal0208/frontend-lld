export const kanbanBoardCode = `import React, { useState } from 'react';

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
