export const toastServiceCode = `type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

type Subscriber = (toasts: Toast[]) => void;

/**
 * ToastManager - Implements the SINGLETON and OBSERVER design patterns.
 * Coordinates all toast operations globally across the application.
 */
class ToastManager {
  private static instance: ToastManager | null = null;
  private toasts: Toast[] = [];
  private subscribers: Set<Subscriber> = new Set();

  private constructor() {
    // Private constructor ensures no external instantiation (Singleton)
  }

  public static getInstance(): ToastManager {
    if (!ToastManager.instance) {
      ToastManager.instance = new ToastManager();
    }
    return ToastManager.instance;
  }

  // OBSERVER pattern implementation (Subscribe)
  public subscribe(callback: Subscriber): () => void {
    this.subscribers.add(callback);
    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notify() {
    this.subscribers.forEach((callback) => callback([...this.toasts]));
  }

  // Toast Queue Actions
  public show(message: string, type: ToastType = 'info', duration: number = 4000) {
    const toast: Toast = {
      id: Math.random().toString(36).substring(2, 9),
      message,
      type,
      duration,
    };

    // Add to internal queue
    this.toasts = [...this.toasts, toast];
    this.notify();

    // Auto-dismiss timing (Lifecycle management)
    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(toast.id);
      }, duration);
    }
  }

  public dismiss(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  public clearAll() {
    this.toasts = [];
    this.notify();
  }

  public getToasts(): Toast[] {
    return [...this.toasts];
  }
}

// Export Singleton Instance
export const toast = ToastManager.getInstance();`;

export const useToastHookCode = `import { useState, useEffect } from 'react';
import { toast, Toast } from './toastService';

/**
 * React hook connecting to the Singleton ToastManager.
 * Listens to active notifications via stateful bindings.
 */
export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>(toast.getToasts());

  useEffect(() => {
    // Subscribe to updates (Observer pattern)
    const unsubscribe = toast.subscribe((newToasts) => {
      setToasts(newToasts);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    toasts,
    dismiss: (id: string) => toast.dismiss(id),
    clearAll: () => toast.clearAll(),
    show: (msg: string, type: any, dur?: number) => toast.show(msg, type, dur),
  };
};`;

export const toastContainerCode = `import React from 'react';
import { useToast } from './useToast';

export const ToastContainer: React.FC = () => {
  const { toasts, dismiss } = useToast();

  return (
    <div className="toast-portal-container">
      {toasts.map((item) => (
        <div key={item.id} className={\`toast-card \${item.type}\`}>
          <span>{item.message}</span>
          <button onClick={() => dismiss(item.id)}>&times;</button>
        </div>
      ))}
    </div>
  );
};`;
