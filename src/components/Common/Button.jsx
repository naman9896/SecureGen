export function Button({ children, onClick, variant = 'primary', className = '', disabled, type = 'button', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold text-sm rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-primary-container text-white hover:brightness-110 active:scale-[0.98] px-5 py-2.5',
    ghost: 'border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary bg-transparent px-5 py-2.5',
    icon: 'w-10 h-10 rounded-lg border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary bg-surface-high',
    danger: 'bg-error-container text-white hover:brightness-110 active:scale-[0.98] px-5 py-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
