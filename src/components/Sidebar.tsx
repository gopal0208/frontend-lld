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

  const filteredPatterns = patterns.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredConcepts = concepts.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
                    <div style={{ fontWeight: isActive ? 600 : 500 }}>{p.title}</div>
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
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginTop: '0.1rem' }}>
                        {c.tags.slice(0, 2).map((t) => `#${t}`).join(' ')}
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
