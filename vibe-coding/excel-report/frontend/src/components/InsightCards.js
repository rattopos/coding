import React from 'react';
import './InsightCards.css';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b'];

function InsightCards({ insights }) {
  const renderChart = (insight) => {
    switch (insight.type) {
      case 'max_value':
        if (insight.data.chart_data && insight.data.chart_data.length > 0) {
          const chartData = insight.data.chart_data.map((item, idx) => ({
            name: `항목 ${idx + 1}`,
            value: item[insight.data.column] || 0
          }));
          
          return (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#667eea" />
              </BarChart>
            </ResponsiveContainer>
          );
        }
        break;

      case 'statistics':
        if (insight.data.means) {
          const chartData = Object.keys(insight.data.means).map(key => ({
            name: key,
            평균: insight.data.means[key],
            표준편차: insight.data.stds[key]
          }));
          
          return (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="평균" fill="#667eea" />
                <Bar dataKey="표준편차" fill="#764ba2" />
              </BarChart>
            </ResponsiveContainer>
          );
        }
        break;

      case 'trend':
        if (insight.data.chart_data) {
          const chartData = insight.data.chart_data.map((value, idx) => ({
            index: idx + 1,
            value: value
          }));
          
          return (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="index" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#667eea" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          );
        }
        break;

      case 'distribution':
        if (insight.data.distribution) {
          const chartData = Object.entries(insight.data.distribution).map(([key, value]) => ({
            name: key,
            value: value
          }));
          
          return (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          );
        }
        break;

      case 'histogram':
        if (insight.data.values) {
          const chartData = insight.data.values.map((value, idx) => ({
            index: idx + 1,
            value: value
          }));
          
          return (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="index" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#764ba2" />
              </BarChart>
            </ResponsiveContainer>
          );
        }
        break;

      default:
        return null;
    }
    return null;
  };

  return (
    <div className="insights-container">
      <h2 className="insights-title">📈 주요 인사이트 분석 결과</h2>
      <div className="insights-grid">
        {insights.map((insight, index) => (
          <div key={index} className="insight-card">
            <div className="insight-header">
              <span className="insight-number">{index + 1}</span>
              <h3>{insight.title}</h3>
            </div>
            <p className="insight-description">{insight.description}</p>
            {insight.type !== 'summary' && (
              <div className="chart-container">
                {renderChart(insight)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default InsightCards;

