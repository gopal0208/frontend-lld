import React, { useState } from 'react';
import { Kanban, ArrowRight, ShieldCheck, RefreshCw, Trash2, Plus, Info } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  column: 'todo' | 'progress' | 'done';
}

export const KanbanDemo: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 't1', title: 'Implement debounce custom hook for Search Bar', column: 'done' },
    { id: 't2', title: 'Write Singleton Observer orchestrator for ToastManager', column: 'progress' },
    { id: 't3', title: 'Design recursive tree updates algorithms for Comments', column: 'todo' },
    { id: 't4', title: 'Add dynamic YouTube / Local Video player panel', column: 'todo' },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [draggedOverColumn, setDraggedOverColumn] = useState<'todo' | 'progress' | 'done' | null>(null);
  const [dragLogs, setDragLogs] = useState<{ text: string; time: string }[]>([]);

  const addLog = (message: string) => {
    const time = new Date().toLocaleTimeString();
    setDragLogs((prev) => [{ text: message, time }, ...prev].slice(0, 10));
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    const task: Task = {
      id: 't' + Math.random().toString(36).substring(2, 9),
      title: newTaskTitle,
      column: 'todo',
    };
    setTasks([...tasks, task]);
    setNewTaskTitle('');
    addLog(`Task created: "${task.title}" (ID: ${task.id})`);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
    addLog(`dragstart: Initiated drag on task "${id}"`);
  };

  const handleDragOver = (e: React.DragEvent, column: 'todo' | 'progress' | 'done') => {
    e.preventDefault(); // Crucial to allow dropping
    e.dataTransfer.dropEffect = 'move';
    if (draggedOverColumn !== column) {
      setDraggedOverColumn(column);
      addLog(`dragenter: Dragged card floating over column "${column}"`);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetColumn: 'todo' | 'progress' | 'done') => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;

    if (taskId) {
      const task = tasks.find((t) => t.id === taskId);
      const prevColumn = task?.column;

      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === taskId ? { ...t, column: targetColumn } : t
        )
      );
      addLog(`drop: Moved task "${taskId}" from "${prevColumn}" to "${targetColumn}"`);
    }
    setDraggedTaskId(null);
    setDraggedOverColumn(null);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDraggedOverColumn(null);
    addLog('dragend: Drag cycle completed');
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
    addLog(`Task deleted: ID "${id}"`);
  };

  const handleResetBoard = () => {
    setTasks([
      { id: 't1', title: 'Implement debounce custom hook for Search Bar', column: 'done' },
      { id: 't2', title: 'Write Singleton Observer orchestrator for ToastManager', column: 'progress' },
      { id: 't3', title: 'Design recursive tree updates algorithms for Comments', column: 'todo' },
      { id: 't4', title: 'Add dynamic YouTube / Local Video player panel', column: 'todo' },
    ]);
    addLog('Board reset to default tasks');
  };

  return (
    <div className="playground-container" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
      {/* Board Column Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Task Creator toolbar */}
        <div className="glass-panel" style={{ padding: '1rem 1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Create a new LLD task item..."
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                borderRadius: 'var(--radius-md)',
                padding: '0.5rem 0.75rem',
                fontSize: '0.88rem',
                outline: 'none',
              }}
            />
            <button onClick={handleAddTask} className="btn-primary" style={{ padding: '0.5rem 1rem' }}>
              <Plus size={14} />
              Add Task
            </button>
          </div>

          <button onClick={handleResetBoard} style={{ border: '1px solid var(--border-color)', padding: '0.5rem' }}>
            <RefreshCw size={14} style={{ color: 'var(--text-muted)' }} />
          </button>
        </div>

        {/* The 3 Grid Columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', minHeight: '420px' }}>
          {(['todo', 'progress', 'done'] as const).map((column) => {
            const isDraggedOver = draggedOverColumn === column;
            const columnTasks = tasks.filter((t) => t.column === column);
            
            const colColor = 
              column === 'todo' 
                ? 'var(--accent-cyan)' 
                : column === 'progress' 
                ? 'var(--accent-purple)' 
                : 'var(--success)';

            return (
              <div
                key={column}
                className="glass-panel"
                onDragOver={(e) => handleDragOver(e, column)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column)}
                style={{
                  background: 'rgba(8, 12, 24, 0.4)',
                  padding: '1.25rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  borderColor: isDraggedOver ? colColor : 'var(--border-color)',
                  boxShadow: isDraggedOver ? `0 0 15px -3px ${colColor}` : 'var(--shadow-sm)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: colColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {column}
                  </span>
                  <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '0.1rem 0.4rem', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                    {columnTasks.length}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                  {columnTasks.map((task) => {
                    const isBeingDragged = draggedTaskId === task.id;
                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onDragEnd={handleDragEnd}
                        className="glass-panel"
                        style={{
                          padding: '0.85rem 1rem',
                          background: 'rgba(255,255,255,0.02)',
                          cursor: 'grab',
                          opacity: isBeingDragged ? 0.3 : 1,
                          borderColor: isBeingDragged ? 'var(--border-accent)' : 'var(--border-color)',
                          boxShadow: 'var(--shadow-sm)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.5rem',
                          userSelect: 'none',
                        }}
                      >
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                          {task.title}
                        </span>
                        
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                            color: 'var(--text-muted)',
                            transform: 'none',
                            flexShrink: 0,
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--error)')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    );
                  })}
                  {columnTasks.length === 0 && (
                    <div style={{ flex: 1, border: '1px dashed rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', padding: '2rem 1rem', textAlign: 'center' }}>
                      Drop items here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mechanics Tracker Console */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(8, 12, 24, 0.4)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            HTML5 DnD LifeCycle
          </h4>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={14} style={{ color: 'var(--success)' }} />
              <span><code>e.dataTransfer</code> sets item payloads</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={14} style={{ color: 'var(--success)' }} />
              <span><code>e.preventDefault()</code> enables dropping</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={14} style={{ color: 'var(--success)' }} />
              <span>Immutably swap columns on state trees</span>
            </div>
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
            &gt; drag_events_monitor.sh
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '240px' }}>
            {dragLogs.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '4rem' }}>
                Waiting for drag events...
              </div>
            ) : (
              dragLogs.map((log, index) => (
                <div key={index} style={{ color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>[{log.time}]</span>{' '}
                  <span style={{ color: 'var(--accent-purple)' }}>[DnDAPI]</span> {log.text}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
