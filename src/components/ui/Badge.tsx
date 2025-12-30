// Badge component
import React from 'react';

interface BadgeProps {
    text: string;
    color: string;
    border: string;
}

export const Badge: React.FC<BadgeProps> = ({ text, color, border }) => (
    <span className={`px-3 py-1 rounded-full border ${border} ${color} bg-zinc-900/50 text-xs font-bold uppercase tracking-widest`}>
        {text}
    </span>
);
