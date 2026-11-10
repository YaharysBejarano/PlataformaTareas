import { createContext, useCallback, useContext, useState } from 'react';

const ContextoNotificaciones = createContext(null);

let idToast = 0;

export function ProveedorNotificaciones({ children }) {
  const [toasts, setToasts] = useState([]);

  const quitarToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'success', duration = 4500) => {
    const id = ++idToast;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => quitarToast(id), duration);
  }, [quitarToast]);

  return (
    <ContextoNotificaciones.Provider value={{ addToast }}>
      {children}
      <div className="toast-container" aria-live="polite" aria-atomic="true">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`} role="status">
            <span className="toast-icon" aria-hidden="true">
              {t.type === 'success' ? '✓' : t.type === 'error' ? '!' : 'i'}
            </span>
            <span className="toast-message">{t.message}</span>
            <button
              type="button"
              className="toast-close"
              onClick={() => quitarToast(t.id)}
              aria-label="Cerrar notificación"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ContextoNotificaciones.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ContextoNotificaciones);
  if (!ctx) throw new Error('useToast debe usarse dentro de ProveedorNotificaciones');
  return ctx;
}
