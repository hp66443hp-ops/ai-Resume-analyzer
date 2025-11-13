
import React, { useState } from 'react';
import { FileUp, Paperclip, Star, Search, AlertCircle, User, Linkedin, Save, CheckCircle } from 'lucide-react';
import { PageHeader } from './common';
import { AnalysisResults } from './CompanyDashboard';
import type { Candidate, AnalysisResult, AnalyzedCandidate } from '../types';

interface CandidateResumeCheckerPageProps {
  currentUser: Candidate;
  handleAnalyze: (jd: string, resumes: File[], isSingleCandidate?: boolean) => void;
  isLoading: boolean;
  error: string | null;
  setError: (err: string | null) => void;
  analysisResult: AnalysisResult | null;
  selectedCandidate: AnalyzedCandidate | null;
  setSelectedCandidate: (c: AnalyzedCandidate) => void;
}

const JobDescriptionCard: React.FC<{ jobDescription: string; setJobDescription: (jd: string) => void; setError: (error: string | null) => void; }> = ({ jobDescription, setJobDescription, setError }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <label htmlFor="job-description" className="block text-lg font-semibold text-gray-800 mb-2">1. Job Description</label>
        <p className="text-sm text-gray-600 mb-3">Paste the full job description below to check your resume's compatibility.</p>
        <textarea id="job-description" rows={8} className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm" placeholder="e.g., 'Seeking a Senior Software Engineer...'" value={jobDescription} onChange={(e) => { setJobDescription(e.target.value); setError(null); }} />
    </div>
);

export const CandidateResumeCheckerPage: React.FC<CandidateResumeCheckerPageProps> = ({ currentUser, handleAnalyze, isLoading, error, setError, analysisResult, selectedCandidate, setSelectedCandidate }) => {
  const [jobDescription, setJobDescription] = useState('');

  return (
    <>
      <PageHeader title="Resume Checker" subtitle="Analyze your resume against a job description." />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col space-y-6">
          <JobDescriptionCard jobDescription={jobDescription} setJobDescription={setJobDescription} setError={setError} />
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2"><span className="flex items-center"><FileUp className="w-5 h-5 mr-2 text-indigo-600" />2. Your Resume</span></h3>
            <p className="text-sm text-gray-600 mb-3">This analysis will use your default resume.</p>
            <div className="flex justify-between items-center p-3 bg-gray-50 border border-gray-200 rounded-md">
              <div className="flex items-center space-x-2 overflow-hidden"><Paperclip className="w-4 h-4 text-gray-500 flex-shrink-0" /><span className="text-sm font-medium text-gray-800 truncate">{currentUser.defaultResume?.name || "No Resume on File"}</span></div>
              <button onClick={() => alert("Please update your resume in the 'My Profile' section.")} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Change</button>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2"><span className="flex items-center"><Star className="w-5 h-5 mr-2 text-indigo-600" />3. Start Analysis</span></h3>
            <button onClick={() => handleAnalyze(jobDescription, [currentUser.defaultResume], true)} disabled={isLoading || !currentUser.defaultResume} className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all">{isLoading ? <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : <Search className="w-5 h-5 mr-2" />} {isLoading ? 'Analyzing...' : 'Check My Resume'}</button>
            {error && <div className="mt-4 flex items-center p-3 bg-red-50 border border-red-200 rounded-md"><AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" /><p className="text-sm text-red-700">{error}</p></div>}
          </div>
        </div>
        <div className="flex flex-col space-y-6">
          <AnalysisResults isLoading={isLoading} analysisResult={analysisResult} selectedCandidate={selectedCandidate} setSelectedCandidate={setSelectedCandidate} isSingleCandidate={true} />
        </div>
      </div>
    </>
  );
};

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ElementType;
}

const FormInput: React.FC<FormInputProps> = ({ label, icon: Icon, ...props }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative mt-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icon className="h-5 w-5 text-gray-400" /></div>
          <input type="text" {...props} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500" />
      </div>
    </div>
);


interface ProfilePageProps {
  currentUser: Candidate;
  onUpdateProfile: (updatedData: Partial<Candidate>) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser, onUpdateProfile }) => {
  const [name, setName] = useState(currentUser.name);
  const [linkedin, setLinkedin] = useState(currentUser.linkedin);
  const [resumeFile, setResumeFile] = useState<File>(currentUser.defaultResume);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onUpdateProfile({ name, linkedin, defaultResume: resumeFile });
    setMessage({ type: 'success', text: 'Profile updated successfully!' });
    setTimeout(() => setMessage(null), 3000);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  return (
    <>
      <PageHeader title="My Profile" subtitle="Update your personal information and default resume." />
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center space-x-4">
            <img className="h-20 w-20 rounded-full object-cover bg-gray-200 border-4 border-indigo-100" src={`https://placehold.co/100x100/E6FFFA/2C7A7B?text=${name.charAt(0)}`} alt="Profile" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
              <p className="text-sm text-gray-600">{currentUser.email} (Email cannot be changed)</p>
            </div>
          </div>
          <FormInput label="Full Name" icon={User} value={name} onChange={(e) => setName(e.target.value)} required />
          <FormInput label="LinkedIn URL" icon={Linkedin} value={linkedin} onChange={(e) => setLinkedin(e.target.value)} required />
          <div>
            <label className="block text-sm font-medium text-gray-700">Default Resume</label>
            <div className="mt-2 flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md">
              <div className="flex items-center space-x-2 overflow-hidden"><Paperclip className="w-4 h-4 text-gray-500 flex-shrink-0" /><span className="text-sm font-medium text-gray-800 truncate">{resumeFile?.name || "No Resume on File"}</span></div>
              <label htmlFor="resume-upload" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">Change</label>
              <input type="file" id="resume-upload" className="sr-only" accept=".pdf,.docx,.txt" onChange={handleFileChange} />
            </div>
          </div>
          {message && (<div className={`flex items-center p-3 ${message.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} rounded-md`}><CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" /><p className={`text-sm ${message.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>{message.text}</p></div>)}
          <button type="submit" className="w-full flex items-center justify-center px-6 py-2.5 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"><Save className="w-5 h-5 mr-2" />Save Changes</button>
        </form>
      </div>
    </>
  );
};
