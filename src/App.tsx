import { useState, useEffect } from 'react';
import { LLD_CONCEPTS_REGISTRY } from './concepts';
import { LLD_PATTERNS_REGISTRY } from './patterns';
import { Sidebar } from './components/Sidebar';
import { VideoPlayer } from './components/VideoPlayer';
import { CodeViewer } from './components/CodeViewer';
import { CreatorStudio } from './components/CreatorStudio';
import { DynamicDemo } from './components/DynamicDemo';

// Built-in custom playgrounds maps
import { AutocompleteDemo } from './concepts/Autocomplete/AutocompleteDemo';
import { ToastDemo } from './concepts/ToastManager/ToastDemo';
import { CommentDemo } from './concepts/NestedComments/CommentDemo';
import { KanbanDemo } from './concepts/KanbanBoard/KanbanDemo';
import { FileExplorerDemo } from './concepts/FileExplorer/FileExplorerDemo';
import { SingletonDemo } from './patterns/Singleton/SingletonDemo';
import { ObserverDemo } from './patterns/Observer/ObserverDemo';
import { PubSubDemo } from './patterns/PubSub/PubSubDemo';

import { BookOpen, PlayCircle, GraduationCap, Layers, Cpu, Award, BookOpenCheck, CheckCircle2, AlertOctagon, Sparkles } from 'lucide-react';

