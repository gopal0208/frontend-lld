import React, { useState, useEffect } from 'react';
import { Send, Layers, CheckCircle, Database } from 'lucide-react';

// Actual Singleton Implementation to run inside the browser
class StateSingleton {
  private static instance: StateSingleton | null = null;
  private logs: string[] = [];
  private listeners: Set<() => void> = new Set();

  private constructor() {}

  public static getInstance(): StateSingleton {
    if (!StateSingleton.instance) {
      StateSingleton.instance = new StateSingleton();
    }
    return StateSingleton.instance;
  }

  public log(msg: string) {
    const timestamp = new Date().toLocaleTimeString();
    this.logs.push(`[${timestamp}] ${msg}`);
    this.notify();
  }

  public getLogs() {
    return [...this.logs];
  }

  public clear() {
    this.logs = [];
    this.notify();
  }

  public subscribe(cb: () => void) {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb());
  }
}

export const SingletonDemo: React.FC = () => {
  const singletonInstance = StateSingleton.getInstance();
  const [logs, setLogs] = useState<string[]>([]);
  const [alphaInput, setAlphaInput] = useState('');
  const [betaInput, setBetaInput] = useState('');

  useEffect(() => {
    const unsubscribe = singletonInstance.subscribe(() => {
      setLogs(singletonInstance.getLogs());
    });
    setLogs(singletonInstance.getLogs());
    return unsubscribe;
  }, []);

  const handleAlphaLog = () => {
    if (alphaInput.trim()) {
      singletonInstance.log(`[Alpha] ${alphaInput}`);
      setAlphaInput('');
    }
  };

  const handleBetaLog = () => {
    if (betaInput.trim()) {
      singletonInstance.log(`[Beta] ${betaInput}`);
      setBetaInput('');
    }
  };

  return (
    <div className="playground-container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
      {/* Sandbox Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Component Alpha Card */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(168, 85, 247, 0.03)' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-purple)', marginBottom: '0.75rem' }}>Component Alpha</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Operates on `StateSingleton.getInstance()` reference.</p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Log from Alpha..."
              value={alphaInput}
              onChange={(e) => setAlphaInput(e.target.value)}
              style={{
                flex: 1,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
            <button onClick={handleAlphaLog} className="btn-primary" style={{ padding: '0.5rem 0.8rem' }}>
              <Send size={12} />
            </button>
          </div>
        </div>

        {/* Component Beta Card */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(6, 182, 212, 0.03)' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '0.75rem' }}>Component Beta</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Operates on the SAME `StateSingleton.getInstance()` reference.</p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Log from Beta..."
              value={betaInput}
              onChange={(e) => setBetaInput(e.target.value)}
              style={{
                flex: 1,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
            <button onClick={handleBetaLog} className="btn-primary" style={{ padding: '0.5rem 0.8rem' }}>
              <Send size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Memory Reference and Shared State View */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Verification Check */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(8, 12, 24, 0.4)' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={16} style={{ color: 'var(--success)' }} />
            Memory References Identity Check
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
            <pre style={{ background: '#000', padding: '0.75rem', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              const refA = StateSingleton.getInstance();<br/>
              const refB = StateSingleton.getInstance();<br/>
              console.log(refA === refB);
            </pre>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(34, 197, 94, 0.05)', padding: '0.5rem 0.75rem', borderRadius: '4px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
              <span style={{ fontWeight: 600 }}>Object Identity:</span>
              <span style={{ color: 'var(--success)', fontWeight: 800, fontSize: '0.95rem' }}>TRUE (Same Heap Address)</span>
            </div>
          </div>
        </div>

        {/* Centralized Logger Panel */}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.5rem', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>
            <span>&gt; shared_singleton_logs.log</span>
            <button onClick={() => singletonInstance.clear()} style={{ background: 'transparent', border: 'none', padding: 0, fontSize: '0.75rem', cursor: 'pointer', color: 'var(--text-muted)' }}>clear</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '180px' }}>
            {logs.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2.5rem' }}>
                No events recorded. Submit data above.
              </div>
            ) : (
              logs.map((log, index) => (
                <div key={index} style={{ color: log.includes('[Alpha]') ? 'var(--accent-purple)' : 'var(--accent-cyan)' }}>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
