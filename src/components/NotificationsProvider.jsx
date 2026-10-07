import React, { createContext, useContext, useCallback } from 'react';
import Swal from 'sweetalert2';

const NotificationsContext = createContext(null);

// One-time style injection so every SweetAlert2 popup matches the school's
// brand (white + navy) and font (Fraunces titles, Inter body) instead of
// the SweetAlert2 default look.
let stylesInjected = false;
function ensureBrandStyles() {
  if (stylesInjected) return;
  stylesInjected = true;
  const style = document.createElement('style');
  style.innerHTML = `
    .yss-swal-popup {
      border-radius: 18px !important;
      font-family: 'Inter', -apple-system, sans-serif !important;
      padding-bottom: 1.75rem !important;
    }
    .yss-swal-title {
      font-family: 'Fraunces', Georgia, serif !important;
      font-weight: 600 !important;
      font-size: 1.3rem !important;
      color: #14335A !important;
    }
    .yss-swal-text {
      color: #5C6B84 !important;
      font-size: 0.92rem !important;
    }
    .yss-swal-confirm {
      border-radius: 10px !important;
      font-weight: 600 !important;
      padding: 0.55rem 1.4rem !important;
      box-shadow: none !important;
    }
    .yss-swal-cancel {
      border-radius: 10px !important;
      font-weight: 600 !important;
      padding: 0.55rem 1.4rem !important;
      box-shadow: none !important;
    }
  `;
  document.head.appendChild(style);
}

const NAVY = '#14335A';
const ERROR = '#B6432B';
const SUCCESS = '#227A52';

export function NotificationsProvider({ children }) {
  ensureBrandStyles();

  const notify = useCallback((message, severity = 'success') => {
    Swal.fire({
      icon: severity === 'success' ? 'success' : 'error',
      title: message,
      confirmButtonColor: NAVY,
      timer: severity === 'success' ? 1800 : undefined,
      timerProgressBar: severity === 'success',
      showConfirmButton: severity !== 'success',
      iconColor: severity === 'success' ? SUCCESS : ERROR,
      customClass: {
        popup: 'yss-swal-popup',
        title: 'yss-swal-title',
        confirmButton: 'yss-swal-confirm',
      },
    });
  }, []);

  const confirmDelete = useCallback(async (label) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Confirm delete',
      text: `${label} ko delete karna hai? Ye wapas nahi hoga.`,
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: ERROR,
      cancelButtonColor: NAVY,
      iconColor: ERROR,
      reverseButtons: true,
      customClass: {
        popup: 'yss-swal-popup',
        title: 'yss-swal-title',
        htmlContainer: 'yss-swal-text',
        confirmButton: 'yss-swal-confirm',
        cancelButton: 'yss-swal-cancel',
      },
    });
    return result.isConfirmed;
  }, []);

  return (
    <NotificationsContext.Provider value={{ notify, confirmDelete }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used inside <NotificationsProvider>');
  return ctx;
}