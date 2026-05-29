import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const STYLES = {
  success: { Icon: CheckCircle,   bg: 'bg-[#0C0D17] border-[#34D399]/25', bar: 'bg-[#34D399]', icon: 'text-[#34D399]', text: 'text-[#E8EAFF]' },
  error:   { Icon: XCircle,       bg: 'bg-[#0C0D17] border-[#F87171]/25', bar: 'bg-[#F87171]', icon: 'text-[#F87171]', text: 'text-[#E8EAFF]' },
  warning: { Icon: AlertTriangle, bg: 'bg-[#0C0D17] border-[#FBBF24]/25', bar: 'bg-[#FBBF24]', icon: 'text-[#FBBF24]', text: 'text-[#E8EAFF]' },
  info:    { Icon: Info,          bg: 'bg-[#0C0D17] border-[#00D2A8]/25', bar: 'bg-[#00D2A8]', icon: 'text-[#00D2A8]', text: 'text-[#E8EAFF]' },
};

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) =>
    setToasts(p => p.filter(t => t.id !== id)), []);

  const add = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => dismiss(id), duration);
  }, [dismiss]);

  const toast = {
    success: (msg, dur) => add(msg, 'success', dur),
    error:   (msg, dur) => add(msg, 'error',   dur),
    warning: (msg, dur) => add(msg, 'warning', dur),
    info:    (msg, dur) => add(msg, 'info',    dur),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Portal */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 pointer-events-none w-80 max-w-[calc(100vw-2.5rem)]">
        <AnimatePresence initial={false}>
          {toasts.map(({ id, message, type }) => {
            const { Icon, bg, bar, icon, text } = STYLES[type] ?? STYLES.info;
            return (
              <motion.div key={id}
                layout
                initial={{ opacity: 0, y: -16, scale: 0.94 }}
                animate={{ opacity: 1, y: 0,   scale: 1 }}
                exit={{   opacity: 0, y: -10,  scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                className={`pointer-events-auto relative overflow-hidden flex items-start gap-3 px-4 py-3.5 rounded-2xl border shadow-[0_8px_32px_rgba(0,0,0,0.6)] font-body ${bg}`}
              >
                {/* left color bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${bar}`} />

                <Icon size={18} className={`flex-shrink-0 mt-0.5 ml-1 ${icon}`} />
                <p className={`flex-1 text-sm font-medium leading-snug ${text}`}>{message}</p>
                <button onClick={() => dismiss(id)}
                  className="flex-shrink-0 text-[#3D4466] hover:text-[#7A83A8] transition-colors">
                  <X size={15} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
};
