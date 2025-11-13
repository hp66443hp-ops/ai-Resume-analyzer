
import React, { useState } from 'react';
import { User, Building, Globe, Linkedin, Cpu, AlertCircle } from 'lucide-react';

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
      required
    />
  </div>
);

interface AuthPageProps {
  onLogin: (email: string, password_raw: string) => void;
  onRegister: (formData: any) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onRegister, error, setError }) => {
  const [authMode, setAuthMode] = useState('login');
  const [roleToRegister, setRoleToRegister] = useState('candidate');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const handleAuthSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (authMode === 'login') {
      onLogin(email, password);
    } else {
      if (roleToRegister === 'candidate' && !resumeFile) {
        setError("Please upload your resume to register.");
        return;
      }
      const formData = { email, password, role: roleToRegister, fullName, companyName, website, linkedin, resumeFile };
      onRegister(formData);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-200">
        <div>
          <Cpu className="mx-auto h-12 w-auto text-indigo-600" />
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            {authMode === 'login' ? 'Sign in to your account' : 'Create a new account'}
          </h2>
        </div>
        
        <div className="flex border-b border-gray-200">
          <button onClick={() => { setAuthMode('login'); setError(null); }} className={`flex-1 py-2 text-sm font-medium ${authMode === 'login' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>Login</button>
          <button onClick={() => { setAuthMode('register'); setError(null); }} className={`flex-1 py-2 text-sm font-medium ${authMode === 'register' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>Register</button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleAuthSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input id="email-address" name="email" type="email" autoComplete="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 ${authMode === 'login' ? 'rounded-b-md' : ''} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>
          
          {authMode === 'register' && (
            <div className="space-y-4">
              <div className="flex rounded-md shadow-sm">
                <button type="button" onClick={() => setRoleToRegister('candidate')} className={`flex-1 py-2 px-4 text-sm font-medium ${roleToRegister === 'candidate' ? 'bg-indigo-600 text-white z-10' : 'bg-white text-gray-700 hover:bg-gray-50'} border border-gray-300 rounded-l-md focus:outline-none`}>Candidate</button>
                <button type="button" onClick={() => setRoleToRegister('company')} className={`flex-1 py-2 px-4 text-sm font-medium ${roleToRegister === 'company' ? 'bg-indigo-600 text-white z-10' : 'bg-white text-gray-700 hover:bg-gray-50'} border border-gray-300 rounded-r-md -ml-px focus:outline-none`}>Company</button>
              </div>
              {roleToRegister === 'candidate' ? (
                <>
                  <InputWithIcon icon={User} placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  <InputWithIcon icon={Linkedin} placeholder="LinkedIn URL" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
                  <label className="block text-sm font-medium text-gray-700">Default Resume</label>
                  <input type="file" required accept=".pdf,.docx,.txt" onChange={(e) => e.target.files && setResumeFile(e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                </>
              ) : (
                <>
                  <InputWithIcon icon={Building} placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                  <InputWithIcon icon={Globe} placeholder="Company Website" value={website} onChange={(e) => setWebsite(e.target.value)} />
                </>
              )}
            </div>
          )}
          
          {error && (
            <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div>
            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">{authMode === 'login' ? 'Sign in' : 'Register'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
