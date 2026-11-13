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
    'bg-purple-100 text-purple-700',
    'bg-blue-100 text-blue-700',
    'bg-green-100 text-green-700',
    'bg-amber-100 text-amber-700',
    'bg-rose-100 text-rose-700',
    'bg-cyan-100 text-cyan-700',
    'bg-indigo-100 text-indigo-700',
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

