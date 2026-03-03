import { useEffect, useRef } from 'react';

export type ContextMenuOption =
    | {
          label: string;
          icon?: React.ReactNode;
          onClick: () => void;
          danger?: boolean;
          disabled?: boolean;
      }
    | { separator: true };

type Props = {
    x: number;
    y: number;
    options: ContextMenuOption[];
    onClose: () => void;
};

export default function ContextMenu({ x, y, options, onClose }: Props) {
    const ref = useRef<HTMLDivElement>(null);

    // Close on outside click or Escape
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        const onDown = () => onClose();
        document.addEventListener('keydown', onKey);
        document.addEventListener('mousedown', onDown);
        return () => {
            document.removeEventListener('keydown', onKey);
            document.removeEventListener('mousedown', onDown);
        };
    }, [onClose]);

    // Nudge into viewport after mount
    useEffect(() => {
        if (!ref.current) return;
        const { width, height } = ref.current.getBoundingClientRect();
        const el = ref.current;
        if (x + width > window.innerWidth - 8)
            el.style.left = `${window.innerWidth - width - 8}px`;
        if (y + height > window.innerHeight - 8)
            el.style.top = `${window.innerHeight - height - 8}px`;
    }, [x, y]);

    return (
        <div
            ref={ref}
            style={{ top: y, left: x }}
            className="fixed z-[200] min-w-44 bg-primary border border-secondary/80 rounded-lg shadow-xl py-1 overflow-hidden"
            onMouseDown={(e) => e.stopPropagation()}
        >
            {options.map((opt, i) => {
                if ('separator' in opt) {
                    return <div key={i} className="border-t border-secondary/40 my-1" />;
                }
                return (
                    <button
                        key={i}
                        disabled={opt.disabled}
                        onClick={() => { opt.onClick(); onClose(); }}
                        className={`w-full flex items-center gap-2.5 px-4 py-1.5 text-sm cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-default ${
                            opt.danger
                                ? 'text-accent-1 hover:bg-accent-1/15'
                                : 'text-off-white hover:bg-white/8'
                        }`}
                    >
                        {opt.icon && (
                            <span className="w-4 h-4 shrink-0 flex items-center justify-center text-secondary">
                                {opt.icon}
                            </span>
                        )}
                        {opt.label}
                    </button>
                );
            })}
        </div>
    );
}
