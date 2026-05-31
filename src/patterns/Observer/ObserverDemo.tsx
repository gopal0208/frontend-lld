import React, { useState } from 'react';
import { Eye, EyeOff, Radio, Plus, Trash2 } from 'lucide-react';

interface VisualObserver {
  id: string;
  name: string;
  lastReceived: number | null;
  attached: boolean;
}

export const ObserverDemo: React.FC = () => {
  const [subjectState, setSubjectState] = useState(50);
  const [observers, setObservers] = useState<VisualObserver[]>([
    { id: 'o1', name: 'UI Chart Element', lastReceived: 50, attached: true },
    { id: 'o2', name: 'Analytics Tracker', lastReceived: 50, attached: true },
    { id: 'o3', name: 'Database Logger', lastReceived: 50, attached: false },
  ]);

  const updateSubjectState = (newVal: number) => {
    setSubjectState(newVal);
    // Notify all ATTACHED observers (Observer notification logic)
    setObservers((prev) =>
      prev.map((obs) =>
        obs.attached ? { ...obs, lastReceived: newVal } : obs
      )
    );
  };

  const handleToggleAttach = (id: string) => {
    setObservers((prev) =>
      prev.map((obs) => {
        if (obs.id === id) {
          const nextAttached = !obs.attached;
          return {
            ...obs,
            attached: nextAttached,
            // Capture state immediately if attaching
            lastReceived: nextAttached ? subjectState : obs.lastReceived,
          };
        }
        return obs;
      })
    );
  };

  const handleAddObserver = () => {
    const id = 'o' + Math.random().toString(36).substring(2, 9);
    const names = ['Status Bar indicator', 'DevConsole Monitor', 'API Webhook sync', 'Cache Refresher'];
    const selectedName = names[observers.length % names.length] + ` (${id.slice(0, 3)})`;
    
    setObservers([
      ...observers,
      { id, name: selectedName, lastReceived: subjectState, attached: true }
    ]);
  };

  const handleDeleteObserver = (id: string) => {
    setObservers(observers.filter((o) => o.id !== id));
  };

  return (
    <div className="playground-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2rem' }}>
      {/* Subject Controller */}
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'center' }}>
        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Radio size={18} className="animate-float" style={{ color: 'var(--accent-purple)' }} />
            The Subject (Publisher)
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Changes state here and triggers instant update broadcasts to all attached observers.</p>
        </div>

        <div className="playground-knob" style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span>Publisher Internal State Value:</span>
            <strong style={{ color: 'var(--accent-purple)', fontSize: '1.1rem' }}>{subjectState}</strong>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={subjectState}
            onChange={(e) => updateSubjectState(parseInt(e.target.value))}
            className="playground-input-range"
            style={{ width: '100%', marginTop: '0.5rem' }}
          />
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Broadcasting to {observers.filter(o => o.attached).length} observers</span>
          <button onClick={handleAddObserver} className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
            <Plus size={12} /> Add Observer
          </button>
        </div>
      </div>

      {/* Visual Observers List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Registered Observers</h4>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {observers.map((obs) => {
            const col = obs.attached ? 'var(--accent-cyan)' : 'var(--text-muted)';
            return (
              <div
                key={obs.id}
                className="glass-panel"
                style={{
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: obs.attached ? 'rgba(6, 182, 212, 0.02)' : 'rgba(255,255,255,0.01)',
                  borderColor: obs.attached ? 'rgba(6, 182, 212, 0.3)' : 'var(--border-color)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button
                    onClick={() => handleToggleAttach(obs.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      color: col,
                      transform: 'none',
                    }}
                  >
                    {obs.attached ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: obs.attached ? 'var(--text-primary)' : 'var(--text-muted)' }}>{obs.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {obs.attached ? '🟢 Listening to updates' : '🔴 Unsubscribed / Idle'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>State Received:</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: obs.attached ? 'var(--success)' : 'var(--text-muted)' }}>
                      {obs.lastReceived !== null ? obs.lastReceived : '--'}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteObserver(obs.id)}
                    style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--text-muted)', transform: 'none' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--error)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