function App() {
  const [patterns, setPatterns] = useState<any[]>(LLD_PATTERNS_REGISTRY);
  const [challenges, setChallenges] = useState<any[]>(LLD_CONCEPTS_REGISTRY);
  const [activeId, setActiveId] = useState<string>(LLD_PATTERNS_REGISTRY[0].id);
  const [activeType, setActiveType] = useState<'pattern' | 'challenge'>('pattern');
  const [activeTab, setActiveTab] = useState<'video' | 'demo' | 'diagram' | 'code'>('video');
  const [showCreatorStudio, setShowCreatorStudio] = useState(false);
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('lld_hub_admin') === 'true' || window.location.search.includes('admin=true');
  });

  useEffect(() => {
    (window as any).enableStudio = (enable = true) => {
      setIsAdmin(enable);
      localStorage.setItem('lld_hub_admin', enable ? 'true' : 'false');
      console.log(`Creator Studio UI button ${enable ? 'ENABLED' : 'DISABLED'}.`);
    };
    (window as any).openStudio = () => {
      setShowCreatorStudio(true);
      console.log('Creator Studio panel opened.');
    };
  }, []);

  const loadData = () => {
    // 1. Fetch dynamic public JSON database
    fetch('./lld_database.json')
      .then((res) => {
        if (!res.ok) throw new Error('JSON load failed');
        return res.json();
      })
      .then((data) => {
        if (data.patterns && data.challenges) {
          // Merge custom localStorage elements on top of JSON
          const customP = JSON.parse(localStorage.getItem('lld_hub_custom_patterns') || '[]');
          const customC = JSON.parse(localStorage.getItem('lld_hub_custom_challenges') || '[]');
          
          const finalPatterns = [...data.patterns, ...customP];
          const finalChallenges = [...data.challenges, ...customC];
          setPatterns(finalPatterns);
          setChallenges(finalChallenges);

          // Update active selection if current selection is invalid
          const allItems = [...finalPatterns, ...finalChallenges];
          const currentItemExists = allItems.some((item) => item.id === activeId);
          if (!currentItemExists) {
            if (finalPatterns.length > 0) {
              setActiveId(finalPatterns[0].id);
              setActiveType('pattern');
            } else if (finalChallenges.length > 0) {
              setActiveId(finalChallenges[0].id);
              setActiveType('challenge');
            } else {
              setActiveId('');
            }
          }
        }
      })
      .catch((err) => {
        console.warn('Using local static JS fallback for data:', err);
        // Fallback: load from compiled JS files + localStorage
        const customP = JSON.parse(localStorage.getItem('lld_hub_custom_patterns') || '[]');
        const customC = JSON.parse(localStorage.getItem('lld_hub_custom_challenges') || '[]');
        
        const finalPatterns = [...LLD_PATTERNS_REGISTRY, ...customP];
        const finalChallenges = [...LLD_CONCEPTS_REGISTRY, ...customC];
        setPatterns(finalPatterns);
        setChallenges(finalChallenges);

        const allItems = [...finalPatterns, ...finalChallenges];
        const currentItemExists = allItems.some((item) => item.id === activeId);
        if (!currentItemExists) {
          if (finalPatterns.length > 0) {
            setActiveId(finalPatterns[0].id);
            setActiveType('pattern');
          } else if (finalChallenges.length > 0) {
            setActiveId(finalChallenges[0].id);
            setActiveType('challenge');
          } else {
            setActiveId('');
          }
        }
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelect = (id: string, type: 'pattern' | 'challenge') => {
    setActiveId(id);
    setActiveType(type);
    setActiveTab('video');
  };

  const handleSaveNewContent = (newItem: any, type: 'pattern' | 'challenge') => {
    if (type === 'pattern') {
      const customP = JSON.parse(localStorage.getItem('lld_hub_custom_patterns') || '[]');
      const updated = [...customP, newItem];
      localStorage.setItem('lld_hub_custom_patterns', JSON.stringify(updated));
      setPatterns((prev) => [...prev, newItem]);
    } else {
      const customC = JSON.parse(localStorage.getItem('lld_hub_custom_challenges') || '[]');
      const updated = [...customC, newItem];
      localStorage.setItem('lld_hub_custom_challenges', JSON.stringify(updated));
      setChallenges((prev) => [...prev, newItem]);
    }
    
    // Auto-select the newly created item
    setActiveId(newItem.id);
    setActiveType(type);
    setActiveTab('video');
  };

  const activePattern = patterns.find((p) => p.id === activeId);
  const activeChallenge = challenges.find((c) => c.id === activeId);

  const getDifficultyBadgeStyle = (diff: string) => {
    switch (diff) {
      case 'Easy':
        return {
          backgroundColor: 'rgba(34, 197, 94, 0.12)',
          color: 'var(--success)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
        };
      case 'Hard':
        return {
          backgroundColor: 'rgba(239, 68, 68, 0.12)',
          color: 'var(--error)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
        };
      case 'Medium':
      default:
        return {
          backgroundColor: 'rgba(234, 179, 8, 0.12)',
          color: 'var(--warning)',
          border: '1px solid rgba(234, 179, 8, 0.3)',
        };
    }
  };

  // Resolve headers and metadata based on selection type
  const title = activeType === 'pattern' ? activePattern?.title : activeChallenge?.title;
  const description = activeType === 'pattern' ? activePattern?.description : activeChallenge?.description;
  const codeFiles = activeType === 'pattern' ? activePattern?.codeFiles : activeChallenge?.codeFiles;
  const diagram = activeType === 'pattern' ? activePattern?.diagram : activeChallenge?.diagram;

  // Render the demo component by checking ID first, else fallback to DynamicDemo
  const getDemoPlayground = () => {
    const sandboxUrl = activeType === 'pattern' ? activePattern?.codeSandboxUrl : activeChallenge?.codeSandboxUrl;
    
    if (sandboxUrl) {
      return (
        <div className="glass-panel" style={{ width: '100%', height: '600px', overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
          <iframe
            src={sandboxUrl}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title={`${title} Live IDE Sandbox`}
            allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
            sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
          />
        </div>
      );
    }

    if (activeType === 'pattern') {
      switch (activeId) {
        case 'singleton-pattern':
          return <SingletonDemo />;
        case 'observer-pattern':
          return <ObserverDemo />;
        case 'pub-sub-pattern':
          return <PubSubDemo />;
        default:
          return <DynamicDemo key={activeId} title={title || 'Custom Pattern'} codeFiles={codeFiles || []} />;
      }
    } else {
      switch (activeId) {
        case 'autocomplete':
          return <AutocompleteDemo />;
        case 'toast-manager':
          return <ToastDemo />;
        case 'nested-comments':
          return <CommentDemo />;
        case 'kanban-board':
          return <KanbanDemo />;
        case 'file-explorer':
          return <FileExplorerDemo />;
        default:
          return <DynamicDemo key={activeId} title={title || 'Custom Challenge'} codeFiles={codeFiles || []} />;
      }
    }
  };

  const clearLocalStorageContent = () => {
    if (window.confirm('Clear all custom items added to local storage?')) {
      localStorage.removeItem('lld_hub_custom_patterns');
      localStorage.removeItem('lld_hub_custom_challenges');
      loadData();
      alert('Custom storage cleared.');
    }
  };

  return (
    <div className="app-container">
      {/* Background Glowing Ambient Orbs */}
      <div className="bg-glow-container">
        <div className="bg-glow-orb-1" />
        <div className="bg-glow-orb-2" />
      </div>

      {/* Sidebar Navigation */}
      <Sidebar
        patterns={patterns}
        concepts={challenges}
        activeId={activeId}
        onSelect={handleSelect}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-title-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h2 className="header-title">{title}</h2>
              {activeType === 'challenge' && activeChallenge && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    padding: '0.2rem 0.5rem',
                    borderRadius: 'var(--radius-full)',
                    ...getDifficultyBadgeStyle(activeChallenge.difficulty),
                  }}
                >
                  {activeChallenge.difficulty}
                </span>
              )}
              {activeType === 'pattern' && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    padding: '0.2rem 0.5rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'rgba(168, 85, 247, 0.12)',
                    color: 'var(--accent-purple)',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                  }}
                >
                  Design Pattern
                </span>
              )}
            </div>
            <p className="header-tagline">{description}</p>
          </div>

          <div className="header-actions">
            {isAdmin && (
              <button
                onClick={() => setShowCreatorStudio(true)}
                className="btn-primary"
                style={{ padding: '0.45rem 0.8rem', fontSize: '0.8rem' }}
              >
                <Sparkles size={14} />
                <span>Creator Studio</span>
              </button>
            )}
            
            {isAdmin && (
              <button
                onClick={clearLocalStorageContent}
                style={{
                  fontSize: '0.75rem',
                  padding: '0.45rem 0.8rem',
                  background: 'rgba(255,255,255,0.03)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-muted)',
                }}
                title="Reset sandbox"
              >
                Clear Storage
              </button>
            )}

            <a
              href="https://github.com/gopal0208/frontend-lld"
              target="_blank"
              rel="noreferrer"
              className="btn"
              style={{ padding: '0.45rem 0.8rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.35rem' }}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              <span>GitHub Repository</span>
            </a>
          </div>
        </header>

        {/* Content Viewer */}
        <div className="content-viewer">
          {/* CreatorStudio Screen Overlay if opened */}
          {showCreatorStudio ? (
            <CreatorStudio
              onSave={handleSaveNewContent}
              onClose={() => setShowCreatorStudio(false)}
            />
          ) : (
            <>
              {/* Tab Selection Row */}
              <div className="tabs-container">
                <button
                  onClick={() => setActiveTab('video')}
                  className={`tab-btn ${activeTab === 'video' ? 'active' : ''}`}
                >
                  <BookOpen size={14} />
                  {activeType === 'pattern' ? 'Design Intent' : 'Study Material'}
                </button>
                <button
                  onClick={() => setActiveTab('demo')}
                  className={`tab-btn ${activeTab === 'demo' ? 'active' : ''}`}
                >
                  <PlayCircle size={14} />
                  {activeType === 'pattern' ? 'Interactive Sandbox' : 'Interactive Demo'}
                </button>
                <button
                  onClick={() => setActiveTab('diagram')}
                  className={`tab-btn ${activeTab === 'diagram' ? 'active' : ''}`}
                >
                  <Layers size={14} />
                  Architecture
                </button>
                <button
                  onClick={() => setActiveTab('code')}
                  className={`tab-btn ${activeTab === 'code' ? 'active' : ''}`}
                >
                  <Cpu size={14} />
                  Clean Code
                </button>
              </div>

              {/* TAB 1: Study Material panel */}
              <div className={`tab-panel ${activeTab === 'video' ? 'active' : ''}`}>
                {activeType === 'pattern' && activePattern ? (
                  /* Isolated Pattern Intent details */
                  <div className="study-grid">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div className="glass-panel detail-section" style={{ background: 'rgba(168, 85, 247, 0.02)' }}>
                        <div className="detail-title">
                          <BookOpenCheck size={18} style={{ color: 'var(--accent-purple)' }} />
                          <span>Pattern Intent</span>
                        </div>
                        <p className="detail-text" style={{ fontSize: '1rem', lineHeight: 1.6 }}>
                          {activePattern.theory.intent}
                        </p>
                      </div>

                      <div className="glass-panel detail-section">
                        <div className="detail-title">
                          <GraduationCap size={16} style={{ color: 'var(--accent-cyan)' }} />
                          <span>When to use this Pattern?</span>
                        </div>
                        <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem' }}>
                          {activePattern.theory.whenToUse.map((use: string, idx: number) => (
                            <li key={idx}>{use}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="study-details">
                      {/* Advantages */}
                      <div className="glass-panel detail-section" style={{ borderLeft: '4px solid var(--success)' }}>
                        <div className="detail-title">
                          <CheckCircle2 size={16} style={{ color: 'var(--success)' }} />
                          <span>Advantages</span>
                        </div>
                        <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.88rem' }}>
                          {activePattern.theory.prosAndCons.pros.map((pro: string, idx: number) => (
                            <li key={idx}>{pro}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Disadvantages */}
                      <div className="glass-panel detail-section" style={{ borderLeft: '4px solid var(--error)' }}>
                        <div className="detail-title">
                          <AlertOctagon size={16} style={{ color: 'var(--error)' }} />
                          <span>Trade-offs & Cons</span>
                        </div>
                        <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.88rem' }}>
                          {activePattern.theory.prosAndCons.cons.map((con: string, idx: number) => (
                            <li key={idx}>{con}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Design Challenge visual video panel */
                  activeChallenge && (
                    <div className="study-grid">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <VideoPlayer media={activeChallenge.media} title={activeChallenge.title} />
                        
                        <div className="glass-panel detail-section">
                          <div className="detail-title">
                            <GraduationCap size={18} style={{ color: 'var(--accent-purple)' }} />
                            <span>Problem Statement</span>
                          </div>
                          <p className="detail-text">{activeChallenge.theory.problemStatement}</p>
                          
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                            {activeChallenge.tags.map((tag: string) => (
                              <span key={tag} className="detail-tag">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="study-details">
                        {/* Challenges */}
                        <div className="glass-panel detail-section">
                          <div className="detail-title">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="var(--accent-purple)"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                              <path d="m9 12 2 2 4-4" />
                            </svg>
                            <span>Key Engineering Challenges</span>
                          </div>
                          <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                            {activeChallenge.theory.coreChallenges.map((challenge: string, idx: number) => (
                              <li key={idx}>{challenge}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Patterns */}
                        <div className="glass-panel detail-section">
                          <div className="detail-title">
                            <Layers size={16} style={{ color: 'var(--accent-cyan)' }} />
                            <span>Design Patterns Used</span>
                          </div>
                          <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                            {activeChallenge.theory.designPatterns.map((pattern: string, idx: number) => (
                              <li key={idx}><strong>{pattern.split(':')[0]}:</strong>{pattern.split(':')[1]}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Best Practices */}
                        <div className="glass-panel detail-section">
                          <div className="detail-title">
                            <Award size={16} style={{ color: 'var(--success)' }} />
                            <span>LLD Best Practices</span>
                          </div>
                          <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                            {activeChallenge.theory.keyTakeaways.map((takeaway: string, idx: number) => (
                              <li key={idx}>{takeaway}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* TAB 2: Dynamic Live Sandbox demo */}
              <div className={`tab-panel ${activeTab === 'demo' ? 'active' : ''}`}>
                {getDemoPlayground()}
              </div>

              {/* TAB 3: Dynamic Architecture Diagrams (Image or ASCII) */}
              <div className={`tab-panel ${activeTab === 'diagram' ? 'active' : ''}`}>
                <div className="glass-panel diagram-card">
                  <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                      <Layers size={18} style={{ color: 'var(--accent-cyan)' }} />
                      <span style={{ fontSize: '1rem', fontWeight: 700 }}>Architectural Diagram / Flowchart</span>
                    </div>
                    
                    {diagram && (
                      diagram.trim().startsWith('data:image/') ||
                      (!diagram.includes('\n') && (
                        /\.(png|jpe?g|gif|svg|webp)$/i.test(diagram.trim()) ||
                        diagram.trim().startsWith('http://') ||
                        diagram.trim().startsWith('https://') ||
                        diagram.trim().startsWith('/') ||
                        diagram.trim().startsWith('./')
                      ))
                    ) ? (
                      <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem 0' }}>
                        <img
                          src={diagram.trim().startsWith('/') ? `.${diagram.trim()}` : diagram.trim()}
                          alt={`${title} Architecture`}
                          style={{
                            maxWidth: '100%',
                            maxHeight: '500px',
                            height: 'auto',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-color)',
                            boxShadow: 'var(--shadow-lg)',
                            background: 'rgba(255,255,255,0.02)',
                            padding: '0.5rem',
                          }}
                          onError={(e) => {
                            // Fallback in case of image load error
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              const errorLabel = document.createElement('div');
                              errorLabel.innerHTML = `<span style="color:var(--error);font-size:0.85rem;">Failed to load diagram image: "${diagram.trim()}". Make sure the file exists in your repository.</span>`;
                              parent.appendChild(errorLabel);
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <pre style={{
                        background: '#040711',
                        padding: '2rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--accent-cyan)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.85rem',
                        lineHeight: 1.4,
                        overflowX: 'auto',
                        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)',
                      }}>
                        <code>{diagram}</code>
                      </pre>
                    )}
                  </div>
                </div>
              </div>

              {/* TAB 4: Fully Typed Code Viewer */}
              <div className={`tab-panel ${activeTab === 'code' ? 'active' : ''}`}>
                {codeFiles && <CodeViewer files={codeFiles} />}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
