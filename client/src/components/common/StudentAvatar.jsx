const StudentAvatar = ({ name, image, size = 'md' }) => {
  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-20 h-20 text-2xl',
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    return parts.length >= 2
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : name[0].toUpperCase();
  };

  const colors = [
    'bg-teal-100 text-teal-800',
    'bg-slate-200 text-slate-800',
    'bg-amber-100 text-amber-800',
    'bg-emerald-100 text-emerald-800',
    'bg-sky-100 text-sky-800',
    'bg-orange-100 text-orange-800',
    'bg-teal-50 text-teal-700',
  ];
  const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;

  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover`}
      />
    );
  }

  return (
    <div className={`${sizes[size]} rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${colors[colorIndex]}`}>
      {getInitials(name)}
    </div>
  );
};

export default StudentAvatar;

