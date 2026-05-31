export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

type Subscriber = (toasts: Toast[]) => void;

class ToastManager {
  private static instance: ToastManager | null = null;
  private toasts: Toast[] = [];
  private subscribers: Set<Subscriber> = new Set();

  private constructor() {}

  public static getInstance(): ToastManager {
    if (!ToastManager.instance) {
      ToastManager.instance = new ToastManager();
    }
    return ToastManager.instance;
  }

  public subscribe(callback: Subscriber): () => void {
    this.subscribers.add(callback);
    // Trigger initial subscription callback
    callback([...this.toasts]);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notify() {
    this.subscribers.forEach((callback) => callback([...this.toasts]));
  }

  public show(message: string, type: ToastType = 'info', duration: number = 4000) {
    const toast: Toast = {
      id: Math.random().toString(36).substring(2, 9),
      message,
      type,
      duration,
    };

    this.toasts = [...this.toasts, toast];
    this.notify();

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

export const toast = ToastManager.getInstance();
