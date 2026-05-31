import React, { useState } from 'react';
import { Send, Rss, Bell, CheckCircle } from 'lucide-react';

interface SubscriberLogs {
  a: string[];
  b: string[];
  c: string[];
}

export const PubSubDemo: React.FC = () => {
  const [activeChannel, setActiveChannel] = useState<'stocks' | 'tech' | 'gaming'>('stocks');
  const [publishText, setPublishText] = useState('New update dispatched!');
  
  // Channel subscriptions mapping
  const [subs, setSubs] = useState({
    a: { stocks: true, tech: false, gaming: false },
    b: { stocks: false, tech: true, gaming: true },
    c: { stocks: true, tech: true, gaming: false },
  });

  const [logs, setLogs] = useState<SubscriberLogs>({ a: [], b: [], c: [] });
  const [brokerLogs, setBrokerLogs] = useState<string[]>([]);

  const addBrokerLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setBrokerLogs((prev) => [`[${timestamp}] ${msg}`, ...prev].slice(0, 10));
  };

  const handlePublish = () => {
    if (!publishText.trim()) return;

    let routedCount = 0;
    const timestamp = new Date().toLocaleTimeString();
    const formattedMsg = `[${timestamp}] [Topic: ${activeChannel.toUpperCase()}] ${publishText}`;

    // Publish routing logic
    const nextLogs = { ...logs };

    if (subs.a[activeChannel]) {
      nextLogs.a = [formattedMsg, ...nextLogs.a].slice(0, 5);
      routedCount++;
    }
    if (subs.b[activeChannel]) {
      nextLogs.b = [formattedMsg, ...nextLogs.b].slice(0, 5);
      routedCount++;
    }
    if (subs.c[activeChannel]) {
      nextLogs.c = [formattedMsg, ...nextLogs.c].slice(0, 5);
      routedCount++;
    }

    setLogs(nextLogs);
    addBrokerLog(`Broker routed payload to ${routedCount} active subscribers on channel "${activeChannel}"`);
    setPublishText('');
  };

  const handleToggleSub = (sub: 'a' | 'b' | 'c', ch: 'stocks' | 'tech' | 'gaming') => {
    setSubs((prev) => ({
      ...prev,
      [sub]: {
        ...prev[sub],
        [ch]: !prev[sub][ch],
      },
    }));
    addBrokerLog(`Subscriber ${sub.toUpperCase()} toggled subscription for channel "${ch}"`);
  };

  return (
    <div className="playground-container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '2rem' }}>
      {/* Publisher Console Card */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Rss size={18} style={{ color: 'var(--accent-purple)' }} />
            The Event Publisher
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Publish updates to specific topics. The publisher has no direct knowledge of who is listening.</p>
          
          <div className="playground-knob">
            <label>Topic Channel</label>
            <select
              value={activeChannel}
              onChange={(e) => setActiveChannel(e.target.value as any)}
              className="playground-select"
            >
              <option value="stocks">Stocks Channel (stocks)</option>
              <option value="tech">Technology Channel (tech)</option>
              <option value="gaming">Gaming Channel (gaming)</option>
            </select>
          </div>

          <div className="playground-knob">
            <label>Broadcast Message Payload</label>
            <input
              type="text"
              value={publishText}
              onChange={(e) => setPublishText(e.target.value)}
              placeholder="Write payload message..."
              style={{
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                padding: '0.6rem 0.8rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.88rem',
                outline: 'none',
              }}
            />
          </div>

          <button onClick={handlePublish} className="btn-primary" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Send size={14} /> Publish Event
          </button>
        </div>

        {/* Broker Log Panel */}
        <div className="glass-panel" style={{
          flex: 1,
          background: '#040711',
          padding: '1.5rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)',
          minHeight: '180px',
        }}>
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.5rem', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>
            &gt; event_broker_routing.log
          </div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '140px' }}>
            {brokerLogs.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>
                Waiting for publications...
              </div>
            ) : (
              brokerLogs.map((log, index) => (
                <div key={index} style={{ color: 'var(--text-secondary)' }}>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Decoupled Subscribers Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Decoupled Subscribers</h4>
        
        <div style={{ display: 'grid', gridTemplateRows: 'repeat(3, 1fr)', gap: '1rem' }}>
          {(['a', 'b', 'c'] as const).map((key) => {
            const currentSubs = subs[key];
            const channelColor = key === 'a' ? 'var(--accent-purple)' : key === 'b' ? 'var(--accent-cyan)' : 'var(--success)';
            
            return (
              <div
                key={key}
                className="glass-panel"
                style={{
                  padding: '1.25rem',
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 2fr',
                  gap: '1.5rem',
                  background: 'rgba(255,255,255,0.01)',
                }}
              >
                {/* Subscription management */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderRight: '1px solid var(--border-color)', paddingRight: '1rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: channelColor }}>
                    Subscriber {key.toUpperCase()}
                  </span>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.2rem' }}>
                    {(['stocks', 'tech', 'gaming'] as const).map((ch) => (
                      <label key={ch} style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', color: currentSubs[ch] ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                        <input
                          type="checkbox"
                          checked={currentSubs[ch]}
                          onChange={() => handleToggleSub(key, ch)}
                          style={{ accentColor: channelColor }}
                        />
                        <span>{ch}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sub logs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', overflow: 'hidden' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Bell size={10} /> Inbox Feed
                  </span>
                  
                  <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.25rem', maxHeight: '90px' }}>
                    {logs[key].length === 0 ? (
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontStyle: 'italic', marginTop: '0.5rem' }}>
                        No matching notifications.
                      </div>
                    ) : (
                      logs[key].map((logMsg, i) => (
                        <div key={i} style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {logMsg.split('] ')[2] || logMsg}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
