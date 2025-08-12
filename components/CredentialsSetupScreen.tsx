
import React, { useState } from 'react';
import { ConnectionCredentials } from '../types';
import { Button } from './Button';
import { LockIcon } from './icons';

interface CredentialsSetupScreenProps {
  onSetCredentials: (credentials: ConnectionCredentials) => void;
}

export const CredentialsSetupScreen: React.FC<CredentialsSetupScreenProps> = ({ onSetCredentials }) => {
  const [userId, setUserId] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId.length < 4 || pass.length < 4) {
      setError('User ID and Password must be at least 4 characters long.');
      return;
    }
    setError('');
    onSetCredentials({ userId, pass });
  };

  return (
    <div className="w-full max-w-sm mx-auto mt-16">
      <div className="text-center mb-8">
        <LockIcon className="w-12 h-12 text-brand-accent mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white">Create a Session</h2>
        <p className="text-brand-text-secondary mt-2">Set a temporary User ID and Password for the receiver to use.</p>
      </div>

      <div className="bg-brand-secondary p-8 rounded-2xl shadow-lg">
        {error && <p className="bg-red-900/50 text-brand-red text-sm text-center p-3 rounded-md mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-brand-text-secondary text-sm font-bold mb-2" htmlFor="userId">
              Create User ID
            </label>
            <input
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full bg-slate-800 text-white p-3 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              placeholder="e.g., my-session-123"
              required
              minLength={4}
            />
          </div>
          <div className="mb-6">
            <label className="block text-brand-text-secondary text-sm font-bold mb-2" htmlFor="password">
              Create Password
            </label>
            <input
              id="password"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full bg-slate-800 text-white p-3 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              placeholder="e.g., securepass"
              required
              minLength={4}
            />
          </div>
          <Button type="submit">
            Create Session & Proceed
          </Button>
        </form>
      </div>
    </div>
  );
};
