import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { NutrientProfile } from '../types';

interface Props {
  data: NutrientProfile;
  language: 'en' | 'hi';
}

const NutritionChart: React.FC<Props> = ({ data, language }) => {
  const chartData = [
    { name: language === 'hi' ? 'Iron' : 'Iron', val: data.iron, color: '#ef4444' }, // Red for blood/iron
    { name: language === 'hi' ? 'Zinc' : 'Zinc', val: data.zinc, color: '#f97316' }, // Orange
    { name: language === 'hi' ? 'Vit A' : 'Vit A', val: data.vitaminA, color: '#eab308' }, // Yellow
    { name: language === 'hi' ? 'Calc' : 'Calc', val: data.calcium, color: '#3b82f6' }, // Blue/White
    { name: language === 'hi' ? 'Prot' : 'Prot', val: data.protein, color: '#22c55e' }, // Green
  ];

  return (
    <div className="h-48 w-full bg-white rounded-xl shadow-sm p-2">
      <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">
        {language === 'hi' ? 'आज का पोषण (%)' : 'Today\'s Nutrition (%)'}
      </h3>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={chartData}>
          <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis hide domain={[0, 100]} />
          <Bar dataKey="val" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.val < 50 ? '#ef4444' : entry.val < 80 ? '#eab308' : '#22c55e'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NutritionChart;
