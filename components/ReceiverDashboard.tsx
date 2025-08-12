
import React, { useState, useEffect } from 'react';
import { ConnectionState, ConnectionStatus } from '../types';
import { Button } from './Button';
import { StatCard } from './StatCard';
import { analyzeSpeed } from '../services/geminiService';
import { LockIcon, SignalIcon, SpeedometerIcon, DataIcon, TimerIcon } from './icons';

interface ReceiverDashboardProps {
  connectionState: ConnectionState;
  usageControl: { dataCap: number; duration: number };
  onDisconnect: () => void;
}

const ConnectionIndicator: React.FC<{ status: ConnectionStatus }> = ({ status }) => {
  const statusConfig = {
    [ConnectionStatus.CONNECTED]: {
      text: 'Connected',
      color: 'text-brand-green',
      bgColor: 'bg-brand-green/20',
      pulseColor: 'bg-brand-green',
    },
    [ConnectionStatus.CONNECTING]: {
      text: 'Connecting',
      color: 'text-brand-yellow',
      bgColor: 'bg-brand-yellow/20',
      pulseColor: 'bg-brand-yellow',
    },
    [ConnectionStatus.DISCONNECTED]: {
      text: 'Disconnected',
      color: 'text-brand-red',
      bgColor: 'bg-brand-red/20',
      pulseColor: 'bg-brand-red',
    },
  };

  const { text, color, bgColor, pulseColor } = statusConfig[status];

  return (
    <div className={`flex items-center justify-center space-x-3 p-3 rounded-full ${bgColor}`}>
      <span className="relative flex h-3 w-3">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${pulseColor} opacity-75`}></span>
        <span className={`relative inline-flex rounded-full h-3 w-3 ${pulseColor}`}></span>
      </span>
      <span className={`font-bold text-lg ${color}`}>{text}</span>
    </div>
  );
};

export const ReceiverDashboard: React.FC<ReceiverDashboardProps> = ({ connectionState, usageControl, onDisconnect }) => {
  const [speed, setSpeed] = useState({ download: 0, upload: 0 });
  const [isTesting, setIsTesting] = useState(false);
  const [speedAnalysis, setSpeedAnalysis] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (connectionState.status === ConnectionStatus.CONNECTED) {
      interval = setInterval(() => {
        setSpeed({
          download: Math.random() * 45 + 5, // Simulate 5-50 Mbps
          upload: Math.random() * 18 + 2,   // Simulate 2-20 Mbps
        });
      }, 3000);
    } else {
      setSpeed({ download: 0, upload: 0 });
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [connectionState.status]);

  const handleSpeedTest = async () => {
    setIsTesting(true);
    setSpeedAnalysis('');
    const finalDownload = Math.random() * 75 + 15; // 15-90 Mbps
    const finalUpload = Math.random() * 25 + 5; // 5-30 Mbps
    
    // Simulate test duration
    await new Promise(res => setTimeout(res, 2500));
    
    setSpeed({ download: finalDownload, upload: finalUpload });
    const analysis = await analyzeSpeed(finalDownload, finalUpload);
    setSpeedAnalysis(analysis);
    setIsTesting(false);
  };

  const isConnected = connectionState.status === ConnectionStatus.CONNECTED;

  return (
    <div className="p-4 space-y-6">
      <div className="bg-brand-secondary p-6 rounded-2xl text-center">
        <ConnectionIndicator status={connectionState.status} />
        <div className="flex items-center justify-center space-x-2 mt-4 text-brand-text-secondary">
          <LockIcon className="w-4 h-4 text-brand-green"/>
          <span>Secure Encrypted Tunnel</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <StatCard icon={<SignalIcon className="w-6 h-6"/>} label="Download" value={`${speed.download.toFixed(1)} Mbps`} colorClass="bg-blue-500/20 text-blue-400" />
        <StatCard icon={<SignalIcon className="w-6 h-6 -scale-y-100"/>} label="Upload" value={`${speed.upload.toFixed(1)} Mbps`} colorClass="bg-purple-500/20 text-purple-400" />
        <StatCard icon={<DataIcon className="w-6 h-6"/>} label="Data Used" value={`${connectionState.dataUsed.toFixed(0)} MB`} colorClass="bg-green-500/20 text-green-400" />
        <StatCard icon={<TimerIcon className="w-6 h-6"/>} label="Time Used" value={`${connectionState.timeElapsed} min`} colorClass="bg-yellow-500/20 text-yellow-400" />
      </div>

      <div className="bg-brand-secondary p-6 rounded-2xl">
        <h3 className="text-lg font-semibold mb-4 flex items-center"><SpeedometerIcon className="w-5 h-5 mr-2"/>Speed Test</h3>
        <Button onClick={handleSpeedTest} disabled={!isConnected || isTesting} variant="secondary">
          {isTesting ? 'Testing...' : 'Run Speed Test'}
        </Button>
        {speedAnalysis && (
          <div className="mt-4 text-center bg-slate-800 p-3 rounded-lg">
            <p className="text-brand-text">{speedAnalysis}</p>
          </div>
        )}
      </div>

      <div className="bg-brand-secondary p-4 rounded-xl">
        <h3 className="text-lg font-semibold mb-2">Session Limits</h3>
        <p className="text-brand-text-secondary">Data Cap: <span className="font-bold text-brand-text">{usageControl.dataCap} GB</span></p>
        <p className="text-brand-text-secondary">Max Duration: <span className="font-bold text-brand-text">{usageControl.duration} hours</span></p>
      </div>

      <Button onClick={onDisconnect} disabled={!isConnected} variant="danger">
        Disconnect Session
      </Button>
    </div>
  );
};