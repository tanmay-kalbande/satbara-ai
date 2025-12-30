import React from 'react';
import {
    Map, Zap, User, Coins, LayoutDashboard, Calculator, Eye,
    List, Scale, ShieldCheck, Sprout, Building2, TrendingUp, Printer, RefreshCcw
} from 'lucide-react';
import { StatCard } from './ui/StatCard';
import { TabButton } from './ui/TabButton';
import { DetailBox } from './ui/DetailBox';
import { LandRecordResult, ValuationEstimate } from '../types';
import { getDocIcon, getDocColor, calculateValuation } from '../utils';

interface ResultsSectionProps {
    result: LandRecordResult;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    valuationEstimate: ValuationEstimate | null;
    isEstimating: boolean;
    marketRate: string;
    setMarketRate: (rate: string) => void;
    rateUnit: string;
    setRateUnit: (unit: string) => void;
    fetchSmartValuation: () => void;
    file: File | null;
    preview: string | null;
    handlePrint: () => void;
    handleReset: () => void;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({
    result,
    activeTab,
    setActiveTab,
    valuationEstimate,
    isEstimating,
    marketRate,
    setMarketRate,
    rateUnit,
    setRateUnit,
    fetchSmartValuation,
    file,
    preview,
    handlePrint,
    handleReset
}) => {
    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 no-print">

            {/* Header / Doc ID */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-2xl bg-zinc-900 border border-zinc-800 ${getDocColor(result.documentType)} print-bg-hide`}>
                        {getDocIcon(result.documentType)}
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">{result.documentType} Analysis</h1>
                        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">
                            {result.details.village}, {result.details.district}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 no-print mt-4 md:mt-0">
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
               ${result.details.legalStatus === 'Clear' ? 'text-green-400 bg-green-500/10' :
                            result.details.legalStatus === 'Warning' ? 'text-amber-400 bg-amber-500/10' :
                                'text-red-400 bg-red-500/10'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${result.details.legalStatus === 'Clear' ? 'bg-green-400' :
                            result.details.legalStatus === 'Warning' ? 'bg-amber-400' : 'bg-red-400'}`} />
                        {result.details.legalStatus === 'Clear' ? 'No Encumbrances' : result.details.legalStatus}
                    </div>
                </div>
            </div>

            {/* Stats Grid - Adapts to Document Type */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                    label={result.details.idLabel}
                    value={result.details.idValue}
                    subtext={result.details.subDivision ? `Sub-div: ${result.details.subDivision}` : 'No Sub-div'}
                    icon={<Map size={24} />}
                />
                <StatCard
                    label={result.documentType === '8A' ? "Total Holding" : "Area"}
                    value={result.details.areaDisplay}
                    subtext={result.documentType === 'PropertyCard' ? 'Urban Area' : `≈ ${result.details.convertedMetric} Acres`}
                    icon={<Zap size={24} />}
                />
                <StatCard
                    label="Owner Count"
                    value={result.details.owners.length.toString()}
                    subtext={result.details.owners.length > 5 ? 'Multiple Holders' : 'Individual/Joint'}
                    icon={<User size={24} />}
                />
                <StatCard
                    label="Tax / Rent"
                    value={result.details.taxOrRent || "N/A"}
                    subtext="Annual Assessment"
                    icon={<Coins size={24} />}
                />
            </div>

            {/* Tab Navigation (Hidden in Print) */}
            <div className="flex justify-center mb-8 no-print">
                <div className="p-1 rounded-2xl bg-zinc-900 border border-zinc-800 inline-flex flex-wrap gap-1 justify-center">
                    <TabButton active={activeTab === 'analysis'} onClick={() => setActiveTab('analysis')} icon={<LayoutDashboard size={16} />} label="Analysis" />
                    <TabButton active={activeTab === 'tools'} onClick={() => setActiveTab('tools')} icon={<Calculator size={16} />} label="Valuation" />
                    <TabButton active={activeTab === 'preview'} onClick={() => setActiveTab('preview')} icon={<Eye size={16} />} label="Original Doc" />
                </div>
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-12">

                    {/* 1. ANALYSIS TAB */}
                    {activeTab === 'analysis' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="lg:col-span-8 space-y-8">
                                {/* Summaries */}
                                <div className="p-6 md:p-10 rounded-[40px] border border-white/5 bg-zinc-900/50 backdrop-blur-3xl shadow-2xl print-bg-hide">
                                    <div className="space-y-8">
                                        <div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">English Summary</span>
                                            <p className="text-lg md:text-2xl font-bold leading-relaxed mt-2 opacity-90">
                                                {result.summary.english}
                                            </p>
                                        </div>
                                        <div className="h-[1px] w-full bg-white/5 no-print" />
                                        <div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-400 print:text-black">मराठी सारांश</span>
                                            <p className="text-lg md:text-2xl font-bold leading-relaxed mt-2 opacity-90">
                                                {result.summary.marathi}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Detail Boxes */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    {/* 8A Holdings Table (Unique to 8A) */}
                                    {result.documentType === '8A' && result.details.holdings && (
                                        <div className="md:col-span-2">
                                            <DetailBox title="Account Holdings" icon={<List size={20} className="text-purple-400" />}>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-sm text-left">
                                                        <thead>
                                                            <tr className="border-b border-white/10">
                                                                <th className="pb-2 text-zinc-500 font-bold uppercase tracking-wider">Survey No</th>
                                                                <th className="pb-2 text-zinc-500 font-bold uppercase tracking-wider">Sub Div</th>
                                                                <th className="pb-2 text-zinc-500 font-bold uppercase tracking-wider">Area</th>
                                                                <th className="pb-2 text-zinc-500 font-bold uppercase tracking-wider">Tax</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-white/5">
                                                            {result.details.holdings.map((h, i) => (
                                                                <tr key={i}>
                                                                    <td className="py-2 font-medium">{h.surveyNo}</td>
                                                                    <td className="py-2 text-zinc-400">{h.subDivision || "-"}</td>
                                                                    <td className="py-2 text-zinc-400">{h.area}</td>
                                                                    <td className="py-2 text-zinc-400">{h.assessment}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </DetailBox>
                                        </div>
                                    )}

                                    <DetailBox title="Ownership Verification" icon={<User size={20} className={getDocColor(result.documentType)} />}>
                                        <div className="space-y-4">
                                            {result.details.owners.slice(0, 10).map((owner, i) => (
                                                <div key={i} className="flex flex-col text-sm font-medium border-b border-white/5 pb-2 last:border-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-zinc-500">{i + 1}.</span>
                                                        <span className="font-bold">{owner.nameMarathi}</span>
                                                        {owner.status === 'Deleted/Mutated' && <span className="text-[10px] text-red-400 bg-red-900/20 px-1 rounded ml-2">DELETED</span>}
                                                    </div>
                                                    <div className="pl-5 text-zinc-500 text-xs italic">{owner.nameEnglish}</div>
                                                </div>
                                            ))}
                                            {result.details.owners.length > 10 && <div className="text-xs text-zinc-500 italic">+ {result.details.owners.length - 10} more</div>}
                                        </div>
                                    </DetailBox>

                                    <DetailBox title="Rights & Encumbrances" icon={<Scale size={20} className="text-red-400" />}>
                                        <div className="space-y-4">
                                            {result.details.loans.length > 0 ? (
                                                <div className="space-y-2">
                                                    <p className="text-xs text-red-400 font-black uppercase tracking-widest">Liabilities Found</p>
                                                    {result.details.loans.map((loan, i) => (
                                                        <div key={i} className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs font-bold text-red-400">
                                                            {loan}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-6">
                                                    <ShieldCheck size={32} className="mx-auto text-green-500 mb-2" />
                                                    <p className="text-green-500 font-bold text-sm">No Encumbrances</p>
                                                </div>
                                            )}

                                            {result.details.otherRights.length > 0 && (
                                                <div className="mt-4 pt-4 border-t border-white/5">
                                                    <p className="text-xs text-zinc-500 font-black uppercase tracking-widest mb-2">Other Rights</p>
                                                    <ul className="text-xs text-zinc-300 space-y-1">
                                                        {result.details.otherRights.map((r, i) => <li key={i}>• {r}</li>)}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </DetailBox>

                                    {/* Condition: Show Crops only for 7/12 */}
                                    {(result.documentType === '7/12' || result.documentType === 'K-Prat') && (
                                        <DetailBox title="Crop Status" icon={<Sprout size={20} className="text-green-400" />}>
                                            <div className="flex flex-wrap gap-2">
                                                {result.details.crops && result.details.crops.length > 0 ? (
                                                    result.details.crops.map((c, i) => (
                                                        <span key={i} className="px-3 py-1 bg-green-900/20 text-green-400 border border-green-500/20 rounded-full text-xs font-bold">{c}</span>
                                                    ))
                                                ) : <p className="text-zinc-500 text-sm">No crop data found.</p>}
                                            </div>
                                        </DetailBox>
                                    )}

                                    {/* Condition: Show Urban Info for Property Card */}
                                    {result.documentType === 'PropertyCard' && (
                                        <DetailBox title="Urban Details" icon={<Building2 size={20} className="text-blue-400" />}>
                                            <div className="space-y-4">
                                                <div className="flex justify-between text-sm border-b border-white/5 pb-2">
                                                    <span className="text-zinc-500">Office:</span>
                                                    <span className="font-bold">{result.details.office || "City Survey"}</span>
                                                </div>
                                                <div className="flex justify-between text-sm border-b border-white/5 pb-2">
                                                    <span className="text-zinc-500">Tenure Type:</span>
                                                    <span className="font-bold text-amber-400">{result.details.tenure || "N/A"}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-zinc-500">Usage:</span>
                                                    <span className="font-bold">{result.details.usage || "N/A"}</span>
                                                </div>
                                            </div>
                                        </DetailBox>
                                    )}

                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="lg:col-span-4 space-y-6">
                                <div className="p-8 rounded-[40px] border border-white/5 bg-zinc-900/80 shadow-xl print-bg-hide">
                                    <h3 className="font-black uppercase tracking-tighter italic mb-6">AI Recommendations</h3>
                                    <ul className="space-y-4">
                                        {result.recommendations.map((rec, i) => (
                                            <li key={i} className="text-sm text-zinc-400 leading-snug flex gap-3">
                                                <span className="text-amber-400 font-bold">0{i + 1}</span>
                                                {rec}
                                            </li>
                                        ))}
                                    </ul>
                                    <button onClick={handlePrint} className="w-full mt-8 py-4 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-amber-400 transition-all flex items-center justify-center gap-2 no-print">
                                        <Printer size={16} /> Save Report
                                    </button>
                                </div>
                            </div>

                            {/* New Analyze Another Button at Bottom */}
                            <div className="lg:col-span-12 flex justify-center mt-4 no-print">
                                <button
                                    onClick={handleReset}
                                    className="px-8 py-4 bg-zinc-800 text-zinc-300 font-black uppercase tracking-widest rounded-2xl hover:bg-white hover:text-black transition-all flex items-center gap-3 border border-white/5"
                                >
                                    <RefreshCcw size={20} /> Analyze Another Document
                                </button>
                            </div>

                        </div>
                    )}

                    {/* 2. VALUATION TAB */}
                    {activeTab === 'tools' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in zoom-in-95 duration-500 no-print">
                            <div className="p-8 rounded-[40px] border border-white/5 bg-zinc-900/40 backdrop-blur-3xl">
                                <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-8">
                                    {result.documentType === 'PropertyCard' ? 'Urban Valuation' : 'Land Valuation'}
                                </h3>

                                <div className="space-y-6">
                                    <div className="p-6 bg-zinc-900 rounded-3xl border border-white/5">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-xs font-bold uppercase text-zinc-500 tracking-widest">Location Data</span>
                                            <span className="text-xs font-bold text-amber-400">{result.documentType}</span>
                                        </div>
                                        <p className="text-lg font-bold">{result.details.village}, {result.details.taluka}</p>
                                        <p className="text-sm text-zinc-400">{result.details.district}</p>
                                    </div>

                                    {!valuationEstimate && !isEstimating && (
                                        <button onClick={fetchSmartValuation} className="w-full py-4 bg-amber-400 text-black font-black uppercase tracking-widest rounded-xl hover:bg-amber-300 transition-all flex items-center justify-center gap-2">
                                            <TrendingUp size={18} /> Get AI Estimate
                                        </button>
                                    )}

                                    {isEstimating && <div className="text-center text-amber-400 font-bold animate-pulse">Analyzing Market Data...</div>}

                                    {valuationEstimate && (
                                        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl">
                                            <p className="text-xs font-bold text-green-500 uppercase tracking-widest mb-2">Estimated Market Rate</p>
                                            <p className="text-2xl font-black text-white">₹ {valuationEstimate.averageRate.toLocaleString('en-IN')} <span className="text-sm font-medium opacity-70">/ {valuationEstimate.unit}</span></p>
                                        </div>
                                    )}

                                    <div className="space-y-2 pt-4 border-t border-white/5">
                                        <label className="text-xs font-bold uppercase text-zinc-500">Rate Calculator</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                value={marketRate}
                                                onChange={(e) => setMarketRate(e.target.value)}
                                                placeholder="Rate"
                                                className="flex-1 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-amber-400 focus:outline-none"
                                            />
                                            <select
                                                value={rateUnit}
                                                onChange={(e) => setRateUnit(e.target.value)}
                                                className="bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-amber-400 focus:outline-none"
                                            >
                                                {result.documentType === 'PropertyCard' ? (
                                                    <>
                                                        <option value="sqmeter">Per Sq. Meter</option>
                                                        <option value="sqft">Per Sq. Feet</option>
                                                    </>
                                                ) : (
                                                    <>
                                                        <option value="acre">Per Acre</option>
                                                        <option value="guntha">Per Guntha</option>
                                                        <option value="hectare">Per Hectare</option>
                                                    </>
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 rounded-[40px] border border-white/5 bg-gradient-to-br from-zinc-900 to-black backdrop-blur-3xl flex flex-col justify-center">
                                {marketRate ? (
                                    <div className="space-y-6 text-center">
                                        <div>
                                            <p className="text-zinc-500 font-bold uppercase text-xs tracking-widest mb-2">Total Valuation</p>
                                            <p className="text-5xl font-black text-green-400 tracking-tighter">
                                                ₹ {calculateValuation(result, marketRate, rateUnit).total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-zinc-500 font-bold uppercase text-xs tracking-widest mb-2">
                                                Bank Loan Potential ({result.documentType === 'PropertyCard' ? '75%' : '55%'})
                                            </p>
                                            <p className="text-3xl font-black text-white tracking-tighter">
                                                ₹ {calculateValuation(result, marketRate, rateUnit).loan.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center opacity-40">
                                        <Calculator size={64} className="mx-auto mb-4" />
                                        <p className="font-bold">Enter Rate to Calculate</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* 3. PREVIEW */}
                    {activeTab === 'preview' && (
                        <div className="w-full h-[80vh] rounded-[40px] border border-zinc-800 bg-zinc-900/50 overflow-hidden flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-500 no-print">
                            {file?.type === 'application/pdf' ? (
                                <iframe src={preview!} className="w-full h-full" title="PDF Preview"></iframe>
                            ) : (
                                <img src={preview!} className="w-full h-full object-contain p-4" alt="Document Preview" />
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};
