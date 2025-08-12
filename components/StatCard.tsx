
import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
  colorClass: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, label, value, colorClass }) => {
  return (
    <div className="bg-brand-secondary p-4 rounded-xl flex items-center space-x-4">
      <div className={`p-3 rounded-full ${colorClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-brand-text-secondary">{label}</p>
        <p className="text-xl font-bold text-brand-text">{value}</p>
      </div>
    </div>
  );
};