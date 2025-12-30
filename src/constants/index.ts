// Constants for Satbara AI Analyzer
import { ModelConfig } from '../types';

// LocalStorage Keys
export const STORAGE_KEYS = {
    GOOGLE_API_KEY: 'satbara_google_api_key',
    MISTRAL_API_KEY: 'satbara_mistral_api_key',
    SELECTED_MODEL: 'satbara_selected_model',
};

// Available AI Models
export const AVAILABLE_MODELS: ModelConfig[] = [
    // Google Gemini Models
    { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash', provider: 'google', description: 'Newest, fast' },
    { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro', provider: 'google', description: 'Newest, powerful' },
    // Mistral Models
    { id: 'mistral-medium-latest', name: 'Mistral Medium', provider: 'mistral', description: 'Balanced performance' },
    { id: 'mistral-large-latest', name: 'Mistral Large', provider: 'mistral', description: 'Top reasoning' },
];

export const DEFAULT_MODEL = AVAILABLE_MODELS[0];

// Design System Colors
export const COLORS = {
    bg: '#050505',
    surface: '#121212',
    surfaceElevated: '#1a1a1a',
    accent: '#fbbf24',
    textPrimary: '#ffffff',
    textSecondary: '#a1a1aa',
    border: '#27272a',
    error: '#ef4444',
    success: '#10b981',
    warning: '#f59e0b',
};
