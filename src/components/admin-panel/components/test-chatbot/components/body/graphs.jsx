import React from 'react';
import { BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Graphs = ({ barChartData, pieChartData }) => {
  
  const transformedBarData = barChartData.labels.map((label, index) => ({
    name: label,
    value: barChartData.values[index]
  }));


  const transformedPieData = pieChartData.categories.map((category, index) => ({
    name: category,
    value: pieChartData.values[index]
  }));

  return (
    <div className="graphs-container">
      <div className="bar-chart-container">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={transformedBarData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="pie-chart-container">
        <ResponsiveContainer width="100%" height={355}>
          <PieChart margin={{ top: 20, right: 20, bottom: 80, left: 20 }}>
            <Pie
              data={transformedPieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {transformedPieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend
              layout="horizontal" 
              align="center"     
              verticalAlign="bottom" 
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Graphs;