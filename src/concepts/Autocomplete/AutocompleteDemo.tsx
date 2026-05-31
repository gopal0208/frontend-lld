import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, Wifi, Database, Ban, ShieldAlert } from 'lucide-react';

// Mock database of items
const allItems = [
  'React state management',
  'React performance optimization',
  'React virtual DOM reconciliation',
  'Vite build configuration',
  'TypeScript utility types',
  'CSS grid systems',
  'CSS Flexbox Layouts',
  'Intersection Observer infinite scroll',
  'Low-level system design patterns',
  'Singleton pattern toast manager',
  'Drag and drop kanban columns',
  'Recursive directory folder structure',
  'Debounce vs Throttle functions',
  'Keyboard accessibility guidelines',
  'Glassmorphic layout styles',
  'Factory design pattern',
  'Observer design pattern',
  'Pub-Sub communication systems'
];

export const AutocompleteDemo: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [cache, setCache] = useState<Record<string, string[]>>({});
  const [logs, setLogs] = useState<string[]>([]);
  
  // Custom interactive knobs
  const [debounceDelay, setDebounceDelay] = useState(400);
  const [networkLatency, setNetworkLatency] = useState(800);
  const [cacheEnabled, setCacheEnabled] = useState(true);

  // Dynamic state for debounce trigger
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const activeRequestRef = useRef<AbortController | null>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Helper log function
  const addLog = (message: string, type: 'info' | 'success' | 'abort' | 'cache' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const formattedMsg = `[${timestamp}] ${message}`;
    setLogs((prev) => [
      { text: formattedMsg, type } as any,
      ...prev
    ].slice(0, 30)); // Cap logs to last 30 entries
  };

  // 1. Debouncing effect (Manually written to show visual timings)
  useEffect(() => {
    if (!query) {
      setDebouncedQuery('');
      setResults([]);
      return;
    }

    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceDelay);

    return () => {
      clearTimeout(handler);
    };
  }, [query, debounceDelay]);

  // 2. Main query execution
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    // A. Check local cache
    if (cacheEnabled && cache[debouncedQuery]) {
      setResults(cache[debouncedQuery]);
      addLog(`Cache HIT for "${debouncedQuery}" — instantly loaded!`, 'cache');
      return;
    }

    // B. Abort active request
    if (activeRequestRef.current) {
      activeRequestRef.current.abort();
      addLog(`ABORTING active request in-flight (new input received)`, 'abort');
    }

    // C. Spawn AbortController
    const controller = new AbortController();
    activeRequestRef.current = controller;

    setLoading(true);
    addLog(`INITIATING Fetch for "${debouncedQuery}" (latency: ${networkLatency}ms)`, 'info');

    // Simulate network query
    const simulateFetch = () => {
      return new Promise<string[]>((resolve, reject) => {
        const timer = setTimeout(() => {
          const filtered = allItems.filter(item =>
            item.toLowerCase().includes(debouncedQuery.toLowerCase())
          );
          resolve(filtered);
        }, networkLatency);

        controller.signal.addEventListener('abort', () => {
          clearTimeout(timer);
          reject(new DOMException('Aborted', 'AbortError'));
        });
      });
    };

    simulateFetch()
      .then((data) => {
        if (cacheEnabled) {
          setCache((prev) => ({ ...prev, [debouncedQuery]: data }));
        }
        setResults(data);
        addLog(`SUCCESS: Received ${data.length} items for "${debouncedQuery}"`, 'success');
      })
      .catch((err) => {
        if (err.name === 'AbortError') {
          addLog(`NETWORK CANCELED: Fetch for "${debouncedQuery}" aborted successfully`, 'abort');
        } else {
          addLog(`ERROR: Network call failed`, 'abort');
        }
      })
      .finally(() => {
        if (activeRequestRef.current === controller) {
          setLoading(false);
          activeRequestRef.current = null;
        }
      });

    return () => {
      controller.abort();
    };
  }, [debouncedQuery, networkLatency, cacheEnabled]);

  const clearCache = () => {
    setCache({});
    addLog('System memory cache cleared.', 'info');
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="playground-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      {/* Search Interaction Interface */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>Debounced Autocomplete Search</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Type rapidly below to witness debouncing and request cancellation in action.</p>
          </div>

          <div style={{ position: 'relative', width: '100%' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              transition: 'border-color var(--transition-fast)',
            }}>
              <Search size={18} style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles e.g., 'react', 'css', 'design'..."
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  outline: 'none',
                  width: '100%',
                  fontFamily: 'var(--font-sans)',
                }}
              />
              {loading && <Loader2 size={18} className="animate-float" style={{ color: 'var(--accent-cyan)', animation: 'spin 1s linear infinite' }} />}
            </div>
            
            {/* Realtime dropdown list */}
            {query && (
              <div className="glass-panel" style={{
                position: 'absolute',
                top: '105%',
                left: 0,
                right: 0,
                zIndex: 100,
                background: 'rgba(10, 15, 30, 0.95)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                maxHeight: '260px',
                overflowY: 'auto',
                boxShadow: 'var(--shadow-lg)',
                padding: '0.5rem',
              }}>
                {loading && results.length === 0 && (
                  <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                    <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    <span style={{ fontSize: '0.85rem' }}>Fetching results...</span>
                  </div>
                )}
                {!loading && results.length === 0 && (
                  <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    No results found for "{query}"
                  </div>
                )}
                {results.map((item) => (
                  <div
                    key={item}
                    style={{
                      padding: '0.6rem 0.8rem',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      transition: 'background var(--transition-fast)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <Search size={14} style={{ color: 'var(--accent-purple)', opacity: 0.6 }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interactive Parameters Knobs */}
          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Performance Control Deck</span>
            
            <div className="playground-knob">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <label>Debounce Delay: {debounceDelay}ms</label>
                <span style={{ color: 'var(--accent-purple)' }}>Cooldown</span>
              </div>
              <input
                type="range"
                min="100"
                max="1500"
                step="50"
                value={debounceDelay}
                onChange={(e) => setDebounceDelay(parseInt(e.target.value))}
                className="playground-input-range"
              />
            </div>

            <div className="playground-knob">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <label>Network Latency: {networkLatency}ms</label>
                <span style={{ color: 'var(--accent-cyan)' }}>Simulated Lag</span>
              </div>
              <input
                type="range"
                min="0"
                max="3000"
                step="100"
                value={networkLatency}
                onChange={(e) => setNetworkLatency(parseInt(e.target.value))}
                className="playground-input-range"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={cacheEnabled}
                  onChange={(e) => setCacheEnabled(e.target.checked)}
                  style={{ accentColor: 'var(--accent-purple)' }}
                />
                <span>Enable Response Cache</span>
              </label>

              <button 
                onClick={clearCache} 
                style={{
                  padding: '0.3rem 0.6rem',
                  fontSize: '0.75rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  background: 'transparent',
                }}
              >
                Clear Cache ({Object.keys(cache).length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* LLD Logging Terminal */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="glass-panel" style={{
          flex: 1,
          background: '#040711',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            paddingBottom: '0.75rem',
            marginBottom: '1rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#eab308' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>lld_logger.sh</span>
            </div>
            
            <button
              onClick={clearLogs}
              style={{
                background: 'transparent',
                border: 'none',
                padding: 0,
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
              }}
            >
              clear
            </button>
          </div>

          <div 
            ref={logContainerRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
              maxHeight: '340px',
              paddingRight: '0.5rem',
            }}
          >
            {logs.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '4rem' }}>
                &gt; Listening for design triggers...<br/>
                <span style={{ fontSize: '0.7rem' }}>Type something in the input box to start logging events.</span>
              </div>
            ) : (
              logs.map((log: any, index) => {
                let color = 'var(--text-secondary)';
                let icon = '⚙️';
                if (log.type === 'success') {
                  color = 'var(--success)';
                  icon = '🟢';
                } else if (log.type === 'abort') {
                  color = 'var(--error)';
                  icon = '🔴';
                } else if (log.type === 'cache') {
                  color = 'var(--accent-cyan)';
                  icon = '💾';
                }

                return (
                  <div key={index} style={{ color, display: 'flex', alignItems: 'flex-start', gap: '0.5rem', animation: 'fade-in 0.2s ease-out' }}>
                    <span style={{ flexShrink: 0 }}>{icon}</span>
                    <span>{log.text}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
