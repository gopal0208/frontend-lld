import React, { useState } from 'react';
import { Terminal, PlayCircle, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';

interface DynamicDemoProps {
  title: string;
  codeFiles: { filename: string; code: string }[];
}

export const DynamicDemo: React.FC<DynamicDemoProps> = ({ title, codeFiles }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [activeCode, setActiveCode] = useState(codeFiles[0]?.code || '');
  const [isRunning, setIsRunning] = useState(false);

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${timestamp}] ${msg}`, ...prev].slice(0, 10));
  };

  const handleRunSimulation = () => {
    setIsRunning(true);
    addLog(`Initiated compiler check for "${title}"...`);
    
    setTimeout(() => {
      addLog(`Parsing source files: [${codeFiles.map(f => f.filename).join(', ')}]`);
    }, 400);

    setTimeout(() => {
      addLog(`Success: Compilation complete (0 warnings).`);
      addLog(`Running isolated simulation...`);
      setIsRunning(false);
    }, 1200);
  };

  return (
    <div className="playground-container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
      {/* Code Editor Panel */}
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} style={{ color: 'var(--accent-purple)' }} />
            Dynamic Compilation Sandbox
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>You can modify the code below and run the mock execution simulation.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {codeFiles[0]?.filename || 'sandbox.ts'}
          </span>
          <textarea
            value={activeCode}
            onChange={(e) => setActiveCode(e.target.value)}
            rows={12}
            style={{
              width: '100%',
              background: 'rgb(8, 10, 19)',
              border: '1px solid var(--border-color)',
              color: '#fff',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              resize: 'none',
              outline: 'none',
            }}
          />
        </div>

        <button onClick={handleRunSimulation} className="btn-primary" disabled={isRunning} style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
          <PlayCircle size={14} style={{ animation: isRunning ? 'spin 1s linear infinite' : 'none' }} />
          {isRunning ? 'Compiling...' : 'Run Simulation'}
        </button>
      </div>

      {/* Terminal logs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(8, 12, 24, 0.4)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Interactive Sandbox Info
          </h4>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={14} style={{ color: 'var(--success)' }} />
              <span>Editable code buffer in local RAM</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={14} style={{ color: 'var(--success)' }} />
              <span>Dynamic simulation logs output</span>
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
          minHeight: '200px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.5rem', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>
            <span>&gt; sandbox_output.log</span>
            <button onClick={() => setLogs([])} style={{ background: 'transparent', border: 'none', padding: 0, fontSize: '0.75rem', cursor: 'pointer', color: 'var(--text-muted)' }}>clear</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '180px' }}>
            {logs.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '3.5rem' }}>
                Press "Run Simulation" above to execute...
              </div>
            ) : (
              logs.map((log, index) => (
                <div key={index} style={{ color: 'var(--text-secondary)' }}>
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
