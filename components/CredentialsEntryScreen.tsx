
import React, { useState } from 'react';
import { ConnectionCredentials } from '../types';
import { Button } from './Button';

interface CredentialsEntryScreenProps {
  onVerify: (credentials: ConnectionCredentials) => void;
  error: string | null;
}

export const CredentialsEntryScreen: React.FC<CredentialsEntryScreenProps> = ({ onVerify, error }) => {
  const [userId, setUserId] = useState('');
  const [pass, setPass] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify({ userId, pass });
  };

  return (
    <div className="w-full max-w-sm mx-auto mt-16">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white">Enter Connection Code</h2>
        <p className="text-brand-text-secondary mt-2">Enter the credentials provided by the sharer.</p>
      </div>

      <div className="bg-brand-secondary p-8 rounded-2xl shadow-lg">
        {error && <p className="bg-red-900/50 text-brand-red text-sm text-center p-3 rounded-md mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-brand-text-secondary text-sm font-bold mb-2" htmlFor="userId">
              User ID
            </label>
            <input
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full bg-slate-800 text-white p-3 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-accent font-mono"
              placeholder="RN-XXXXX"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-brand-text-secondary text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full bg-slate-800 text-white p-3 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-accent font-mono"
              placeholder="********"
              required
            />
          </div>
          <Button type="submit">
            Connect Securely
          </Button>
        </form>
      </div>
    </div>
  );
};
