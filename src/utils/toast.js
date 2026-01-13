export const toast = {
  show(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container') || this.createContainer();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type} show`;
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-icon">${this.getIcon(type)}</span>
        <span class="toast-message">${message}</span>
      </div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  createContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);

    // Agregar estilos
    if (!document.getElementById('toast-styles')) {
      const style = document.createElement('style');
      style.id = 'toast-styles';
      style.textContent = `
        #toast-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .toast {
          min-width: 300px;
          padding: 16px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          opacity: 0;
          transform: translateX(100%);
          transition: all 0.3s ease;
        }
        
        .toast.show {
          opacity: 1;
          transform: translateX(0);
        }
        
        .toast-content {
          display: flex;
          align-items: center;
          gap: 12px;
          color: white;
        }
        
        .toast-icon {
          font-size: 20px;
        }
        
        .toast-message {
          flex: 1;
        }
        
        .toast-success {
          background-color: #28a745;
        }
        
        .toast-error {
          background-color: #dc3545;
        }
        
        .toast-info {
          background-color: #17a2b8;
        }
        
        .toast-warning {
          background-color: #ffc107;
          color: #333 !important;
        }

        .toast-loading {
          background-color: #6c757d;
          color: #fff !important;
        }
        
        .toast-warning .toast-content {
          color: #333;
        }
      `;
      document.head.appendChild(style);
    }

    return container;
  },

  getIcon(type) {
    const icons = {
      success: '✓',
      error: '✕',
      info: 'ℹ',
      warning: '⚠',
      loading: '⏳'
    };
    return icons[type] || icons.info;
  },

  success(message) {
    this.show(message, 'success');
  },

  error(message) {
    this.show(message, 'error');
  },

  info(message) {
    this.show(message, 'info');
  },

  warning(message) {
    this.show(message, 'warning');
  },

  loading(message) {
    this.show(message, 'loading');
  }
};