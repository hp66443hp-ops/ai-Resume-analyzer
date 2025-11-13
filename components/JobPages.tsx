
import React, { useState } from 'react';
import { Plus, MapPin, Users, Clock, X, ChevronDown, Linkedin, DollarSign, FileSignature, MessageSquare, Paperclip } from 'lucide-react';
import { PageHeader } from './common';
import type { JobPosting, User, Candidate, Applicant } from '../types';

// AddJobForm Component
const AddJobForm: React.FC<{ onAddJob: (data: { title: string, location: string, description: string }) => void }> = ({ onAddJob }) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (!title || !location || !description) return; onAddJob({ title, location, description }); setTitle(''); setLocation(''); setDescription(''); };
  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 flex flex-col space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-2"><span className="flex items-center"><Plus className="w-5 h-5 mr-2 text-indigo-600" />Add New Job Posting</span></h3>
      <div><label htmlFor="job-title" className="block text-sm font-medium text-gray-700">Job Title</label><input type="text" id="job-title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm" placeholder="e.g., Senior Software Engineer" required/></div>
      <div><label htmlFor="job-location" className="block text-sm font-medium text-gray-700">Location</label><input type="text" id="job-location" value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm" placeholder="e.g., New York, NY (Remote)" required/></div>
      <div><label htmlFor="job-description-form" className="block text-sm font-medium text-gray-700">Job Description</label><textarea id="job-description-form" rows={5} value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm" placeholder="Enter a brief description..." required/></div>
      <button type="submit" className="w-full flex items-center justify-center px-6 py-2.5 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"><Plus className="w-5 h-5 mr-2" />Post Job</button>
    </form>
  );
};

