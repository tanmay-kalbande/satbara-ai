// StatCard component
import React from 'react';

interface StatCardProps {
    label: string;
    value: string;
    subtext?: string;
    icon: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, subtext, icon }) => (
    <div className="p-8 rounded-[40px] border border-white/5 bg-white/5 backdrop-blur-md relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500 print-bg-hide">
        <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity scale-150 text-white no-print">{icon}</div>
        <div className="flex items-center gap-3 mb-4">
            <div className="text-white/50">{icon}</div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{label}</span>
        </div>
        <div className="text-2xl font-black tracking-tighter truncate mb-1">{value}</div>
        <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">{subtext}</div>
    </div>
);
