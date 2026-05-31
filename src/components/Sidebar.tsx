import React, { useState } from 'react';
import { LLDConcept } from '../concepts/types';
import { LLDPattern } from '../patterns/types';
import { Search, ChevronRight, Terminal, Sparkles, Box, Code } from 'lucide-react';

interface SidebarProps {
  patterns: LLDPattern[];
  concepts: LLDConcept[];
  activeId: string;
  onSelect: (id: string, type: 'pattern' | 'challenge') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  patterns,
  concepts,
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
        (c.tags || []).some((tag) => tag && tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

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
            placeholder="Search patterns or challenges..."
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

      {/* Categories */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        {/* Category 1: Design Patterns */}
        <div>
          <div className="sidebar-subtitle" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Box size={12} style={{ color: 'var(--accent-purple)' }} />
            <span>Design Patterns</span>
          </div>
          <div className="sidebar-menu">
            {filteredPatterns.map((p) => {
              const isActive = p.id === activeId;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelect(p.id, 'pattern')}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                >
                  <div className="sidebar-item-content">
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-purple)' }} />
                    <div>
                      <div style={{ fontWeight: isActive ? 600 : 500 }}>{p.title}</div>
                      {p.frameworks && p.frameworks.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.15rem', flexWrap: 'wrap' }}>
                          {p.frameworks.map((f) => {
                            const badge = getFrameworkBadgeColor(f);
                            return (
                              <span key={f} style={{
                                fontSize: '0.62rem',
                                padding: '0.05rem 0.25rem',
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
                  <ChevronRight size={14} className="sidebar-item-arrow" style={{ color: 'var(--text-muted)' }} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Category 2: LLD Challenges */}
        <div>
          <div className="sidebar-subtitle" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Code size={12} style={{ color: 'var(--accent-cyan)' }} />
            <span>Design Challenges</span>
          </div>
          <div className="sidebar-menu">
            {filteredConcepts.map((c) => {
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
                >
                  <div className="sidebar-item-content">
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: diffColor }} />
                    <div>
                      <div style={{ fontWeight: isActive ? 600 : 500 }}>{c.title}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', marginTop: '0.1rem' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                          {c.tags.slice(0, 2).map((t) => `#${t}`).join(' ')}
                        </div>
                        {c.frameworks && c.frameworks.length > 0 && (
                          <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.05rem', flexWrap: 'wrap' }}>
                            {c.frameworks.map((f) => {
                              const badge = getFrameworkBadgeColor(f);
                              return (
                                <span key={f} style={{
                                  fontSize: '0.62rem',
                                  padding: '0.05rem 0.25rem',
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
                  <ChevronRight size={14} className="sidebar-item-arrow" style={{ color: 'var(--text-muted)' }} />
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </aside>
  );
};
