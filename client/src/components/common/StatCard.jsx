const StatCard = ({ title, value, subtitle, trend, trendUp, icon, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary-light text-primary',
    success: 'bg-success-light text-success-dark',
    warning: 'bg-warning-light text-warning-dark',
    danger: 'bg-danger-light text-danger-dark',
    info: 'bg-info-light text-info-dark',
  };

  return (
    <div className="bg-card-bg rounded-xl border border-border p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-secondary uppercase tracking-wide">{title}</p>
        {icon && (
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>
      <p className="text-2xl lg:text-3xl font-bold text-heading mb-1">{value}</p>
      <div className="flex items-center gap-2">
        {trend && (
          <span className={`text-xs font-medium ${trendUp ? 'text-success' : 'text-danger'}`}>
            {trendUp ? '▲' : '▼'} {trend}
          </span>
        )}
        {subtitle && <span className="text-xs text-secondary">{subtitle}</span>}
      </div>
    </div>
  );
};

export default StatCard;

