// Utility functions for Satbara AI Analyzer
import React from 'react';
import { Building2, Scroll, FileText, Sprout } from 'lucide-react';
import { DocType, LandRecordResult } from '../types';

/**
 * Clean JSON text by removing markdown code blocks
 */
export const cleanJsonText = (text: string): string => {
    return text.replace(/```json\s*|\s*```/g, "").trim();
};

/**
 * Get icon component based on document type
 */
export const getDocIcon = (type: DocType): React.ReactNode => {
    switch (type) {
        case 'PropertyCard': return <Building2 size={ 20 } />;
        case '8A': return <Scroll size={ 20 } />;
        case 'K-Prat': return <FileText size={ 20 } />;
        default: return <Sprout size={ 20 } />;
    }
};

/**
 * Get color class based on document type
 */
export const getDocColor = (type?: DocType): string => {
    switch (type) {
        case 'PropertyCard': return 'text-blue-400';
        case '8A': return 'text-purple-400';
        default: return 'text-amber-400';
    }
};

/**
 * Calculate land valuation based on market rate
 */
export const calculateValuation = (
    result: LandRecordResult,
    marketRate: string,
    rateUnit: string
): { total: number; loan: number } => {
    if (!result || !marketRate) return { total: 0, loan: 0 };
    const rate = parseFloat(marketRate);
    if (isNaN(rate)) return { total: 0, loan: 0 };

    const metricStr = result.details.convertedMetric || "0";
    // Remove commas and non-numeric characters for better parsing
    const metricVal = parseFloat(metricStr.replace(/,/g, '').replace(/[^\d.]/g, '')) || 0;

    let totalVal = 0;

    if (result.documentType === 'PropertyCard') {
        // Remove commas and non-numeric characters for better parsing
        const areaInSqM = parseFloat(result.details.areaDisplay.replace(/,/g, '').replace(/[^\d.]/g, '')) || 0;
        if (rateUnit === 'sqmeter') {
            totalVal = areaInSqM * rate;
        } else if (rateUnit === 'sqft') {
            totalVal = (areaInSqM * 10.764) * rate;
        }
    } else {
        const acres = metricVal;
        if (rateUnit === 'acre') {
            totalVal = acres * rate;
        } else if (rateUnit === 'guntha') {
            totalVal = (acres * 40) * rate;
        } else if (rateUnit === 'hectare') {
            totalVal = (acres / 2.471) * rate;
        }
    }

    // Different LTV ratios based on land type
    // Agricultural land: ~50-60% LTV, Urban property: ~70-80% LTV
    const ltvRatio = result.documentType === 'PropertyCard' ? 0.75 : 0.55;

    return {
        total: totalVal,
        loan: totalVal * ltvRatio
    };
};
