import { motion } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-emerald text-base font-medium hover:bg-emerald-light disabled:opacity-50 disabled:cursor-not-allowed',
  secondary:
    'border border-emerald/50 text-emerald hover:bg-emerald/10 disabled:opacity-50 disabled:cursor-not-allowed',
  ghost:
    'text-text-secondary hover:text-text-primary hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed',
};

export function Button({
  children,
  variant = 'primary',
  onClick,
  disabled = false,
  className = '',
  type = 'button',
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-xl px-4 py-2 text-sm font-body
        transition-colors duration-200
        focus-visible:ring-2 focus-visible:ring-cyan/70 focus-visible:outline-none
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}
