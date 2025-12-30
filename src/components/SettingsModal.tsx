// Settings Modal component
import React from 'react';
import { X, Key, Cpu, Check } from 'lucide-react';
import { ModelConfig } from '../types';
import { AVAILABLE_MODELS, COLORS } from '../constants';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    googleApiKey: string;
    mistralApiKey: string;
    selectedModel: ModelConfig;
    onGoogleApiKeyChange: (key: string) => void;
    onMistralApiKeyChange: (key: string) => void;
    onModelChange: (model: ModelConfig) => void;
    onSave: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
    googleApiKey,
    mistralApiKey,
    selectedModel,
    onGoogleApiKeyChange,
    onMistralApiKeyChange,
    onModelChange,
    onSave,
}) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-page-enter overflow-y-auto overscroll-contain"
            onClick={handleBackdropClick}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-backdrop" />

            {/* Modal */}
            <div
                className="relative w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl animate-modal z-10 my-auto"
                style={{ maxHeight: '90vh', overflowY: 'auto' }}
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6 sticky top-0 bg-zinc-950 py-2 z-10">
                    <h2 className="text-xl font-black uppercase tracking-tight">Settings</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-800 transition-all">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Google API Key */}
                    <div>
                        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">
                            <Key size={14} /> Google API Key
                            {googleApiKey && <Check size={14} className="text-green-500" />}
                        </label>
                        <input
                            type="password"
                            value={googleApiKey}
                            onChange={(e) => onGoogleApiKeyChange(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 focus:border-amber-400 outline-none text-white transition-all"
                            placeholder="Enter Google API key..."
                        />
                        <p className="text-xs text-zinc-500 mt-2">Required for Gemini models.</p>
                    </div>

                    {/* Mistral API Key */}
                    <div>
                        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">
                            <Key size={14} /> Mistral API Key
                            {mistralApiKey && <Check size={14} className="text-green-500" />}
                        </label>
                        <input
                            type="password"
                            value={mistralApiKey}
                            onChange={(e) => onMistralApiKeyChange(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 focus:border-amber-400 outline-none text-white transition-all"
                            placeholder="Enter Mistral API key..."
                        />
                        <p className="text-xs text-zinc-500 mt-2">Required for Mistral models.</p>
                    </div>

                    {/* Model Selector */}
                    <div>
                        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">
                            <Cpu size={14} /> AI Model
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {AVAILABLE_MODELS.map((model) => (
                                <button
                                    key={model.id}
                                    onClick={() => onModelChange(model)}
                                    className={`p-4 rounded-2xl border text-left transition-all btn-press ${selectedModel.id === model.id
                                            ? 'border-amber-400 bg-amber-400/10'
                                            : 'border-zinc-800 hover:border-zinc-600'
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <span className="font-bold text-sm">{model.name}</span>
                                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${model.provider === 'google' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'
                                            }`}>
                                            {model.provider}
                                        </span>
                                    </div>
                                    <p className="text-xs text-zinc-500 mt-1">{model.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <button
                    onClick={onSave}
                    className="mt-8 w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black uppercase tracking-widest text-sm btn-press flex items-center justify-center gap-2"
                >
                    <Check size={18} /> Save Settings
                </button>

                {/* Info */}
                <p className="text-center text-[10px] text-zinc-600 mt-4 leading-relaxed">
                    Your API keys are stored securely in your browser's local storage. We never transmit or store them on our servers.
                </p>
            </div>
        </div>
    );
};
