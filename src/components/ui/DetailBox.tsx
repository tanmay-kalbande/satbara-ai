// DetailBox component
import React from 'react';

interface DetailBoxProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

export const DetailBox: React.FC<DetailBoxProps> = ({ title, icon, children }) => (
    <div className="p-8 rounded-[40px] border border-white/5 bg-zinc-900/40 backdrop-blur-3xl h-full print-bg-hide">
        <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-2xl bg-zinc-800 text-amber-400 print-bg-hide">{icon}</div>
            <h3 className="text-xl font-black uppercase tracking-tighter italic">{title}</h3>
        </div>
        {children}
    </div>
);
