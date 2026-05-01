import { cn } from '@/utils/cn';

interface ToggleProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  label: string;
  description?: string;
}

export default function Toggle({ checked, onChange, label, description }: ToggleProps) {
  return (
    <div className="flex items-center justify-between gap-8 py-3">
      <div className="flex flex-col">
        <span className="text-sm font-semibold">{label}</span>
        {description && (
          <span className="text-xs text-neutral-500 dark:text-neutral-400">{description}</span>
        )}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-200',
          checked ? 'bg-green-500' : 'bg-neutral-300 dark:bg-neutral-600'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200',
            checked ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
    </div>
  );
}
