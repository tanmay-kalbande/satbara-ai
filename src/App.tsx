import React, { useState, useEffect } from 'react';
import {
    GoogleGenAI,
    Type
} from "@google/genai";
import { Mistral } from "@mistralai/mistralai";
import {
    ArrowLeft,
    ShieldCheck,
    Sprout,
    List,
    Building2,
    FileBadge
} from 'lucide-react';

import {
    ModelConfig,
    LandRecordResult,
    ValuationEstimate,
} from './types';

import {
    STORAGE_KEYS,
    AVAILABLE_MODELS,
    DEFAULT_MODEL,
    COLORS
} from './constants';

import { cleanJsonText } from './utils';
import { animationStyles, printStyles } from './styles/animations';
import { SettingsModal, PrintReport, Header, Footer, UploadSection, ResultsSection } from './components';

const App: React.FC = () => {
    // State Management
    const [currentPage, setCurrentPage] = useState<'home' | 'privacy' | 'compliance'>('home');
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<LandRecordResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'analysis' | 'tools' | 'preview'>('analysis');

    // Calculator & Valuation State
    const [marketRate, setMarketRate] = useState<string>('');
    const [rateUnit, setRateUnit] = useState<string>('acre');
    const [valuationEstimate, setValuationEstimate] = useState<ValuationEstimate | null>(null);
    const [isEstimating, setIsEstimating] = useState(false);

    // Settings & API Keys State
    const [showSettings, setShowSettings] = useState(false);
    const [googleApiKey, setGoogleApiKey] = useState<string>('');
    const [mistralApiKey, setMistralApiKey] = useState<string>('');
    const [selectedModel, setSelectedModel] = useState<ModelConfig>(DEFAULT_MODEL);

    // Load settings from localStorage on mount
    useEffect(() => {
        const savedGoogleKey = localStorage.getItem(STORAGE_KEYS.GOOGLE_API_KEY) || '';
        const savedMistralKey = localStorage.getItem(STORAGE_KEYS.MISTRAL_API_KEY) || '';
        const savedModelId = localStorage.getItem(STORAGE_KEYS.SELECTED_MODEL);

        setGoogleApiKey(savedGoogleKey);
        setMistralApiKey(savedMistralKey);

        if (savedModelId) {
            const model = AVAILABLE_MODELS.find(m => m.id === savedModelId);
            if (model) setSelectedModel(model);
        }
    }, []);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (showSettings) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [showSettings]);

    // Save settings to localStorage
    const saveSettings = () => {
        localStorage.setItem(STORAGE_KEYS.GOOGLE_API_KEY, googleApiKey);
        localStorage.setItem(STORAGE_KEYS.MISTRAL_API_KEY, mistralApiKey);
        localStorage.setItem(STORAGE_KEYS.SELECTED_MODEL, selectedModel.id);
        setShowSettings(false);
    };

    // Get API key for current model's provider
    const getApiKeyForModel = (model: ModelConfig): string => {
        return model.provider === 'google' ? googleApiKey : mistralApiKey;
    };

    // Update default rate unit based on doc type
    useEffect(() => {
        if (result) {
            if (result.documentType === 'PropertyCard') {
                setRateUnit('sqmeter');
            } else {
                setRateUnit('acre');
            }
        }
    }, [result]);

    const handleReset = () => {
        setFile(null);
        setPreview(null);
        setResult(null);
        setError(null);
        setIsProcessing(false);
        setActiveTab('analysis');
        setCurrentPage('home');
        setMarketRate('');
        setValuationEstimate(null);
        setIsEstimating(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        const isImage = selectedFile.type.startsWith('image/');
        const isPdf = selectedFile.type === 'application/pdf';

        if (isImage || isPdf) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(selectedFile);
            setError(null);
            setResult(null);
            setActiveTab('analysis');
        } else {
            setError("Format not supported. Please use PDF or Images (JPG, PNG).");
        }
    };

    const processDocument = async () => {
        if (!file || !preview) return;
        setIsProcessing(true);
        setError(null);

        // Check for API Key based on selected model's provider
        const apiKey = getApiKeyForModel(selectedModel);
        if (!apiKey) {
            setError(`Please add your ${selectedModel.provider === 'google' ? 'Google' : 'Mistral'} API key in Settings.`);
            setIsProcessing(false);
            setShowSettings(true);
            return;
        }

        const base64Data = preview.split(',')[1];
        const analysisPrompt = `You are an expert in Maharashtra Land Revenue Records (Mahabhulekh). Analyze this document carefully using high-accuracy OCR.
            
1. **CLASSIFY** the document type:
- "7/12" (Satbara): Has Village Form VII-XII header. Shows specific Survey No, Crops, Area.
- "8A" (Khata): Has Village Form VIII-A header. Shows 'Khata No' and a LIST of Survey numbers.
- "PropertyCard" (Malmatta Patrak): Urban record. Uses "CTS Number", Sq.M Area.
- "K-Prat": Register copy.

2. **EXTRACT** details based on the type.

**Owner Extraction Rules (Crucial):**
- Extract owners from the "Bhogvatadar" (Occupant) column.
- **Marathi & English**: Extract the name exactly as written in Marathi, then transliterate to English.
- **Deleted Entries**: If a name is in brackets like [Name] or crossed out, mark status as "Deleted/Mutated". Otherwise "Active".
- **Shares**: If share text (e.g., 0.50) is visible next to name, extract it.

**Other Fields:**
- **Area**: Convert Hectare-Are (H-R) to ACRES accurately (1 H = 2.47 Acres).
- **Loans/Encumbrances**: Look at the "Itar Hakka" (Other Rights) column. List bank names or court cases.
- **Holdings (for 8A)**: Extract the full table of survey numbers.

2. Return details:
Return a valid JSON object with this structure:
{
  "documentType": "7/12" | "8A" | "PropertyCard" | "K-Prat" | "Unknown",
  "summary": { "english": "string", "marathi": "string" },
  "details": {
    "village": "string", "taluka": "string", "district": "string", "office": "string",
    "idLabel": "string", "idValue": "string", "subDivision": "string",
    "areaDisplay": "string", "areaUnit": "Hectare" | "SqMeter" | "Acre" | "Guntha",
    "convertedMetric": "string", "landType": "string", "usage": "string",
    "tenure": "string", "taxOrRent": "string",
    "owners": [{ "nameEnglish": "string", "nameMarathi": "string", "status": "Active" | "Deleted/Mutated", "share": "string" }],
    "loans": ["string"], "otherRights": ["string"], "crops": ["string"],
    "holdings": [{ "surveyNo": "string", "subDivision": "string", "area": "string", "assessment": "string" }],
    "legalStatus": "Clear" | "Warning" | "Disputed"
  },
  "recommendations": ["string"]
}`;

        try {
            let textOutput: string | undefined;

            if (selectedModel.provider === 'google') {
                const ai = new GoogleGenAI({ apiKey });
                const response = await ai.models.generateContent({
                    model: selectedModel.id,
                    contents: {
                        parts: [
                            { inlineData: { mimeType: file.type, data: base64Data } },
                            { text: analysisPrompt }
                        ],
                    },
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: {
                            type: Type.OBJECT,
                            properties: {
                                documentType: { type: Type.STRING, enum: ["7/12", "8A", "PropertyCard", "K-Prat", "Unknown"] },
                                summary: {
                                    type: Type.OBJECT,
                                    properties: { english: { type: Type.STRING }, marathi: { type: Type.STRING } },
                                    required: ["english", "marathi"]
                                },
                                details: {
                                    type: Type.OBJECT,
                                    properties: {
                                        village: { type: Type.STRING },
                                        taluka: { type: Type.STRING },
                                        district: { type: Type.STRING },
                                        office: { type: Type.STRING, description: "Only for Property Card" },
                                        idLabel: { type: Type.STRING, description: "e.g. Survey No, CTS No" },
                                        idValue: { type: Type.STRING },
                                        subDivision: { type: Type.STRING },
                                        areaDisplay: { type: Type.STRING, description: "Original area string with unit" },
                                        areaUnit: { type: Type.STRING, enum: ["Hectare", "SqMeter", "Acre", "Guntha"] },
                                        convertedMetric: { type: Type.STRING, description: "Numeric string only. Acres for Agri, SqFt for Urban." },
                                        landType: { type: Type.STRING },
                                        usage: { type: Type.STRING },
                                        tenure: { type: Type.STRING, description: "Occupancy Class (Satta Prakar)" },
                                        taxOrRent: { type: Type.STRING },
                                        owners: {
                                            type: Type.ARRAY,
                                            items: {
                                                type: Type.OBJECT,
                                                properties: {
                                                    nameEnglish: { type: Type.STRING },
                                                    nameMarathi: { type: Type.STRING },
                                                    status: { type: Type.STRING, enum: ["Active", "Deleted/Mutated"] },
                                                    share: { type: Type.STRING }
                                                }
                                            }
                                        },
                                        loans: { type: Type.ARRAY, items: { type: Type.STRING } },
                                        otherRights: { type: Type.ARRAY, items: { type: Type.STRING } },
                                        crops: { type: Type.ARRAY, items: { type: Type.STRING } },
                                        holdings: {
                                            type: Type.ARRAY,
                                            items: {
                                                type: Type.OBJECT,
                                                properties: {
                                                    surveyNo: { type: Type.STRING },
                                                    subDivision: { type: Type.STRING },
                                                    area: { type: Type.STRING },
                                                    assessment: { type: Type.STRING }
                                                }
                                            },
                                            description: "List of holdings for 8A"
                                        },
                                        legalStatus: { type: Type.STRING, enum: ["Clear", "Warning", "Disputed"] }
                                    },
                                    required: ["village", "district", "idLabel", "idValue", "owners", "legalStatus", "areaDisplay", "convertedMetric", "areaUnit"]
                                },
                                recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
                            },
                            required: ["documentType", "summary", "details", "recommendations"]
                        }
                    }
                });
                textOutput = response.text;
            } else {
                const mistral = new Mistral({ apiKey });
                const response = await mistral.chat.complete({
                    model: selectedModel.id,
                    messages: [
                        {
                            role: "user",
                            content: [
                                {
                                    type: "image_url",
                                    imageUrl: `data:${file.type};base64,${base64Data}`
                                },
                                {
                                    type: "text",
                                    text: analysisPrompt
                                }
                            ]
                        }
                    ],
                    responseFormat: { type: "json_object" }
                });
                const choice = response.choices?.[0];
                if (choice && typeof choice.message?.content === 'string') {
                    textOutput = choice.message.content;
                }
            }

            if (!textOutput) throw new Error("No analysis received from AI.");

            const cleanText = cleanJsonText(textOutput);
            const data = JSON.parse(cleanText) as LandRecordResult;
            setResult(data);
            setActiveTab('analysis');

        } catch (err: any) {
            console.error("AI Processing Error:", err);
            let msg = err.message || "Could not read the document.";
            if (msg.includes("API") || msg.includes("key") || msg.includes("401")) msg = "Invalid API Key. Please check your settings.";
            if (msg.includes("404")) msg = `Model ${selectedModel.id} not found.`;
            if (msg.includes("vision") || msg.includes("image")) msg = `Model ${selectedModel.name} may not support image analysis.`;
            setError(`Analysis failed: ${msg}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const fetchSmartValuation = async () => {
        if (!result) return;
        const apiKey = googleApiKey;
        if (!apiKey) {
            setError("Please add your Google API key in Settings for valuation.");
            setShowSettings(true);
            return;
        }

        setIsEstimating(true);
        setValuationEstimate(null);

        const isUrban = result.documentType === 'PropertyCard';
        const areaUnit = isUrban ? "Square Meter" : "Acre";

        try {
            const ai = new GoogleGenAI({ apiKey });
            const prompt = `Act as a real estate appraiser for Maharashtra.
      
      Context:
      Doc Type: ${result.documentType}
      Location: ${result.details.village}, ${result.details.taluka}, ${result.details.district}
      ${isUrban ? `Office/Area: ${result.details.office}` : `Land Type: ${result.details.landType}`}
      
      Task: Estimate the market rate PER ${areaUnit.toUpperCase()}.
      
      Return JSON:
      {
        "minRate": number,
        "maxRate": number,
        "averageRate": number,
        "unit": "${isUrban ? "Sq. Meter" : "Acre"}",
        "locationInsights": "short string explaining the valuation factors"
      }`;

            const valuationModel = selectedModel.provider === 'google' ? selectedModel.id : 'gemini-3-flash-preview';
            const response = await ai.models.generateContent({
                model: valuationModel,
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            minRate: { type: Type.NUMBER },
                            maxRate: { type: Type.NUMBER },
                            averageRate: { type: Type.NUMBER },
                            unit: { type: Type.STRING },
                            locationInsights: { type: Type.STRING }
                        },
                        required: ["minRate", "maxRate", "averageRate", "unit", "locationInsights"]
                    }
                }
            });

            if (response.text) {
                const data = JSON.parse(cleanJsonText(response.text)) as ValuationEstimate;
                setValuationEstimate(data);
                setMarketRate(data.averageRate.toString());
                if (data.unit.includes("Meter")) setRateUnit('sqmeter');
                else setRateUnit('acre');
            }

        } catch (e: any) {
            console.error("Valuation Error", e);
            setError(`Valuation failed: ${e.message || 'Could not estimate market rate. Please try again.'}`);
        } finally {
            setIsEstimating(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    // --- Views ---

    if (currentPage === 'privacy') {
        return (
            <div className="min-h-screen text-white bg-black animate-mac-page">
                <nav className="px-4 md:px-6 py-4 md:py-6 border-b border-zinc-900 flex justify-between items-center animate-slide-down">
                    <button onClick={() => setCurrentPage('home')} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-all btn-press">
                        <ArrowLeft size={24} /> <span className="font-bold uppercase tracking-widest text-sm">Return</span>
                    </button>
                    <div className="flex items-center gap-2 text-amber-500">
                        <ShieldCheck size={20} /> <span className="font-bold uppercase tracking-widest text-sm">Secure</span>
                    </div>
                </nav>

                <div className="max-w-5xl mx-auto px-6 py-12 lg:py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        <div>
                            <h1 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter text-white mb-6 md:mb-8 leading-[0.9] animate-stagger-1">
                                Data <br />
                                <span className="text-zinc-800">Privacy.</span>
                            </h1>
                            <p className="text-lg md:text-2xl font-medium text-zinc-400 leading-relaxed max-w-md animate-stagger-2">
                                Your land records are processed in your browser and sent to AI providers (Google/Mistral) for analysis. We do not store or log your documents on our servers.
                            </p>
                        </div>

                        <div className="space-y-6 md:space-y-12">
                            <div className="p-6 md:p-8 border border-white/10 rounded-2xl md:rounded-3xl bg-zinc-900/30 hover-lift animate-stagger-3">
                                <Lock className="text-amber-400 mb-4" size={32} />
                                <h3 className="text-xl font-bold text-white mb-2">Zero Persistence</h3>
                                <p className="text-zinc-500">Documents are analyzed by AI and not stored on our servers. Once the browser session closes, all local data is cleared.</p>
                            </div>

                            <div className="p-6 md:p-8 border border-white/10 rounded-2xl md:rounded-3xl bg-zinc-900/30 hover-lift animate-stagger-4">
                                <ShieldCheck className="text-green-400 mb-4" size={32} />
                                <h3 className="text-xl font-bold text-white mb-2">Encryption Standards</h3>
                                <p className="text-zinc-500">All data transmission to the AI engine occurs over encrypted TLS 1.3 channels.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (currentPage === 'compliance') {
        return (
            <div className="min-h-screen text-white bg-black animate-mac-page">
                <nav className="px-4 md:px-6 py-4 md:py-6 border-b border-zinc-900 flex justify-between items-center animate-slide-down">
                    <button onClick={() => setCurrentPage('home')} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-all btn-press">
                        <ArrowLeft size={24} /> <span className="font-bold uppercase tracking-widest text-sm">Return</span>
                    </button>
                    <div className="flex items-center gap-2 text-blue-500">
                        <FileBadge size={20} /> <span className="font-bold uppercase tracking-widest text-sm">Docs</span>
                    </div>
                </nav>

                <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white mb-8 md:mb-16 animate-stagger-1">
                        Supported Documents
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="p-6 rounded-[24px] bg-zinc-900 border border-zinc-800 flex flex-col justify-between h-64 group hover:border-amber-500/50 transition-all hover-lift animate-stagger-2">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-3 block">Form VII-XII</span>
                                <h3 className="text-2xl font-black text-white mb-3">7/12 Satbara</h3>
                                <p className="text-zinc-500 font-medium text-sm">The fundamental land register of Maharashtra. Contains ownership, occupancy, area, and crop details.</p>
                            </div>
                            <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-black">
                                <Sprout size={18} />
                            </div>
                        </div>

                        <div className="p-6 rounded-[24px] bg-zinc-900 border border-zinc-800 flex flex-col justify-between h-64 group hover:border-purple-500/50 transition-all hover-lift animate-stagger-3">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-purple-500 mb-3 block">Form VIII-A</span>
                                <h3 className="text-2xl font-black text-white mb-3">8A Khata</h3>
                                <p className="text-zinc-500 font-medium text-sm">The Holding Sheet. Aggregates all survey numbers owned by a single Khatedar in a village.</p>
                            </div>
                            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white">
                                <List size={18} />
                            </div>
                        </div>

                        <div className="p-6 rounded-[24px] bg-zinc-900 border border-zinc-800 flex flex-col justify-between h-64 group hover:border-blue-500/50 transition-all hover-lift animate-stagger-4">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-3 block">City Survey</span>
                                <h3 className="text-2xl font-black text-white mb-3">Property Card</h3>
                                <p className="text-zinc-500 font-medium text-sm">Malmatta Patrak. The primary ownership record for urban areas within city survey limits.</p>
                            </div>
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                                <Building2 size={18} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white font-sans selection:bg-amber-400 selection:text-black print:bg-white print:text-black" style={{ backgroundColor: COLORS.bg }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      `}</style>

            <Header
                selectedModel={selectedModel}
                result={result}
                onReset={handleReset}
                onOpenSettings={() => setShowSettings(true)}
            />

            <SettingsModal
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                googleApiKey={googleApiKey}
                mistralApiKey={mistralApiKey}
                selectedModel={selectedModel}
                onGoogleApiKeyChange={setGoogleApiKey}
                onMistralApiKeyChange={setMistralApiKey}
                onModelChange={setSelectedModel}
                onSave={saveSettings}
            />

            <style>{animationStyles}</style>
            <style>{printStyles}</style>

            <main className="w-full px-4 md:px-6 py-6 md:py-8">
                <UploadSection
                    isProcessing={isProcessing}
                    result={result}
                    file={file}
                    preview={preview}
                    error={error}
                    selectedModel={selectedModel}
                    onFileChange={handleFileChange}
                    onProcess={processDocument}
                    onCancel={() => { setPreview(null); setFile(null); }}
                />

                {result && <PrintReport result={result} />}

                {result && (
                    <ResultsSection
                        result={result}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        valuationEstimate={valuationEstimate}
                        isEstimating={isEstimating}
                        marketRate={marketRate}
                        setMarketRate={setMarketRate}
                        rateUnit={rateUnit}
                        setRateUnit={setRateUnit}
                        fetchSmartValuation={fetchSmartValuation}
                        file={file}
                        preview={preview}
                        handlePrint={handlePrint}
                        handleReset={handleReset}
                    />
                )}
            </main>

            <Footer onNavigate={setCurrentPage} />
        </div>
    );
};

export default App;
