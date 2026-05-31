import { useState, useEffect } from 'react';
import { toast, Toast } from './toastService';

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>(toast.getToasts());

  useEffect(() => {
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
};