// JobList Component
const JobList: React.FC<{ jobPostings: JobPosting[], currentUser: User | Candidate, onApplyClick: (job: JobPosting) => void, onManageClick: (job: JobPosting) => void }> = ({ jobPostings, currentUser, onApplyClick, onManageClick }) => {
  const hasApplied = (job: JobPosting) => currentUser.role === 'candidate' && job.applicants.some(app => app.email === currentUser.email);
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200"><h3 className="text-lg font-semibold text-gray-800">{currentUser.role === 'company' ? 'Current Job Postings' : 'Open Positions'} ({jobPostings.length})</h3></div>
      <div className="overflow-y-auto max-h-[600px]">{jobPostings.length === 0 ? <p className="p-4 text-gray-500">No postings found.</p> : <ul className="divide-y divide-gray-200">{jobPostings.map((job) => (<li key={job.id} className="p-4 hover:bg-gray-50"><div className="flex justify-between items-center"><div><p className="text-base font-semibold text-indigo-700">{job.title}</p><p className="text-sm font-medium text-gray-700 pt-1">{job.companyName}</p><div className="flex items-center text-sm text-gray-600 mt-2 space-x-4"><span className="flex items-center"><MapPin className="w-4 h-4 mr-1 text-gray-400" />{job.location}</span>{currentUser.role === 'company' && <span className="flex items-center"><Users className="w-4 h-4 mr-1 text-gray-400" />{job.applicants.length} Applicant(s)</span>}<span className="flex items-center"><Clock className="w-4 h-4 mr-1 text-gray-400" />Posted: {job.date}</span></div></div>{currentUser.role === 'company' ? <button onClick={() => onManageClick(job)} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Manage</button> : <button onClick={() => onApplyClick(job)} disabled={hasApplied(job)} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${hasApplied(job) ? 'bg-green-100 text-green-700 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>{hasApplied(job) ? 'Applied' : 'Apply Now'}</button>}</div></li>))}</ul>}</div>
    </div>
  );
};

// ApplicationModal Components
const FormInput: React.FC<{ label: string, icon?: React.ElementType, disabled?: boolean, [key: string]: any }> = ({ label, icon: Icon, disabled, ...props }) => (<div><label className="block text-sm font-medium text-gray-700">{label}</label><div className="relative mt-1">{Icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icon className="h-5 w-5 text-gray-400" /></div>}<input type="text" {...props} disabled={disabled} className={`block w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm ${disabled ? 'bg-gray-100 text-gray-500' : 'text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'}`} /></div></div>);
const FormTextarea: React.FC<{ label: string, icon: React.ElementType, question?: string, [key: string]: any }> = ({ label, icon: Icon, question, ...props }) => (<div><label className="block text-sm font-medium text-gray-700 flex items-center">{Icon && <Icon className="w-5 h-5 text-gray-500 mr-2" />}{label}</label>{question && <p className="text-sm text-gray-600 mt-1 mb-2 italic">"{question}"</p>}<textarea {...props} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm" /></div>);

const ApplicationModal: React.FC<{ job: JobPosting, currentUser: Candidate, onClose: () => void, onSubmit: (data: any) => void }> = ({ job, currentUser, onClose, onSubmit }) => {
  const [salary, setSalary] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [screeningAnswer, setScreeningAnswer] = useState('');
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSubmit({ name: currentUser.name, email: currentUser.email, linkedin: currentUser.linkedin, salaryExpectation: salary, coverLetter, screeningAnswer }); };
  return (<div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4" onClick={onClose}><div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}><div className="flex justify-between items-center p-4 border-b border-gray-200"><h3 className="text-lg font-semibold text-gray-900">{`Apply for: ${job.title}`}</h3><button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-full"><X className="w-6 h-6" /></button></div><form onSubmit={handleSubmit}><div className="p-6 max-h-[60vh] overflow-y-auto space-y-4"><h4 className="text-lg font-semibold text-gray-800">Your Information</h4><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><FormInput label="Full Name" value={currentUser.name} disabled /><FormInput label="Email Address" value={currentUser.email} disabled /></div><FormInput label="LinkedIn Profile" value={currentUser.linkedin} disabled /><FormInput label="Salary Expectation" value={salary} onChange={(e: any) => setSalary(e.target.value)} icon={DollarSign} required /><FormTextarea label="Brief Cover Letter" value={coverLetter} onChange={(e: any) => setCoverLetter(e.target.value)} rows={4} icon={FileSignature} /><FormTextarea label="Screening Question" question="Based on the job description, what do you consider the most challenging aspect of this role and how does your experience prepare you for it?" value={screeningAnswer} onChange={(e: any) => setScreeningAnswer(e.target.value)} rows={4} icon={MessageSquare} required /><div className="flex items-center p-3 bg-gray-50 border border-gray-200 rounded-md"><Paperclip className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" /><span className="text-sm font-medium text-gray-800">Your resume ({currentUser.defaultResume.name}) will be attached.</span></div></div><div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end"><button type="button" onClick={onClose} className="mr-3 px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50">Cancel</button><button type="submit" className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700">Submit</button></div></form></div></div>);
};

// ApplicantModal Components
const ApplicantDetailRow: React.FC<{ icon: React.ElementType, label: string, value?: string, isLink?: boolean, isBlock?: boolean }> = ({ icon: Icon, label, value, isLink, isBlock }) => (<div className="text-sm"><label className="font-semibold text-gray-700 flex items-center"><Icon className="w-4 h-4 text-gray-500 mr-2" />{label}</label>{isBlock ? <p className="mt-1 text-gray-600 bg-white p-2 border rounded-md whitespace-pre-wrap">{value || 'N/A'}</p> : isLink ? <a href={value} target="_blank" rel="noopener noreferrer" className="mt-1 text-indigo-600 hover:underline break-all">{value || 'N/A'}</a> : <p className="mt-1 text-gray-600">{value || 'N/A'}</p>}</div>);
const ApplicantModal: React.FC<{ job: JobPosting, onClose: () => void }> = ({ job, onClose }) => {
  const [expandedApplicant, setExpandedApplicant] = useState<string | null>(null);
  const toggleApplicant = (email: string) => setExpandedApplicant(prev => (prev === email ? null : email));
  return (<div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4" onClick={onClose}><div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}><div className="flex justify-between items-center p-4 border-b border-gray-200"><h3 className="text-lg font-semibold text-gray-900">{`Applicants for: ${job.title}`}</h3><button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-full"><X className="w-6 h-6" /></button></div><div className="p-6 max-h-[60vh] overflow-y-auto">{job.applicants.length === 0 ? <p className="text-gray-500 text-center py-4">No applicants yet.</p> : <ul className="divide-y divide-gray-200">{job.applicants.map((applicant, index) => (<li key={index} className="py-3"><div className="flex justify-between items-center cursor-pointer" onClick={() => toggleApplicant(applicant.email)}><div className="flex items-center space-x-3"><img className="h-9 w-9 rounded-full object-cover bg-gray-200" src={`https://placehold.co/100x100/EBF4FF/4C51BF?text=${applicant.name.charAt(0)}`} alt={applicant.name} /><div><p className="text-sm font-medium text-gray-900">{applicant.name}</p><p className="text-sm text-gray-500">{applicant.email}</p></div></div><ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedApplicant === applicant.email ? 'rotate-180' : ''}`} /></div>{expandedApplicant === applicant.email && (<div className="mt-4 pl-12 pr-4 space-y-4 bg-gray-50 p-4 rounded-md border border-gray-200"><ApplicantDetailRow icon={Linkedin} label="LinkedIn" value={applicant.linkedin} isLink /><ApplicantDetailRow icon={DollarSign} label="Salary Expectation" value={applicant.salaryExpectation} /><ApplicantDetailRow icon={FileSignature} label="Cover Letter" value={applicant.coverLetter} isBlock /><ApplicantDetailRow icon={MessageSquare} label="Screening Answer" value={applicant.screeningAnswer} isBlock /><ApplicantDetailRow icon={Paperclip} label="Resume" value={applicant.resumeFile} /></div>)}</li>))}</ul>}</div><div className="p-4 bg-gray-50 border-t border-gray-200 text-right"><button onClick={onClose} className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700">Close</button></div></div></div>);
};

// Main JobPostingsPage Component
interface JobPostingsPageProps { jobPostings: JobPosting[], setJobPostings: React.Dispatch<React.SetStateAction<JobPosting[]>>, currentUser: User | Candidate, onApply: (jobId: number, data: any) => void }
export const JobPostingsPage: React.FC<JobPostingsPageProps> = ({ jobPostings, setJobPostings, currentUser, onApply }) => {
  const [viewingApplicantsFor, setViewingApplicantsFor] = useState<JobPosting | null>(null);
  const [applyingToJob, setApplyingToJob] = useState<JobPosting | null>(null);
  const handleAddJob = (newJobData: { title: string, location: string, description: string }) => { const newJob = { id: Date.now(), applicants: [], date: new Date().toISOString().split('T')[0], companyName: currentUser.name, ...newJobData, }; setJobPostings(prev => [newJob, ...prev]); };
  const handleApplySubmit = (applicationData: any) => { if (applyingToJob) { onApply(applyingToJob.id, applicationData); setApplyingToJob(null); } };

  return (
    <>
      <PageHeader title="Job Postings" subtitle={currentUser.role === 'company' ? "Manage your company's open roles." : "Browse and apply for open positions."} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">{currentUser.role === 'company' && <div className="lg:col-span-1"><AddJobForm onAddJob={handleAddJob} /></div>}<div className={currentUser.role === 'company' ? "lg:col-span-2" : "lg:col-span-3"}><JobList jobPostings={jobPostings} currentUser={currentUser} onApplyClick={setApplyingToJob} onManageClick={setViewingApplicantsFor} /></div></div>
      {viewingApplicantsFor && <ApplicantModal job={viewingApplicantsFor} onClose={() => setViewingApplicantsFor(null)} />}
      {applyingToJob && <ApplicationModal job={applyingToJob} currentUser={currentUser as Candidate} onClose={() => setApplyingToJob(null)} onSubmit={handleApplySubmit} />}
    </>
  );
};
