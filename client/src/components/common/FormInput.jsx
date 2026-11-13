const FormInput = ({ label, name, type = 'text', value, onChange, placeholder, required, error, disabled, className = '', ...props }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-heading mb-1.5">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={3}
          className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-body placeholder:text-secondary disabled:bg-gray-50 disabled:cursor-not-allowed ${
            error ? 'border-danger' : 'border-border'
          }`}
          {...props}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-body placeholder:text-secondary disabled:bg-gray-50 disabled:cursor-not-allowed ${
            error ? 'border-danger' : 'border-border'
          }`}
          {...props}
        />
      )}
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
};

export default FormInput;

