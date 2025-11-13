
import React, { useState, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { AuthPage } from './components/AuthPage';
import { DashboardPage } from './components/CompanyDashboard';
import { CandidateResumeCheckerPage, ProfilePage } from './components/CandidatePages';
import { JobPostingsPage } from './components/JobPages';
import { AllCandidatesPage } from './components/AllCandidatesPage';
import { PlaceholderPage } from './components/common';
import { analyzeResumes } from './services/geminiService';
// FIX: Imported 'Company' type and removed unused 'User' type.
import type { JobPosting, AnalysisResult, AnalyzedCandidate, Candidate, Company } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState('welcome');
  // FIX: Updated state type to correctly handle both Company and Candidate user types.
  const [currentUser, setCurrentUser] = useState<Company | Candidate | null>(null);

  // FIX: Updated state type to correctly handle both Company and Candidate user types.
  const [usersDB, setUsersDB] = useState<Record<string, Company | Candidate>>({
    "company@chankya.ai": {
      role: 'company',
      name: 'Acme Inc.',
      website: 'https://acme.com',
      password: '123',
      email: "company@chankya.ai"
    },
    "candidate@chankya.ai": {
      role: 'candidate',
      name: 'Aman Sharma',
      email: 'candidate@chankya.ai',
      linkedin: 'https://linkedin.com/in/amansharma',
      defaultResume: new File(["Sample resume content for Aman Sharma, a skilled React developer."], "aman_sharma_resume.txt", { type: "text/plain" }),
      password: '123'
    }
  });

  const [jobDescription, setJobDescription] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<AnalyzedCandidate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [jobPostings, setJobPostings] = useState<JobPosting[]>([
    {
      id: 1,
      title: 'Senior Software Engineer',
      location: 'New York, NY (Remote)',
      applicants: [
        { name: "Bob Smith", email: "bob@test.com", linkedin: "https://linkedin.com/in/bobsmith", salaryExpectation: "$150,000", coverLetter: "I am very excited about this role.", screeningAnswer: "The most challenging aspect is scaling the AI models...", resumeFile: "bob_smith_resume.pdf" },
        { name: "Alice Green", email: "alice@test.com", linkedin: "https://linkedin.com/in/alicegreen", salaryExpectation: "$145,000", coverLetter: "My experience with cloud infrastructure is a perfect fit.", screeningAnswer: "I believe maintaining a high-performance API is the biggest challenge.", resumeFile: "alice_green_resume.pdf" }
      ],
      date: '2025-10-28',
      companyName: "Acme Inc.",
      description: 'Seeking a senior engineer with 5+ years of Python and React experience.'
    },
    { id: 2, title: 'Product Manager, AI', location: 'San Francisco, CA', applicants: [], date: '2025-10-25', companyName: "Innovate Solutions", description: 'Lead the next generation of our AI-powered products.' },
  ]);

  const handleLogin = (email: string, password_raw: string) => {
    const user = usersDB[email];
    if (user && user.password === password_raw) {
      setCurrentUser(user);
      setCurrentPage(user.role === 'company' ? 'dashboard' : 'jobPostings');
      setError(null);
    } else {
      setError("Invalid email or password.");
    }
  };

  const handleRegister = (formData: any) => {
    const { email, password, role } = formData;
    if (usersDB[email]) {
      setError("An account with this email already exists.");
      return;
    }
    const newUser = role === 'company'
      ? { role, name: formData.companyName, website: formData.website, email, password }
      : { role, name: formData.fullName, linkedin: formData.linkedin, defaultResume: formData.resumeFile, email, password };
    
    setUsersDB(prev => ({ ...prev, [email]: newUser as Company | Candidate }));
    setCurrentUser(newUser as Company | Candidate);
    setCurrentPage(role === 'company' ? 'dashboard' : 'jobPostings');
    setError(null);
  };

  const handleUpdateProfile = (updatedData: Partial<Candidate>) => {
    if (currentUser) {
        const updatedUser = { ...currentUser, ...updatedData };
        setCurrentUser(updatedUser as Candidate);
        setUsersDB(prev => ({ ...prev, [currentUser.email]: updatedUser as Company | Candidate }));
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('welcome');
  };

  const handleAnalyze = useCallback(async (jd: string, resumes: File[], isSingleCandidate = false) => {
    if (jd.trim().length < 50) {
      setError('Please provide a more detailed job description (at least 50 characters).');
      return;
    }
    if (resumes.length === 0) {
      setError('Please provide at least one resume to analyze.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setSelectedCandidate(null);

    try {
      const result = await analyzeResumes(jd, resumes, isSingleCandidate);
      setAnalysisResult(result);
      if (result.candidates.length > 0) {
        setSelectedCandidate(result.candidates[0]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleApply = (jobId: number, applicationData: any) => {
    setJobPostings(prevJobs =>
      prevJobs.map(job => {
        if (job.id === jobId) {
          if (job.applicants.some(app => app.email === currentUser?.email)) return job;
          const newApplicant = { ...applicationData, resumeFile: (currentUser as Candidate).defaultResume?.name };
          return { ...job, applicants: [...job.applicants, newApplicant] };
        }
        return job;
      })
    );
  };
  
  const renderPage = () => {
    if (!currentUser) {
      return <AuthPage onLogin={handleLogin} onRegister={handleRegister} error={error} setError={setError} />;
    }

    switch (currentUser.role) {
      case 'company':
        switch (currentPage) {
          case 'dashboard': return <DashboardPage jobDescription={jobDescription} setJobDescription={setJobDescription} uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} handleAnalyze={handleAnalyze} isLoading={isLoading} error={error} setError={setError} analysisResult={analysisResult} selectedCandidate={selectedCandidate} setSelectedCandidate={setSelectedCandidate} />;
          case 'jobPostings': return <JobPostingsPage jobPostings={jobPostings} setJobPostings={setJobPostings} currentUser={currentUser} onApply={handleApply} />;
          case 'candidates': return <AllCandidatesPage jobPostings={jobPostings} />;
          case 'analytics': return <PlaceholderPage title="Analytics" />;
          default: setCurrentPage('dashboard'); return <DashboardPage jobDescription={jobDescription} setJobDescription={setJobDescription} uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} handleAnalyze={handleAnalyze} isLoading={isLoading} error={error} setError={setError} analysisResult={analysisResult} selectedCandidate={selectedCandidate} setSelectedCandidate={setSelectedCandidate}/>;
        }
      case 'candidate':
        switch (currentPage) {
          case 'dashboard': return <CandidateResumeCheckerPage currentUser={currentUser as Candidate} handleAnalyze={handleAnalyze} isLoading={isLoading} error={error} setError={setError} analysisResult={analysisResult} selectedCandidate={selectedCandidate} setSelectedCandidate={setSelectedCandidate} />;
          case 'jobPostings': return <JobPostingsPage jobPostings={jobPostings} setJobPostings={setJobPostings} currentUser={currentUser} onApply={handleApply} />;
          case 'profile': return <ProfilePage currentUser={currentUser as Candidate} onUpdateProfile={handleUpdateProfile} />;
          default: setCurrentPage('jobPostings'); return <JobPostingsPage jobPostings={jobPostings} setJobPostings={setJobPostings} currentUser={currentUser} onApply={handleApply} />;
        }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} currentUser={currentUser} onLogout={handleLogout} />
      <main className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {renderPage()}
      </main>
    </div>
  );
}
