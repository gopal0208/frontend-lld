import React from 'react';
import { useToast } from './useToast';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface ToastContainerProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ position = 'top-right' }) => {
  const { toasts, dismiss } = useToast();

  const getPositionStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'fixed',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      maxWidth: '360px',
      width: '100%',
      pointerEvents: 'none',
      padding: '1.5rem',
    };

    switch (position) {
      case 'top-left':
        return { ...base, top: 0, left: 0 };
      case 'bottom-right':
        return { ...base, bottom: 0, right: 0 };
      case 'bottom-left':
        return { ...base, bottom: 0, left: 0 };
      case 'top-right':
      default:
        return { ...base, top: 0, right: 0 };
    }
  };

  const getToastIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={16} style={{ color: 'var(--success)' }} />;
      case 'error':
        return <AlertCircle size={16} style={{ color: 'var(--error)' }} />;
      case 'warning':
        return <AlertTriangle size={16} style={{ color: 'var(--warning)' }} />;
      case 'info':
      default:
        return <Info size={16} style={{ color: 'var(--accent-cyan)' }} />;
    }
  };

  return (
    <div style={getPositionStyles()}>
      {toasts.map((item) => (
        <div
          key={item.id}
          className="glass-panel"
          style={{
            pointerEvents: 'auto',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            borderLeft: `4px solid var(--${item.type === 'info' ? 'accent-cyan' : item.type})`,
            background: 'rgba(10, 15, 30, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            boxShadow: 'var(--shadow-lg)',
            animation: 'fade-in 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards',
            transform: 'translateY(0)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {getToastIcon(item.type)}
            <span style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--text-primary)' }}>
              {item.message}
            </span>
          </div>
          <button
            onClick={() => dismiss(item.id)}
            style={{
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              transform: 'none',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
