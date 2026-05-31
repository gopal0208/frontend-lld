import React, { useState } from 'react';
import { LLDPattern } from '../patterns/types';
import { Search, ChevronRight, Terminal, Sparkles, Box, Layers, Zap, Code } from 'lucide-react';

interface SidebarProps {
  patterns: LLDPattern[];
  concepts?: any[];
  activeId: string;
  onSelect: (id: string, type: 'pattern' | 'challenge') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  patterns,
  concepts = [],
  activeId,
  onSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFramework, setSelectedFramework] = useState('All');

  const matchesFramework = (item: any) => {
    if (selectedFramework === 'All') return true;
    if (!item || !item.frameworks) return false;
    return item.frameworks.some((f: string) => f && f.toLowerCase() === selectedFramework.toLowerCase());
  };

  const filteredPatterns = patterns.filter(
    (p) =>
      p &&
      matchesFramework(p) &&
      ((p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description || '').toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredConcepts = concepts.filter(
    (c) =>
      c &&
      matchesFramework(c) &&
      ((c.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.tags || []).some((tag: string) => tag && tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  // Group patterns by category
  const creationalPatterns = filteredPatterns.filter((p) => p.category === 'Creational');
  const structuralPatterns = filteredPatterns.filter((p) => p.category === 'Structural');
  const behavioralPatterns = filteredPatterns.filter((p) => p.category === 'Behavioral' || !p.category);

  const getFrameworkBadgeColor = (f: string) => {
    switch (f.toLowerCase()) {
      case 'react':
        return {
          bg: 'rgba(6, 182, 212, 0.08)',
          border: 'rgba(6, 182, 212, 0.25)',
          text: '#22d3ee',
        };
      case 'angular':
        return {
          bg: 'rgba(239, 68, 68, 0.08)',
          border: 'rgba(239, 68, 68, 0.25)',
          text: '#f87171',
        };
      case 'vue':
        return {
          bg: 'rgba(34, 197, 94, 0.08)',
          border: 'rgba(34, 197, 94, 0.25)',
          text: '#4ade80',
        };
      case 'vanilla':
      case 'vanilla js':
      case 'vanillajs':
        return {
          bg: 'rgba(234, 179, 8, 0.08)',
          border: 'rgba(234, 179, 8, 0.25)',
          text: '#facc15',
        };
      default:
        return {
          bg: 'rgba(255, 255, 255, 0.04)',
          border: 'rgba(255, 255, 255, 0.08)',
          text: 'var(--text-secondary)',
        };
    }
  };

  const renderPatternSection = (
    title: string,
    items: LLDPattern[],
    icon: React.ReactNode,
    accentColor: string
  ) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <div className="sidebar-subtitle" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', margin: '0.75rem 1.25rem 0.25rem' }}>
          {icon}
          <span style={{ color: accentColor }}>{title}</span>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginLeft: 'auto', background: 'rgba(255,255,255,0.03)', padding: '0.05rem 0.35rem', borderRadius: '4px' }}>
            {items.length}
          </span>
        </div>
        
        <div className="sidebar-section-list" style={{
          maxHeight: '170px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
          padding: '0 0.75rem',
        }}>
          {items.length === 0 ? (
            <div style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              No patterns registered
            </div>
          ) : (
            items.map((p) => {
              const isActive = p.id === activeId;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelect(p.id, 'pattern')}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                  style={{
                    padding: '0.65rem 0.8rem',
                  }}
                >
                  <div className="sidebar-item-content" style={{ gap: '0.5rem' }}>
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: accentColor }} />
                    <div>
                      <div style={{ fontWeight: isActive ? 600 : 500, fontSize: '0.85rem' }}>{p.title}</div>
                      {p.frameworks && p.frameworks.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.2rem', marginTop: '0.15rem', flexWrap: 'wrap' }}>
                          {p.frameworks.map((f) => {
                            const badge = getFrameworkBadgeColor(f);
                            return (
                              <span key={f} style={{
                                fontSize: '0.58rem',
                                padding: '0.02rem 0.2rem',
                                borderRadius: '4px',
                                background: badge.bg,
                                color: badge.text,
                                border: `1px solid ${badge.border}`,
                                lineHeight: 1.1,
                              }}>
                                {f}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={12} className="sidebar-item-arrow" style={{ color: 'var(--text-muted)' }} />
                </button>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">
          <Terminal size={20} />
        </div>
        <div>
          <h1 className="sidebar-title gradient-text">Frontend LLD</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.1rem' }}>
            <Sparkles size={10} style={{ color: 'var(--accent-cyan)' }} />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>LEARNING PORTAL</span>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div style={{ padding: '1rem 0.75rem 0.5rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '0.5rem 0.75rem',
        }}>
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search learning portal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              outline: 'none',
              width: '100%',
              fontFamily: 'var(--font-sans)',
            }}
          />
        </div>
      </div>

      {/* Framework Filter Pills */}
      <div style={{ padding: '0 0.75rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', paddingLeft: '0.2rem' }}>
          Filter by Framework
        </span>
        <div style={{
          display: 'flex',
          gap: '0.3rem',
          flexWrap: 'wrap',
          background: 'rgba(0, 0, 0, 0.2)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '0.3rem',
        }}>
          {['All', 'React', 'Vanilla', 'Angular', 'Vue'].map((fw) => {
            const isSelected = selectedFramework === fw;
            let activeColor = 'var(--text-primary)';
            let hoverBg = 'rgba(255, 255, 255, 0.05)';
            let activeBg = 'rgba(255, 255, 255, 0.1)';
            let glowColor = 'transparent';
            
            if (fw === 'React') {
              activeColor = '#22d3ee';
              hoverBg = 'rgba(6, 182, 212, 0.05)';
              activeBg = 'rgba(6, 182, 212, 0.15)';
              glowColor = 'rgba(6, 182, 212, 0.3)';
            } else if (fw === 'Angular') {
              activeColor = '#f87171';
              hoverBg = 'rgba(239, 68, 68, 0.05)';
              activeBg = 'rgba(239, 68, 68, 0.15)';
              glowColor = 'rgba(239, 68, 68, 0.3)';
            } else if (fw === 'Vue') {
              activeColor = '#4ade80';
              hoverBg = 'rgba(34, 197, 94, 0.05)';
              activeBg = 'rgba(34, 197, 94, 0.15)';
              glowColor = 'rgba(34, 197, 94, 0.3)';
            } else if (fw === 'Vanilla') {
              activeColor = '#facc15';
              hoverBg = 'rgba(234, 179, 8, 0.05)';
              activeBg = 'rgba(234, 179, 8, 0.15)';
              glowColor = 'rgba(234, 179, 8, 0.3)';
            } else if (fw === 'All') {
              activeColor = 'var(--text-primary)';
              hoverBg = 'rgba(168, 85, 247, 0.05)';
              activeBg = 'rgba(168, 85, 247, 0.15)';
              glowColor = 'rgba(168, 85, 247, 0.3)';
            }
            
            return (
              <button
                key={fw}
                onClick={() => setSelectedFramework(fw)}
                style={{
                  background: isSelected ? activeBg : 'transparent',
                  border: '1px solid ' + (isSelected ? activeColor : 'transparent'),
                  color: isSelected ? activeColor : 'var(--text-secondary)',
                  padding: '0.25rem 0.45rem',
                  fontSize: '0.72rem',
                  fontWeight: isSelected ? 600 : 500,
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  flex: '1 1 auto',
                  textAlign: 'center',
                  transition: 'all var(--transition-fast)',
                  boxShadow: isSelected ? `0 0 8px ${glowColor}` : 'none',
                  textTransform: 'none',
                  transform: 'none',
                }}
              >
                {fw}
              </button>
            );
          })}
        </div>
      </div>

      {/* Categories container */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingBottom: '1.5rem' }}>
        {renderPatternSection(
          'Creational Patterns',
          creationalPatterns,
          <Box size={12} style={{ color: 'var(--accent-purple)' }} />,
          'var(--accent-purple)'
        )}

        {renderPatternSection(
          'Structural Patterns',
          structuralPatterns,
          <Layers size={12} style={{ color: 'var(--accent-cyan)' }} />,
          'var(--accent-cyan)'
        )}

        {renderPatternSection(
          'Behavioral Patterns',
          behavioralPatterns,
          <Zap size={12} style={{ color: '#4ade80' }} />,
          '#4ade80'
        )}

        {/* Category 4: Design Challenges */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div className="sidebar-subtitle" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', margin: '0.75rem 1.25rem 0.25rem' }}>
            <Code size={12} style={{ color: 'var(--accent-cyan)' }} />
            <span>Design Challenges</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginLeft: 'auto', background: 'rgba(255,255,255,0.03)', padding: '0.05rem 0.35rem', borderRadius: '4px' }}>
              {filteredConcepts.length}
            </span>
          </div>
          
          <div className="sidebar-section-list" style={{
            maxHeight: '170px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            padding: '0 0.75rem',
          }}>
            {filteredConcepts.length === 0 ? (
              <div style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                No challenges registered
              </div>
            ) : (
              filteredConcepts.map((c) => {
                const isActive = c.id === activeId;
                const diffColor =
                  c.difficulty === 'Easy'
                    ? 'var(--success)'
                    : c.difficulty === 'Medium'
                    ? 'var(--warning)'
                    : 'var(--error)';

                return (
                  <button
                    key={c.id}
                    onClick={() => onSelect(c.id, 'challenge')}
                    className={`sidebar-item ${isActive ? 'active' : ''}`}
                    style={{
                      padding: '0.65rem 0.8rem',
                    }}
                  >
                    <div className="sidebar-item-content" style={{ gap: '0.5rem' }}>
                      <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: diffColor }} />
                      <div>
                        <div style={{ fontWeight: isActive ? 600 : 500, fontSize: '0.85rem' }}>{c.title}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', marginTop: '0.1rem' }}>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                            {(c.tags || []).slice(0, 2).map((t: string) => `#${t}`).join(' ')}
                          </div>
                          {c.frameworks && c.frameworks.length > 0 && (
                            <div style={{ display: 'flex', gap: '0.2rem', marginTop: '0.05rem', flexWrap: 'wrap' }}>
                              {c.frameworks.map((f: string) => {
                                const badge = getFrameworkBadgeColor(f);
                                return (
                                  <span key={f} style={{
                                    fontSize: '0.58rem',
                                    padding: '0.02rem 0.2rem',
                                    borderRadius: '4px',
                                    background: badge.bg,
                                    color: badge.text,
                                    border: `1px solid ${badge.border}`,
                                    lineHeight: 1.1,
                                  }}>
                                    {f}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={12} className="sidebar-item-arrow" style={{ color: 'var(--text-muted)' }} />
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
