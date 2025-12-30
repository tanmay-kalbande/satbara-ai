// Footer component
import React from 'react';
import { Landmark } from 'lucide-react';
import { PageType } from '../../types';

interface FooterProps {
    onNavigate: (page: PageType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
    return (
        <footer className="py-8 border-t border-zinc-900 mt-12 px-6 no-print text-center">
            <div className="max-w-7xl mx-auto flex flex-col gap-5 items-center">
                {/* App Info */}
                <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 text-zinc-600 text-[10px] font-black uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-zinc-900"><Landmark size={14} /></div>
                        <span>Satbara Pro AI v4.3</span>
                    </div>
                    <span className="hidden md:inline">•</span>
                    <span className="hidden md:inline">Verified for Mahabhulekh</span>
                </div>

                {/* Navigation */}
                <div className="flex gap-8 cursor-pointer text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    <span onClick={() => onNavigate('privacy')} className="hover:text-white transition-all btn-press cursor-pointer">Privacy</span>
                    <span onClick={() => onNavigate('compliance')} className="hover:text-white transition-all btn-press cursor-pointer">Compliance</span>
                </div>

                {/* Creator Attribution */}
                <div className="flex flex-col items-center gap-2 pt-2">
                    <p className="text-[14px] text-[#737373] font-medium">
                        Crafted with <span className="text-amber-400">⚡</span> by{' '}
                        <a
                            href="https://linkedin.com/in/tanmay-kalbande"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#737373] font-medium hover:text-amber-400 transition-colors"
                        >
                            Tanmay Kalbande
                        </a>
                    </p>

                </div>
            </div>
        </footer>
    );
};
