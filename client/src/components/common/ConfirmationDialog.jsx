import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', confirmVariant = 'danger' }) => {
  const variants = {
    danger: 'bg-danger hover:bg-red-600 text-white',
    primary: 'bg-primary hover:bg-primary-hover text-white',
    warning: 'bg-warning hover:bg-amber-600 text-white',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="text-center">
        <div className="mx-auto w-12 h-12 bg-danger-light rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 text-danger" />
        </div>
        <p className="text-sm text-body mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-gray-50 text-body"
          >
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${variants[confirmVariant]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationDialog;

