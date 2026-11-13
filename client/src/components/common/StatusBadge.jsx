const StatusBadge = ({ status }) => {
  const styles = {
    'Active': 'bg-success-light text-success-dark',
    'Present': 'bg-success-light text-success-dark',
    'Pass': 'bg-success-light text-success-dark',
    'Published': 'bg-success-light text-success-dark',
    'Resolved': 'bg-success-light text-success-dark',
    'Open': 'bg-info-light text-info-dark',
    'In Progress': 'bg-info-light text-info-dark',
    'Inactive': 'bg-gray-100 text-gray-600',
    'Closed': 'bg-gray-100 text-gray-600',
    'Academic Leave': 'bg-warning-light text-warning-dark',
    'Late': 'bg-warning-light text-warning-dark',
    'Pending': 'bg-warning-light text-warning-dark',
    'Withheld': 'bg-warning-light text-warning-dark',
    'Suspended': 'bg-danger-light text-danger-dark',
    'Absent': 'bg-danger-light text-danger-dark',
    'Fail': 'bg-danger-light text-danger-dark',
    'Critical': 'bg-danger-light text-danger-dark',
    'Graduated': 'bg-primary-light text-primary',
    'Alumni': 'bg-primary-light text-primary',
    'Excused': 'bg-info-light text-info-dark',
    'Medium': 'bg-warning-light text-warning-dark',
    'High': 'bg-danger-light text-danger-dark',
    'Low': 'bg-info-light text-info-dark',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      styles[status] || 'bg-gray-100 text-gray-600'
    }`}>
      {status}
    </span>
  );
};

export default StatusBadge;

