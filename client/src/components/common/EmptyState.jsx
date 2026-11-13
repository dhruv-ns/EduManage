import { Inbox } from 'lucide-react';

const EmptyState = ({ title = 'No data found', message = 'There are no records to display.', icon: Icon = Inbox, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-heading mb-2">{title}</h3>
      <p className="text-sm text-secondary max-w-sm mb-4">{message}</p>
      {action && action}
    </div>
  );
};

export default EmptyState;

