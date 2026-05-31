import React, { useState } from 'react';
import { toast, ToastType } from './toastService';
import { useToast } from './useToast';
import { ToastContainer } from './ToastContainer';
import { PlusCircle, RefreshCw, Trash2, Eye, ShieldAlert, Award } from 'lucide-react';

export const ToastDemo: React.FC = () => {
  const { toasts } = useToast();
  const [customMsg, setCustomMsg] = useState('New LLD concept loaded!');
  const [selectedType, setSelectedType] = useState<ToastType>('success');
  const [duration, setDuration] = useState(4000);
  const [position, setPosition] = useState<'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'>('top-right');
  const [demoLogs, setDemoLogs] = useState<{ text: string; time: string }[]>([]);

  const addLog = (message: string) => {
    const time = new Date().toLocaleTimeString();
    setDemoLogs((prev) => [{ text: message, time }, ...prev].slice(0, 10));
  };

  const triggerToast = () => {
    toast.show(customMsg, selectedType, duration);
    addLog(`Singleton triggered: show("${customMsg}", "${selectedType}", ${duration}ms)`);
  };

  const triggerPredefined = (msg: string, type: ToastType) => {
    toast.show(msg, type, duration);
    addLog(`Predefined action: show("${msg}", "${type}", ${duration}ms)`);
  };

  const handleClearAll = () => {
    toast.clearAll();
    addLog('Singleton Action: clearAll() triggered');
  };

  return (
    <div className="playground-container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
      {/* Dynamic Controls Deck */}
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>Singleton Toast Control Deck</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Instantiate toasts via the unified static service interface. Adjust constraints in real-time.</p>
        </div>

        {/* Input Text fields */}
        <div className="playground-knob">
          <label>Custom Notification Message</label>
          <input
            type="text"
            value={customMsg}
            onChange={(e) => setCustomMsg(e.target.value)}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              borderRadius: 'var(--radius-md)',
              padding: '0.6rem 0.8rem',
              fontSize: '0.9rem',
              outline: 'none',
            }}
          />
        </div>

        {/* Dynamic type selectors */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Notification Type</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
            {(['success', 'error', 'info', 'warning'] as ToastType[]).map((type) => {
              const active = type === selectedType;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  style={{
                    padding: '0.5rem',
                    fontSize: '0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid ' + (active ? `var(--${type === 'info' ? 'accent-cyan' : type})` : 'var(--border-color)'),
                    background: active ? `rgba(168, 85, 247, 0.1)` : 'transparent',
                    color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                    textTransform: 'capitalize',
                  }}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        {/* Portal settings */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="playground-knob">
            <label>Duration: {duration === 0 ? 'Infinite' : `${duration}ms`}</label>
            <input
              type="range"
              min="0"
              max="10000"
              step="1000"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="playground-input-range"
            />
          </div>

          <div className="playground-knob">
            <label>Portal View Position</label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value as any)}
              className="playground-select"
            >
              <option value="top-right">Top Right</option>
              <option value="top-left">Top Left</option>
              <option value="bottom-right">Bottom Right</option>
              <option value="bottom-left">Bottom Left</option>
            </select>
          </div>
        </div>

        {/* Trigger buttons */}
        <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
          <button onClick={triggerToast} className="btn-primary" style={{ flex: 1 }}>
            <PlusCircle size={16} />
            Spawn Notification
          </button>
          <button onClick={handleClearAll} style={{ border: '1px solid var(--error)', color: 'var(--error)' }}>
            <Trash2 size={16} />
            Clear Queue
          </button>
        </div>

        {/* Predefined quick test */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Quick Simulations</span>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button onClick={() => triggerPredefined('Profile updated successfully!', 'success')} style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}>
              🎉 Update Profile
            </button>
            <button onClick={() => triggerPredefined('API Request failed (Code 500)', 'error')} style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}>
              ❌ Fail Server Connect
            </button>
            <button onClick={() => triggerPredefined('Rate limit reached. Cooling down...', 'warning')} style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}>
              ⚠️ Rate Limiter Warning
            </button>
          </div>
        </div>
      </div>

      {/* Singleton Inspector Terminal */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Class Metrics */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(8, 12, 24, 0.4)' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Singleton Memory Inspector
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ACTIVE INSTANCES</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-purple)' }}>1</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>(Strict Singleton Pattern)</div>
            </div>
            <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>QUEUE SIZE</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success)' }}>{toasts.length}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>(Items in Event Stream)</div>
            </div>
          </div>
        </div>

        {/* Live Subscriptions Logger */}
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
            &gt; observer_stream.log
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '180px' }}>
            {demoLogs.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>
                Waiting for publisher events...
              </div>
            ) : (
              demoLogs.map((log, index) => (
                <div key={index} style={{ color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>[{log.time}]</span>{' '}
                  <span style={{ color: 'var(--accent-cyan)' }}>[PubSub]</span> {log.text}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Render active notifications portal dynamically inside the dashboard */}
      <ToastContainer position={position} />
    </div>
  );
};
