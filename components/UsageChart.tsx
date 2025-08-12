
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DataPoint } from '../types';

interface UsageChartProps {
  data: DataPoint[];
}

export const UsageChart: React.FC<UsageChartProps> = ({ data }) => {
  return (
    <div className="bg-brand-secondary p-4 rounded-xl h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="time" stroke="#94A3B8" unit="m" />
          <YAxis stroke="#94A3B8" unit="MB" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155' }} 
            labelStyle={{ color: '#E2E8F0' }}
          />
          <Legend />
          <Line type="monotone" dataKey="usage" name="Data Usage" stroke="#38BDF8" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};