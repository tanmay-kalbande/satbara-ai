// AI Service functions for Satbara AI Analyzer
import { GoogleGenAI, Type } from "@google/genai";
import { Mistral } from "@mistralai/mistralai";
import { ModelConfig, LandRecordResult, ValuationEstimate } from '../types';
import { cleanJsonText } from '../utils';

/**
 * Process a land document using AI vision
 */
export const processDocumentWithAI = async (
    file: File,
    base64Data: string,
    selectedModel: ModelConfig,
    apiKey: string
): Promise<LandRecordResult> => {
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

    let textOutput: string | undefined;

    if (selectedModel.provider === 'google') {
        // Google Gemini / Gemma API
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
        // Mistral API with Vision
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
    return JSON.parse(cleanText) as LandRecordResult;
};

/**
 * Fetch smart valuation estimate using AI
 */
export const fetchValuationEstimate = async (
    result: LandRecordResult,
    apiKey: string,
    selectedModel: ModelConfig
): Promise<ValuationEstimate> => {
    const isUrban = result.documentType === 'PropertyCard';
    const areaUnit = isUrban ? "Square Meter" : "Acre";

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

    // Use user's selected model if it's Google, otherwise fallback to gemini-3-flash-preview
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

    if (!response.text) throw new Error("No valuation received from AI.");

    return JSON.parse(cleanJsonText(response.text)) as ValuationEstimate;
};
