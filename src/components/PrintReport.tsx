// Print Report component - Print-only view
import React from 'react';
import { LandRecordResult } from '../types';

interface PrintReportProps {
    result: LandRecordResult;
}

export const PrintReport: React.FC<PrintReportProps> = ({ result }) => {
    return (
        <div className="hidden print-only" style={{ padding: '8px', background: 'white', color: '#000' }}>
            {/* Print Header */}
            <div className="print-header" style={{ borderBottom: '2px solid #000', paddingBottom: '6px', marginBottom: '8px' }}>
                <div style={{ textAlign: 'center', marginBottom: '6px' }}>
                    <div style={{ fontSize: '14pt', fontWeight: 'bold', marginBottom: '2px', color: '#000' }}>
                        LAND RECORD ANALYSIS REPORT
                    </div>
                    <div style={{ fontSize: '8pt', color: '#666' }}>
                        Maharashtra Land Revenue Records - Official Document Extract
                    </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '8pt', marginTop: '6px' }}>
                    <tbody>
                        <tr>
                            <td style={{ padding: '4px', border: '1px solid #ddd', background: '#f5f5f5', width: '25%', fontWeight: 'bold' }}>
                                DOCUMENT TYPE:
                            </td>
                            <td style={{ padding: '4px', border: '1px solid #ddd', width: '25%' }}>
                                {result.documentType}
                            </td>
                            <td style={{ padding: '4px', border: '1px solid #ddd', background: '#f5f5f5', width: '25%', fontWeight: 'bold' }}>
                                REPORT DATE:
                            </td>
                            <td style={{ padding: '4px', border: '1px solid #ddd', width: '25%' }}>
                                {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ padding: '4px', border: '1px solid #ddd', background: '#f5f5f5', fontWeight: 'bold' }}>
                                {result.details.idLabel.toUpperCase()}:
                            </td>
                            <td style={{ padding: '4px', border: '1px solid #ddd' }}>
                                {result.details.idValue}
                            </td>
                            <td style={{ padding: '4px', border: '1px solid #ddd', background: '#f5f5f5', fontWeight: 'bold' }}>
                                LEGAL STATUS:
                            </td>
                            <td style={{ padding: '4px', border: '1px solid #ddd', color: result.details.legalStatus === 'Clear' ? '#059669' : '#dc2626', fontWeight: 'bold' }}>
                                {result.details.legalStatus}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ padding: '4px', border: '1px solid #ddd', background: '#f5f5f5', fontWeight: 'bold' }}>
                                LOCATION:
                            </td>
                            <td colSpan={3} style={{ padding: '4px', border: '1px solid #ddd' }}>
                                {result.details.village}, {result.details.taluka}, {result.details.district}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Summary Section */}
            <div className="print-section" style={{ marginBottom: '8px', pageBreakInside: 'avoid' }}>
                <div style={{ fontSize: '9pt', fontWeight: 'bold', borderBottom: '1px solid #000', paddingBottom: '2px', marginBottom: '5px', textTransform: 'uppercase' }}>
                    EXECUTIVE SUMMARY
                </div>
                <div style={{ border: '1px solid #ddd', padding: '6px', background: '#fafafa' }}>
                    <div style={{ marginBottom: '6px' }}>
                        <div style={{ fontSize: '7pt', fontWeight: 'bold', color: '#666', marginBottom: '2px', textTransform: 'uppercase' }}>
                            ENGLISH SUMMARY
                        </div>
                        <div style={{ fontSize: '8pt', lineHeight: '1.3', color: '#000' }}>
                            {result.summary.english}
                        </div>
                    </div>
                    <div style={{ borderTop: '1px solid #ddd', paddingTop: '6px' }}>
                        <div style={{ fontSize: '7pt', fontWeight: 'bold', color: '#666', marginBottom: '2px', textTransform: 'uppercase' }}>
                            मराठी सारांश
                        </div>
                        <div style={{ fontSize: '8pt', lineHeight: '1.3', color: '#000' }}>
                            {result.summary.marathi}
                        </div>
                    </div>
                </div>
            </div>

            {/* Property Details Grid */}
            <div className="print-section" style={{ marginBottom: '8px', pageBreakInside: 'avoid' }}>
                <div style={{ fontSize: '9pt', fontWeight: 'bold', borderBottom: '1px solid #000', paddingBottom: '2px', marginBottom: '5px', textTransform: 'uppercase' }}>
                    PROPERTY DETAILS
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '8pt' }}>
                    <tbody>
                        <tr>
                            <td style={{ padding: '4px', border: '1px solid #ddd', background: '#f5f5f5', width: '25%', fontWeight: 'bold' }}>
                                AREA
                            </td>
                            <td style={{ padding: '4px', border: '1px solid #ddd', width: '25%' }}>
                                {result.details.areaDisplay} <span style={{ fontSize: '7pt', color: '#666' }}>(≈ {result.details.convertedMetric} Acres)</span>
                            </td>
                            <td style={{ padding: '4px', border: '1px solid #ddd', background: '#f5f5f5', width: '25%', fontWeight: 'bold' }}>
                                LAND CLASSIFICATION
                            </td>
                            <td style={{ padding: '4px', border: '1px solid #ddd', width: '25%' }}>
                                {result.details.landType}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ padding: '4px', border: '1px solid #ddd', background: '#f5f5f5', fontWeight: 'bold' }}>
                                TAX/RENT
                            </td>
                            <td style={{ padding: '4px', border: '1px solid #ddd' }}>
                                {result.details.taxOrRent}
                            </td>
                            <td style={{ padding: '4px', border: '1px solid #ddd', background: '#f5f5f5', fontWeight: 'bold' }}>
                                TOTAL OWNERS
                            </td>
                            <td style={{ padding: '4px', border: '1px solid #ddd' }}>
                                {result.details.owners.length} Person(s)
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Ownership Table */}
            <div className="print-section" style={{ marginBottom: '8px', pageBreakInside: 'avoid' }}>
                <div style={{ fontSize: '9pt', fontWeight: 'bold', borderBottom: '1px solid #000', paddingBottom: '2px', marginBottom: '5px', textTransform: 'uppercase' }}>
                    OWNERSHIP VERIFICATION
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '7pt' }}>
                    <thead>
                        <tr>
                            <th style={{ background: '#333', color: '#fff', border: '1px solid #000', padding: '3px', textAlign: 'left', width: '5%' }}>#</th>
                            <th style={{ background: '#333', color: '#fff', border: '1px solid #000', padding: '3px', textAlign: 'left', width: '42%' }}>Name (Marathi)</th>
                            <th style={{ background: '#333', color: '#fff', border: '1px solid #000', padding: '3px', textAlign: 'left', width: '43%' }}>Name (English)</th>
                            <th style={{ background: '#333', color: '#fff', border: '1px solid #000', padding: '3px', textAlign: 'center', width: '10%' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {result.details.owners.map((owner, i) => (
                            <tr key={i}>
                                <td style={{ border: '1px solid #ccc', padding: '3px', background: i % 2 === 0 ? '#fafafa' : '#fff' }}>
                                    {i + 1}
                                </td>
                                <td style={{ border: '1px solid #ccc', padding: '3px', fontWeight: 600, background: i % 2 === 0 ? '#fafafa' : '#fff' }}>
                                    {owner.nameMarathi}
                                </td>
                                <td style={{ border: '1px solid #ccc', padding: '3px', background: i % 2 === 0 ? '#fafafa' : '#fff' }}>
                                    {owner.nameEnglish}
                                </td>
                                <td style={{ border: '1px solid #ccc', padding: '3px', textAlign: 'center', color: owner.status === 'Active' ? '#059669' : '#dc2626', fontWeight: 'bold', background: i % 2 === 0 ? '#fafafa' : '#fff' }}>
                                    {owner.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Encumbrances */}
            <div className="print-section" style={{ marginBottom: '8px', pageBreakInside: 'avoid' }}>
                <div style={{ fontSize: '9pt', fontWeight: 'bold', borderBottom: '1px solid #000', paddingBottom: '2px', marginBottom: '5px', textTransform: 'uppercase' }}>
                    RIGHTS & ENCUMBRANCES
                </div>
                {result.details.loans.length > 0 ? (
                    <div style={{ border: '1px solid #d97706', background: '#fef3c7', padding: '6px' }}>
                        <div style={{ fontSize: '8pt', fontWeight: 'bold', color: '#d97706', marginBottom: '4px' }}>
                            ⚠ LIABILITIES FOUND
                        </div>
                        {result.details.loans.map((loan, i) => (
                            <div key={i} style={{ marginBottom: '2px', fontSize: '8pt', fontWeight: 600, color: '#000' }}>
                                • {loan}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ border: '1px solid #059669', background: '#d1fae5', padding: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '9pt', color: '#059669', fontWeight: 'bold' }}>
                            ✓ NO ENCUMBRANCES FOUND - PROPERTY IS CLEAR
                        </div>
                    </div>
                )}
            </div>

            {/* Recommendations */}
            <div className="print-section" style={{ marginBottom: '8px', pageBreakInside: 'avoid' }}>
                <div style={{ fontSize: '9pt', fontWeight: 'bold', borderBottom: '1px solid #000', paddingBottom: '2px', marginBottom: '5px', textTransform: 'uppercase' }}>
                    AI-GENERATED RECOMMENDATIONS
                </div>
                <div style={{ border: '1px solid #ddd', padding: '5px', background: '#fafafa' }}>
                    {result.recommendations.map((rec, i) => (
                        <div key={i} style={{ marginBottom: '3px', fontSize: '8pt', lineHeight: '1.3' }}>
                            <span style={{ fontWeight: 'bold', marginRight: '4px' }}>{i + 1}.</span>
                            {rec}
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div style={{ marginTop: '10px', paddingTop: '6px', borderTop: '1px solid #000', textAlign: 'center', fontSize: '7pt', color: '#666' }}>
                <div>
                    <strong>Report Generated:</strong> {new Date().toLocaleString('en-IN')} | <strong>Satbara AI Analyzer v4.3</strong>
                </div>
                <div style={{ fontSize: '6pt', fontStyle: 'italic' }}>
                    This is a computer-generated analysis. Please verify with official land records for legal proceedings.
                </div>
            </div>
        </div>
    );
};
