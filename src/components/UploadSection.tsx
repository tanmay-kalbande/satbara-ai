import React from 'react';
import { Upload, Search, XCircle, Loader2, FileIcon } from 'lucide-react';
import { Badge } from './ui/Badge';
import { ModelConfig, LandRecordResult } from '../types';

interface UploadSectionProps {
    isProcessing: boolean;
    result: LandRecordResult | null;
    file: File | null;
    preview: string | null;
    error: string | null;
    selectedModel: ModelConfig;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onProcess: () => void;
    onCancel: () => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
    isProcessing,
    result,
    file,
    preview,
    error,
    selectedModel,
    onFileChange,
    onProcess,
    onCancel,
}) => {
    // If we have a result, this section should generally be hidden by parent,
    // but if it's rendered during processing, we handle that.

    if (result) return null;

    if (isProcessing) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-500 no-print">
                <Loader2 size={80} className="animate-spin text-amber-400" />
                <div className="space-y-2">
                    <h2 className="text-2xl font-black">Processing...</h2>
                    <p className="text-zinc-500 font-medium">Model: {selectedModel.name}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center text-center space-y-6 md:space-y-8 animate-in fade-in zoom-in-95 duration-500 no-print">
            <div className="space-y-2 md:space-y-4">
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none">
                    One Scanner.<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">Every Record.</span>
                </h1>
                <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-semibold pt-2">
                    Instantly analyze 7/12, 8A, Property Cards, and K-Prat documents.
                </p>

                <div className="flex gap-2 md:gap-4 justify-center flex-wrap opacity-70 pt-2">
                    <Badge text="7/12 Satbara" color="text-amber-400" border="border-amber-400/20" />
                    <Badge text="Property Card" color="text-blue-400" border="border-blue-400/20" />
                    <Badge text="8A Khata" color="text-purple-400" border="border-purple-400/20" />
                </div>
            </div>

            <div className="w-full group relative">
                {!preview && (
                    <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        onChange={onFileChange}
                        accept="image/*,application/pdf"
                    />
                )}

                <div className="p-8 md:p-12 rounded-[40px] border-4 border-dashed border-zinc-800 bg-zinc-900/30 group-hover:border-amber-400/50 group-hover:bg-zinc-900/50 transition-all duration-500 flex flex-col items-center gap-4 md:gap-6 min-h-[300px] justify-center">
                    {!preview ? (
                        <>
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-amber-400 flex items-center justify-center text-black shadow-2xl shadow-amber-400/20 group-hover:scale-110 transition-transform">
                                <Upload size={32} className="md:w-10 md:h-10" strokeWidth={2.5} />
                            </div>
                            <div className="space-y-2">
                                <p className="text-xl md:text-3xl font-black">Drop Document Here</p>
                                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Auto-detects format</p>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-6 w-full animate-in fade-in zoom-in-95">
                            <div className="w-32 h-44 rounded-xl border border-white/10 overflow-hidden shadow-2xl relative">
                                {file?.type === 'application/pdf' ? (
                                    <div className="h-full w-full bg-zinc-800 flex items-center justify-center"><FileIcon size={40} /></div>
                                ) : (
                                    <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                                )}
                            </div>
                            <div className="space-y-6 w-full max-w-md">
                                <p className="text-lg font-black truncate mx-auto">{file?.name}</p>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onProcess(); }}
                                    className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-amber-400 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-white/5 active:scale-95 z-20"
                                >
                                    <Search size={20} /> Analyze Document
                                </button>
                                <button
                                    onClick={onCancel}
                                    className="w-full py-4 text-zinc-500 font-bold uppercase tracking-widest text-xs hover:text-white transition-colors z-20"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {error && (
                <div className="p-4 rounded-2xl border border-red-500/20 bg-red-500/5 text-red-500 flex items-center gap-3 animate-in fade-in zoom-in-95">
                    <XCircle size={20} />
                    <p className="text-sm font-bold">{error}</p>
                </div>
            )}
        </div>
    );
};
