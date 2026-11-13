import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ text = 'Loading...', className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
      <p className="text-sm text-secondary">{text}</p>
    </div>
  );
};

export default LoadingSpinner;

