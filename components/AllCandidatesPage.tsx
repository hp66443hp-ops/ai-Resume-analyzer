
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { PageHeader } from './common';
import type { JobPosting } from '../types';

interface InputWithIconProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ElementType;
}

const InputWithIcon: React.FC<InputWithIconProps> = ({ icon: Icon, ...props }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Icon className="h-5 w-5 text-gray-400" />
    </div>
    <input
      {...props}
      className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
  </div>
);

interface AllCandidatesPageProps {
  jobPostings: JobPosting[];
}

export const AllCandidatesPage: React.FC<AllCandidatesPageProps> = ({ jobPostings }) => {
  const allApplicants = jobPostings.flatMap(job =>
    job.applicants.map(applicant => ({
      ...applicant,
      jobTitle: job.title,
      jobId: job.id
    }))
  );
  
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredApplicants = allApplicants.filter(applicant =>
    applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    applicant.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <PageHeader title="All Candidates" subtitle={`Browse all ${allApplicants.length} applicants across ${jobPostings.length} job postings.`} />
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <div className="relative mb-4">
          <InputWithIcon icon={Search} placeholder="Search by name, email, or job title..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied For</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resume</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplicants.map((applicant) => (
                <tr key={applicant.email + applicant.jobId}>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><div className="h-9 w-9 flex-shrink-0"><img className="h-9 w-9 rounded-full object-cover bg-gray-200" src={`https://placehold.co/100x100/EBF4FF/4C51BF?text=${applicant.name.charAt(0)}`} alt={applicant.name} /></div><div className="ml-4"><div className="text-sm font-medium text-gray-900">{applicant.name}</div></div></div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900">{applicant.jobTitle}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900">{applicant.email}</div><a href={applicant.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline">LinkedIn</a></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{applicant.salaryExpectation}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm"><button className="text-indigo-600 hover:text-indigo-900">View Resume</button></td>
                </tr>
              ))}
              {filteredApplicants.length === 0 && (<tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">No candidates found.</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
