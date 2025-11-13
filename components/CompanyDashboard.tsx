
import React, { useState } from 'react';
import { FileText, Upload, Paperclip, Trash2, Search, Star, HardDrive, Lightbulb, CheckCircle, XCircle, AlertCircle, Mail, Phone, Linkedin, Check, Sparkles, X } from 'lucide-react';
import { PageHeader, AwaitingAnalysisIllustration } from './common';
import type { AnalysisResult, AnalyzedCandidate } from '../types';

// Utility Function
function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// JDSuggestionModal Component
const JDSuggestionModal: React.FC<{ onClose: () => void; onApplySuggestion: (text: string) => void; }> = ({ onClose, onApplySuggestion }) => {
    const suggestions = {
        "Key Responsibilities": ["Design, develop, and maintain high-quality, scalable web applications.", "Collaborate with cross-functional teams to define and ship new features.", "Write clean, efficient, and well-documented code."],
        "Qualifications": ["Bachelor's degree in Computer Science or a related field.", "5+ years of professional software development experience.", "Proven experience with React, Node.js, and Python.", "Strong understanding of database systems (e.g., PostgreSQL, MongoDB)."]
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden transform transition-all" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center"><Sparkles className="w-5 h-5 mr-2 text-indigo-600" />AI Content Suggestions</h3>
                    <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-full"><X className="w-6 h-6" /></button>
                </div>
                <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
                    {Object.entries(suggestions).map(([title, items]) => (
                        <div key={title}>
                            <h4 className="text-md font-semibold text-gray-800 mb-2">{title}</h4>
                            <ul className="space-y-2">
                                {items.map((item, index) => (
                                    <li key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                                        <p className="text-sm text-gray-700">{item}</p>
                                        <button onClick={() => onApplySuggestion(`\n**${title}**\n- ${item}\n`)} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded hover:bg-indigo-200">Add</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-200 text-right"><button onClick={onClose} className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50">Close</button></div>
            </div>
        </div>
    );
};

// JobDescriptionCard Component
// FIX: Corrected state setter prop types to allow functional updates.
const JobDescriptionCard: React.FC<{ jobDescription: string; setJobDescription: React.Dispatch<React.SetStateAction<string>>; setError: React.Dispatch<React.SetStateAction<string | null>>; }> = ({ jobDescription, setJobDescription, setError }) => {
    const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
    const applySuggestion = (text: string) => { setJobDescription(prev => prev + "\n" + text); setIsSuggestionModalOpen(false); };
    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 flex flex-col space-y-4">
                <div>
                    <label htmlFor="job-description" className="block text-lg font-semibold text-gray-800 mb-2"><span className="flex items-center"><FileText className="w-5 h-5 mr-2 text-indigo-600" />1. Job Description</span></label>
                    <p className="text-sm text-gray-600 mb-3">Paste the full job description below. The AI will use this to score resumes.</p>
                    <textarea id="job-description" rows={8} className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm" placeholder="e.g., 'Seeking a Senior Software Engineer with 5+ years of Python and React experience...'" value={jobDescription} onChange={(e) => { setJobDescription(e.target.value); setError(null); }} />
                    <button onClick={() => setIsSuggestionModalOpen(true)} className="mt-3 flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400"><Sparkles className="w-4 h-4 mr-2" />Suggest Content</button>
                </div>
            </div>
            {isSuggestionModalOpen && <JDSuggestionModal onClose={() => setIsSuggestionModalOpen(false)} onApplySuggestion={applySuggestion} />}
        </>
    );
};

// ResumeUploadCard Component
const ResumeUploadCard: React.FC<{ uploadedFiles: File[]; handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void; removeFile: (fileName: string) => void; clearAllFiles: () => void; }> = ({ uploadedFiles, handleFileChange, removeFile, clearAllFiles }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 flex flex-col space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2"><span className="flex items-center"><HardDrive className="w-5 h-5 mr-2 text-indigo-600" />2. Upload Resumes</span></h3>
        <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none"><span className="flex items-center space-x-2"><Upload className="w-6 h-6 text-gray-600" /><span className="font-medium text-gray-600">Click to upload or drag and drop</span></span><span className="mt-1 text-sm text-gray-500">PDF, DOCX, or TXT</span></label>
        <input id="file-upload" name="file-upload" type="file" multiple className="sr-only" accept=".pdf,.docx,.txt" onChange={handleFileChange} />
        {uploadedFiles.length > 0 && (
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {uploadedFiles.map(file => (
                    <div key={file.name} className="flex justify-between items-center p-2 bg-gray-50 border border-gray-200 rounded-md">
                        <div className="flex items-center space-x-2 overflow-hidden"><Paperclip className="w-4 h-4 text-gray-500 flex-shrink-0" /><div className="flex flex-col overflow-hidden"><span className="text-sm font-medium text-gray-800 truncate">{file.name}</span><span className="text-xs text-gray-500">{formatBytes(file.size)}</span></div></div>
                        <button onClick={() => removeFile(file.name)} className="p-1 text-gray-400 hover:text-red-600 rounded-full transition-colors flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
                    </div>
                ))}
            </div>
        )}
        {uploadedFiles.length > 0 && (<div className="flex justify-between items-center mt-3"><p className="text-sm text-gray-600">{uploadedFiles.length} file(s) added.</p><button onClick={clearAllFiles} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Clear all</button></div>)}
    </div>
);

// CandidateDetail Component
const CandidateDetail: React.FC<{ candidate: AnalyzedCandidate | null }> = ({ candidate }) => {
    const [activeTab, setActiveTab] = useState('summary');
    if (!candidate) return <div className="bg-white rounded-lg shadow-lg border border-gray-200 h-full min-h-[400px] flex items-center justify-center p-6"><p className="text-gray-500">Select a candidate to see details.</p></div>;
    return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 h-full max-h-[800px] flex flex-col">
            <div className="p-4 border-b border-gray-200"><h3 className="text-xl font-bold text-gray-800">{candidate.name}</h3><p className="text-base text-gray-600">{candidate.role}</p></div>
            <div className="border-b border-gray-200"><nav className="-mb-px flex space-x-6 px-4" aria-label="Tabs"><button onClick={() => setActiveTab('summary')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'summary' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>AI Summary</button><button onClick={() => setActiveTab('contact')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'contact' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Contact</button></nav></div>
            <div className="overflow-y-auto p-4">
                {activeTab === 'summary' && (<div className="space-y-4"><div><h4 className="text-sm font-semibold text-gray-800 mb-2">AI Summary</h4><p className="text-sm text-gray-700 bg-gray-50 rounded-md p-3 border border-gray-200">{candidate.summary}</p></div><div><h4 className="text-sm font-semibold text-gray-800 mb-2">Matched Requirements</h4><ul className="space-y-1.5">{candidate.matchedRequirements.map((item, index) => (<li key={index} className="flex items-start text-sm"><CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span className="text-gray-700">{item}</span></li>))}{candidate.matchedRequirements.length === 0 && <li className="flex items-start text-sm text-gray-500"><AlertCircle className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />No direct matches found.</li>}</ul></div><div><h4 className="text-sm font-semibold text-gray-800 mb-2">Missing Requirements</h4><ul className="space-y-1.5">{candidate.missingRequirements.map((item, index) => (<li key={index} className="flex items-start text-sm"><XCircle className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" /><span className="text-gray-700">{item}</span></li>))}{candidate.missingRequirements.length === 0 && <li className="flex items-start text-sm text-gray-500"><Check className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />No missing requirements identified.</li>}</ul></div></div>)}
                {activeTab === 'contact' && (<div className="space-y-4"><div><h4 className="text-sm font-semibold text-gray-800 mb-2">Contact Information</h4><div className="space-y-2"><div className="flex items-center text-sm"><Mail className="w-4 h-4 text-gray-500 mr-2" /><span className="text-gray-700">{candidate.contact?.email || 'Not Found'}</span></div><div className="flex items-center text-sm"><Phone className="w-4 h-4 text-gray-500 mr-2" /><span className="text-gray-700">{candidate.contact?.phone || 'Not Found'}</span></div><div className="flex items-center text-sm"><Linkedin className="w-4 h-4 text-gray-500 mr-2" /><span className="text-gray-700">{candidate.linkedin || 'Not Found'}</span></div></div></div></div>)}
            </div>
        </div>
    );
};

// CandidateList Components
const CandidateListItem: React.FC<{ candidate: AnalyzedCandidate; isSelected: boolean; onSelect: () => void; }> = ({ candidate, isSelected, onSelect }) => {
    const scoreColor = candidate.matchScore >= 90 ? 'bg-green-100 text-green-800' : candidate.matchScore >= 70 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800';
    return (<li onClick={onSelect} className={`p-4 cursor-pointer hover:bg-gray-50 ${isSelected ? 'bg-indigo-50 border-r-4 border-indigo-500' : ''}`}><div className="flex justify-between items-center"><div className="overflow-hidden"><p className="text-base font-semibold text-indigo-700 truncate">{candidate.name}</p><p className="text-sm text-gray-600 truncate">{candidate.role}</p></div><span className={`flex-shrink-0 ml-2 px-2.5 py-0.5 rounded-full text-sm font-medium ${scoreColor}`}>{candidate.matchScore}%</span></div></li>);
};
// FIX: Corrected state setter prop type to allow functional updates.
const CandidateList: React.FC<{ candidates: AnalyzedCandidate[]; selectedCandidate: AnalyzedCandidate | null; onSelectCandidate: React.Dispatch<React.SetStateAction<AnalyzedCandidate | null>>; }> = ({ candidates, selectedCandidate, onSelectCandidate }) => (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 h-full max-h-[800px] flex flex-col"><div className="p-4 border-b border-gray-200"><h3 className="text-lg font-semibold text-gray-800">Ranked Candidates ({candidates.length})</h3></div><div className="overflow-y-auto">{candidates.length === 0 ? <p className="p-4 text-gray-500">No candidates found.</p> : <ul className="divide-y divide-gray-200">{candidates.map((c, i) => (<CandidateListItem key={i} candidate={c} isSelected={selectedCandidate?.name === c.name} onSelect={() => onSelectCandidate(c)} />))}</ul>}</div></div>
);

// OverallSuggestions Component
const OverallSuggestions: React.FC<{ suggestions: string[]; title: string; }> = ({ suggestions, title }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"><h3 className="text-lg font-semibold text-gray-800 mb-3"><span className="flex items-center"><Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />{title}</span></h3><ul className="space-y-2 list-disc list-inside">{suggestions.map((s, i) => (<li key={i} className="text-sm text-gray-700">{s}</li>))}</ul></div>
);

// AnalysisResults Component
// FIX: Corrected state setter prop type to allow functional updates.
export const AnalysisResults: React.FC<{ isLoading: boolean; analysisResult: AnalysisResult | null; selectedCandidate: AnalyzedCandidate | null; setSelectedCandidate: React.Dispatch<React.SetStateAction<AnalyzedCandidate | null>>; isSingleCandidate: boolean; }> = ({ isLoading, analysisResult, selectedCandidate, setSelectedCandidate, isSingleCandidate }) => {
    if (isLoading) return <div className="flex flex-col items-center justify-center bg-white p-12 rounded-lg shadow-lg border border-gray-200 h-full min-h-[400px]"><svg className="animate-spin h-12 w-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><p className="text-lg font-medium text-gray-700 mt-4">Analyzing...</p><p className="text-gray-500">Please wait, this may take a moment.</p></div>;
    if (!analysisResult) return <div className="flex flex-col items-center justify-center bg-white p-12 rounded-lg shadow-lg border border-gray-200 h-full min-h-[400px]"><AwaitingAnalysisIllustration className="w-40 h-40 text-gray-300" /><p className="text-lg font-medium text-gray-700 mt-4">Awaiting Analysis</p><p className="text-gray-500 text-center">Your analysis will appear here.</p></div>;
    
    return (
        <div className="flex flex-col space-y-6">
            <OverallSuggestions suggestions={analysisResult.overallSuggestions} title={isSingleCandidate ? "AI Suggestions For You" : "AI Overall Suggestions"} />
            {isSingleCandidate ? (<CandidateDetail candidate={selectedCandidate} />) : (<div className="grid grid-cols-1 md:grid-cols-2 gap-6"><CandidateList candidates={analysisResult.candidates} selectedCandidate={selectedCandidate} onSelectCandidate={setSelectedCandidate} /><CandidateDetail candidate={selectedCandidate} /></div>)}
        </div>
    );
};

// Main DashboardPage Component
// FIX: Corrected state setter prop types to allow functional updates.
interface DashboardPageProps { jobDescription: string; setJobDescription: React.Dispatch<React.SetStateAction<string>>; uploadedFiles: File[]; setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>; handleAnalyze: (jd: string, resumes: File[], isSingleCandidate?: boolean) => void; isLoading: boolean; error: string | null; setError: React.Dispatch<React.SetStateAction<string | null>>; analysisResult: AnalysisResult | null; selectedCandidate: AnalyzedCandidate | null; setSelectedCandidate: React.Dispatch<React.SetStateAction<AnalyzedCandidate | null>>; }
export const DashboardPage: React.FC<DashboardPageProps> = ({ jobDescription, setJobDescription, uploadedFiles, setUploadedFiles, handleAnalyze, isLoading, error, setError, analysisResult, selectedCandidate, setSelectedCandidate }) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const uniqueNewFiles = newFiles.filter(newFile => !uploadedFiles.some(existingFile => existingFile.name === newFile.name));
            setUploadedFiles(prevFiles => [...prevFiles, ...uniqueNewFiles]);
        }
    };
    const removeFile = (fileName: string) => { setUploadedFiles(prevFiles => prevFiles.filter(file => file.name !== fileName)); };
    const clearAllFiles = () => { setUploadedFiles([]); };

    return (
        <>
            <PageHeader title="Recruiter Dashboard" subtitle="Analyze resumes against a job description." />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-6"><JobDescriptionCard jobDescription={jobDescription} setJobDescription={setJobDescription} setError={setError} /><ResumeUploadCard uploadedFiles={uploadedFiles} handleFileChange={handleFileChange} removeFile={removeFile} clearAllFiles={clearAllFiles} /></div>
                <div className="flex flex-col space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"><h3 className="text-lg font-semibold text-gray-800 mb-2"><span className="flex items-center"><Star className="w-5 h-5 mr-2 text-indigo-600" />3. Start Analysis</span></h3><button onClick={() => handleAnalyze(jobDescription, uploadedFiles, false)} disabled={isLoading} className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all">{isLoading ? <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : <Search className="w-5 h-5 mr-2" />} {isLoading ? 'Analyzing...' : `Analyze ${uploadedFiles.length} Resume(s)`}</button>{error && (<div className="mt-4 flex items-center p-3 bg-red-50 border border-red-200 rounded-md"><AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" /><p className="text-sm text-red-700">{error}</p></div>)}</div>
                    <AnalysisResults isLoading={isLoading} analysisResult={analysisResult} selectedCandidate={selectedCandidate} setSelectedCandidate={setSelectedCandidate} isSingleCandidate={false} />
                </div>
            </div>
        </>
    );
};
