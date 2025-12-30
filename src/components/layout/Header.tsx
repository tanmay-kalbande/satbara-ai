// Header component
import React from 'react';
import { ScanLine, Settings, RefreshCcw } from 'lucide-react';
import { ModelConfig, LandRecordResult } from '../../types';
import { COLORS } from '../../constants';

interface HeaderProps {
    selectedModel: ModelConfig;
    result: LandRecordResult | null;
    onReset: () => void;
    onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    selectedModel,
    result,
    onReset,
    onOpenSettings,
}) => {
    return (
        <nav
            className="sticky top-0 z-50 px-4 md:px-8 py-3 md:py-4 flex items-center justify-between border-b bg-black/80 backdrop-blur-xl no-print"
            style={{ borderColor: COLORS.border }}
        >
            <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={onReset}>
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-xl flex items-center justify-center text-black shadow-lg shadow-amber-400/20">
                    <ScanLine size={20} className="md:w-6 md:h-6" strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                    <span className="text-base md:text-lg font-black tracking-tight leading-none text-white">7/12 Satbara</span>
                </div>
            </div>
            <div className="flex items-center gap-2 md:gap-6">
                <button
                    onClick={onOpenSettings}
                    className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest transition-all border border-zinc-700 btn-press"
                >
                    <Settings size={12} /> <span className="hidden sm:inline">Settings</span>
                </button>
                {result && (
                    <button
                        onClick={onReset}
                        className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest transition-all border border-zinc-700 btn-press"
                    >
                        <RefreshCcw size={12} /> <span className="hidden sm:inline">New Upload</span><span className="sm:hidden">New</span>
                    </button>
                )}
                <div className="h-6 w-[1px] bg-zinc-800 hidden md:block" />
                <div className="hidden md:flex px-3 py-1 rounded-full border border-green-500/20 bg-green-500/10 text-green-400 text-[10px] font-black uppercase tracking-widest items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> {selectedModel.name}
                </div>
            </div>
        </nav>
    );
};
