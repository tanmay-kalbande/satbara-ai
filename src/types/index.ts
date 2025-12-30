// Type definitions for Satbara AI Analyzer

// Model Provider Types
export type ModelProvider = 'google' | 'mistral';

export interface ModelConfig {
    id: string;
    name: string;
    provider: ModelProvider;
    description: string;
}

// Document Types
export type DocType = '7/12' | '8A' | 'PropertyCard' | 'K-Prat' | 'Unknown';

export interface Owner {
    nameEnglish: string;
    nameMarathi: string;
    status: 'Active' | 'Deleted/Mutated';
    share?: string;
}

export interface Holding {
    surveyNo: string;
    subDivision?: string;
    area: string;
    assessment: string;
}

export interface LandRecordResult {
    documentType: DocType;
    summary: {
        english: string;
        marathi: string;
    };
    details: {
        // Location
        village: string;
        taluka: string;
        district: string;
        office?: string; // For Property Card (City Survey Office)

        // Identifiers
        idLabel: string; // e.g., "Survey No", "CTS No", "Khata No"
        idValue: string; // The actual number
        subDivision?: string;

        // Area
        areaDisplay: string; // Formatted string e.g. "1.20 HR" or "500 Sq.M"
        areaUnit: 'Hectare' | 'SqMeter' | 'Acre' | 'Guntha';
        convertedMetric: string; // Acres for Agri, SqFt for Urban

        // Property Attributes
        landType: string; // Jirayat/Bagayat OR Residential/Commercial
        usage?: string;
        tenure?: string; // For Property Card (Occupancy Class)
        taxOrRent: string; // Assessment or Rent

        // Lists
        owners: Owner[];
        loans: string[]; // Boja
        otherRights: string[];
        crops?: string[]; // Only for 7/12
        holdings?: Holding[]; // Only for 8A

        legalStatus: 'Clear' | 'Warning' | 'Disputed';
    };
    recommendations: string[];
}

export interface ValuationEstimate {
    minRate: number;
    maxRate: number;
    averageRate: number;
    unit: string;
    locationInsights: string;
}

// UI State Types
export type PageType = 'home' | 'privacy' | 'compliance';
export type TabType = 'analysis' | 'tools' | 'preview';
