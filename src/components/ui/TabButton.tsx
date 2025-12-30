// TabButton component
import React from 'react';

interface TabButtonProps {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
}

export const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${active ? 'bg-amber-400 text-black shadow-lg' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
    >
        {icon} {label}
    </button>
);
