import { AlertCircle } from 'lucide-react';

const ErrorState = ({ message = 'Something went wrong', onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-danger-light rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-danger" />
      </div>
      <h3 className="text-lg font-semibold text-heading mb-2">Error</h3>
      <p className="text-sm text-secondary max-w-sm mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;

