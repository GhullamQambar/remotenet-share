
import React from 'react';
import { UsageControl, ConnectionState, ConnectionStatus, DataPoint } from '../types';
import { Button } from './Button';
import { StatCard } from './StatCard';
import { UsageChart } from './UsageChart';
import { DataIcon, TimerIcon, UsersIcon, GlobeIcon } from './icons';

interface ProviderDashboardProps {
  usageControl: UsageControl;
  setUsageControl: (controls: UsageControl) => void;
  connectionState: ConnectionState;
  startSharing: () => void;
  stopSharing: () => void;
  dataHistory: DataPoint[];
}

export const ProviderDashboard: React.FC<ProviderDashboardProps> = ({
  usageControl,
  setUsageControl,
  connectionState,
  startSharing,
  stopSharing,
  dataHistory
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUsageControl({
      ...usageControl,
      [name]: name === 'allowedWebsites' ? value : Number(value),
    });
  };
  
  const dataUsedPercentage = usageControl.dataCap > 0 ? ((connectionState.dataUsed / (usageControl.dataCap * 1024)) * 100) : 0;
  const timeUsedPercentage = usageControl.duration > 0 ? ((connectionState.timeElapsed / (usageControl.duration * 60)) * 100) : 0;

  const getStatusContent = () => {
    switch(connectionState.status) {
      case ConnectionStatus.CONNECTED:
        return { text: 'Sharing Active', subtext: 'Connection is live and secure', color: 'text-brand-green' };
      case ConnectionStatus.CONNECTING:
        return { text: 'Waiting for Receiver', subtext: 'Session is ready for a user to connect', color: 'text-brand-yellow' };
      default:
        return { text: 'Sharing Inactive', subtext: 'Configure and start a session', color: 'text-brand-red' };
    }
  };

  const statusContent = getStatusContent();
  const isSessionConfigurable = connectionState.status === ConnectionStatus.DISCONNECTED;
  const isSessionActive = connectionState.status === ConnectionStatus.CONNECTED;

  return (
    <div className="p-4 space-y-6">
      <div className="bg-brand-secondary p-6 rounded-2xl text-center">
        <h2 className="text-2xl font-bold">{statusContent.text}</h2>
        <p className={`mt-2 font-semibold ${statusContent.color}`}>
          {statusContent.subtext}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard icon={<UsersIcon className="w-6 h-6"/>} label="Active Users" value={isSessionActive ? '1' : '0'} colorClass="bg-green-500/20 text-green-400"/>
        <StatCard icon={<GlobeIcon className="w-6 h-6"/>} label="Session Status" value={connectionState.status} colorClass={isSessionActive ? "bg-brand-green/20 text-brand-green" : "bg-brand-yellow/20 text-brand-yellow"}/>
      </div>
      
      {isSessionActive && (
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1 text-sm text-brand-text-secondary">
              <span>Data Used: {connectionState.dataUsed.toFixed(0)} MB / {usageControl.dataCap * 1024} MB</span>
              <span>{dataUsedPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5">
              <div className="bg-brand-accent h-2.5 rounded-full" style={{ width: `${dataUsedPercentage}%` }}></div>
            </div>
          </div>
          <div>
             <div className="flex justify-between mb-1 text-sm text-brand-text-secondary">
              <span>Time Used: {connectionState.timeElapsed} min / {usageControl.duration * 60} min</span>
              <span>{timeUsedPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5">
              <div className="bg-brand-yellow h-2.5 rounded-full" style={{ width: `${timeUsedPercentage}%` }}></div>
            </div>
          </div>
          <UsageChart data={dataHistory} />
        </div>
      )}

      {isSessionConfigurable && (
        <div className="bg-brand-secondary p-6 rounded-2xl space-y-4">
            <h3 className="text-lg font-semibold">Usage Controls</h3>
            <div className="flex items-center space-x-3">
              <DataIcon className="w-5 h-5 text-brand-text-secondary"/>
              <label htmlFor="dataCap" className="w-24">Data Cap</label>
              <input type="number" id="dataCap" name="dataCap" value={usageControl.dataCap} onChange={handleInputChange} className="flex-1 bg-slate-800 p-2 rounded-md border border-slate-700" />
              <span className="text-brand-text-secondary">GB</span>
            </div>
            <div className="flex items-center space-x-3">
              <TimerIcon className="w-5 h-5 text-brand-text-secondary"/>
              <label htmlFor="duration" className="w-24">Duration</label>
              <input type="number" id="duration" name="duration" value={usageControl.duration} onChange={handleInputChange} className="flex-1 bg-slate-800 p-2 rounded-md border border-slate-700" />
              <span className="text-brand-text-secondary">hours</span>
            </div>
             <div className="flex items-start space-x-3">
              <GlobeIcon className="w-5 h-5 text-brand-text-secondary mt-2"/>
              <label htmlFor="allowedWebsites" className="w-24 mt-2">Allowed Sites</label>
              <textarea id="allowedWebsites" name="allowedWebsites" value={usageControl.allowedWebsites} onChange={handleInputChange} placeholder="e.g., google.com (one per line)" rows={2} className="flex-1 bg-slate-800 p-2 rounded-md border border-slate-700" />
            </div>
        </div>
      )}

      {connectionState.status === ConnectionStatus.DISCONNECTED && (
        <Button onClick={startSharing}>Start Sharing Session</Button>
      )}
      {connectionState.status === ConnectionStatus.CONNECTING && (
        <Button disabled variant="secondary">Waiting for Receiver...</Button>
      )}
      {connectionState.status === ConnectionStatus.CONNECTED && (
        <Button onClick={stopSharing} variant="danger">Stop Sharing</Button>
      )}
    </div>
  );
};
