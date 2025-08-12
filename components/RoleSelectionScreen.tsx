
import React from 'react';
import { UserRole } from '../types';
import { SignalIcon, GlobeIcon } from './icons';

interface RoleSelectionScreenProps {
  onSelectRole: (role: UserRole) => void;
}

export const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({ onSelectRole }) => {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center p-4 text-center">
      <GlobeIcon className="w-20 h-20 text-brand-accent mx-auto" />
      <h1 className="text-4xl font-bold text-white mt-4">RemoteNet Share</h1>
      <p className="text-brand-text-secondary mt-2 mb-12">What would you like to do?</p>
      
      <div className="w-full max-w-md grid grid-cols-1 md:grid-cols-2 gap-6">
        <button 
          onClick={() => onSelectRole(UserRole.PROVIDER)} 
          className="bg-brand-secondary p-8 rounded-2xl shadow-lg hover:bg-slate-700 hover:ring-2 hover:ring-brand-accent transition-all duration-300 ease-in-out transform hover:-translate-y-1"
          aria-label="Share Internet"
        >
          <SignalIcon className="w-16 h-16 text-brand-green mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white">Share Internet</h2>
          <p className="text-brand-text-secondary mt-1">Become a provider and share your connection.</p>
        </button>

        <button 
          onClick={() => onSelectRole(UserRole.RECEIVER)}
          className="bg-brand-secondary p-8 rounded-2xl shadow-lg hover:bg-slate-700 hover:ring-2 hover:ring-brand-accent transition-all duration-300 ease-in-out transform hover:-translate-y-1"
          aria-label="Receive Internet"
        >
          <div className="w-16 h-16 text-brand-yellow mx-auto mb-4 flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
             </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Receive Internet</h2>
          <p className="text-brand-text-secondary mt-1">Connect using credentials from a provider.</p>
        </button>
      </div>
    </div>
  );
};
