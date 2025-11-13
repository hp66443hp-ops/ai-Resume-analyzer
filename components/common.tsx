
import React from 'react';

export const PageHeader: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <div className="bg-gradient-to-r from-indigo-700 to-indigo-500 rounded-xl shadow-lg p-6 mb-6">
    <h1 className="text-3xl font-bold text-white">{title}</h1>
    <p className="text-indigo-100 mt-1">{subtitle}</p>
  </div>
);

const UnderConstructionIllustration: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 162.5H150" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M137.5 162.5V125L100 100L62.5 125V162.5" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
    <path d="M81.25 162.5V137.5H118.75V162.5" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
    <path d="M62.5 81.25L100 56.25L137.5 81.25" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M125 37.5H150V62.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M50 62.5V37.5H75" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M100 75V87.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

export const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="bg-white p-12 rounded-lg shadow-lg border border-gray-200 mt-6 min-h-[600px] flex flex-col items-center justify-center">
    <UnderConstructionIllustration className="w-56 h-56 text-gray-300" />
    <h2 className="text-3xl font-bold text-gray-700 mt-6">{title}</h2>
    <p className="text-lg text-gray-500 mt-2">This page is under construction.</p>
  </div>
);


export const AwaitingAnalysisIllustration: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M62.5 150V50H112.5L137.5 75V150H62.5Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
    <path d="M112.5 50V75H137.5" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
    <path d="M81.25 106.25H118.75" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    <path d="M81.25 125H118.75" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    <path d="M125 112.5C125 131.25 112.5 143.75 93.75 143.75C75 143.75 62.5 131.25 62.5 112.5C62.5 93.75 75 81.25 93.75 81.25" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M106.25 125L131.25 150" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
  </svg>
);
