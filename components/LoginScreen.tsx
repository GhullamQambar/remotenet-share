
import React, { useState } from 'react';
import { UserRole } from '../types';
import { Button } from './Button';
import { GlobeIcon, SignalIcon, LockIcon, UsersIcon } from './icons';

interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    // Hardcoded credentials for demonstration
    if (username.toLowerCase() === 'provider' && password === 'pass') {
      onLogin(UserRole.PROVIDER);
    } else if (username.toLowerCase() === 'receiver' && password === 'pass') {
      onLogin(UserRole.RECEIVER);
    } else {
      setError('Invalid credentials. Use "provider" or "receiver" with password "pass".');
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col justify-center items-center p-4">
        <div className="text-center mb-8">
            <GlobeIcon className="w-20 h-20 text-brand-accent mx-auto" />
            <h1 className="text-4xl font-bold text-white mt-4">RemoteNet Share</h1>
            <p className="text-brand-text-secondary mt-2">Share your connection, anywhere.</p>
        </div>

        <div className="w-full max-w-sm bg-brand-secondary p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-center text-white mb-6">Login</h2>
            {error && <p className="bg-red-900/50 text-brand-red text-sm text-center p-3 rounded-md mb-4">{error}</p>}
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                <div className="mb-4">
                    <label className="block text-brand-text-secondary text-sm font-bold mb-2" htmlFor="username">
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-slate-800 text-white p-3 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                        placeholder="provider"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-brand-text-secondary text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-800 text-white p-3 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                        placeholder="pass"
                    />
                </div>
                <Button type="submit">
                    Login
                </Button>
            </form>
            <div className="mt-6 text-center text-xs text-brand-text-secondary">
                <p>Login as 'provider' or 'receiver'</p>
                <p>Password is 'pass' for both</p>
            </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center max-w-4xl">
            <div className="flex flex-col items-center">
                <SignalIcon className="w-10 h-10 text-brand-green mb-2"/>
                <h3 className="font-semibold text-white">Remote Sharing</h3>
                <p className="text-sm text-brand-text-secondary">Share your mobile data across the globe.</p>
            </div>
            <div className="flex flex-col items-center">
                <LockIcon className="w-10 h-10 text-brand-accent mb-2"/>
                <h3 className="font-semibold text-white">Secure Tunnel</h3>
                <p className="text-sm text-brand-text-secondary">All traffic is encrypted end-to-end.</p>
            </div>
            <div className="flex flex-col items-center">
                <UsersIcon className="w-10 h-10 text-brand-yellow mb-2"/>
                <h3 className="font-semibold text-white">Full Control</h3>
                <p className="text-sm text-brand-text-secondary">Set data caps, duration, and access rules.</p>
            </div>
        </div>
    </div>
  );
};