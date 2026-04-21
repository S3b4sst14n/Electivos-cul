import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  const success = (m) => push(m, 'success');
  const error = (m) => push(m, 'error');

  return (
    <ToastContext.Provider value={{ success, error }}>
      {children}
      <div className="fixed top-4 right-4 z-[60] space-y-2">
        {toasts.map((t) => (
          <div key={t.id} className={`flex items-start gap-2 bg-white shadow-lg rounded-lg border px-4 py-3 min-w-[280px] ${t.type === 'error' ? 'border-red-200' : 'border-green-200'}`}>
            {t.type === 'error' ? <AlertCircle className="text-danger mt-0.5" size={18} /> : <CheckCircle2 className="text-success mt-0.5" size={18} />}
            <p className="text-sm flex-1">{t.message}</p>
            <button onClick={() => setToasts((ts) => ts.filter((x) => x.id !== t.id))}>
              <X size={14} className="text-neutral-400" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
