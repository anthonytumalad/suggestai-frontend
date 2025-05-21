import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
  } from 'recharts';
  import { useMemo } from 'react';
  
  const Analytics = ({ feedbackData }) => {
    // Sentiment Distribution Data
    const sentimentData = useMemo(() => {
      const counts = feedbackData.reduce(
        (acc, item) => {
          acc[item.sentiment] = (acc[item.sentiment] || 0) + 1;
          return acc;
        },
        { Good: 0, Negative: 0 }
      );
      return [
        { name: 'Good', value: counts.Good },
        { name: 'Negative', value: counts.Negative },
      ];
    }, [feedbackData]);
  
    // Tag Distribution Data
    const tagData = useMemo(() => {
      const counts = feedbackData.reduce((acc, item) => {
        acc[item.tag] = (acc[item.tag] || 0) + 1;
        return acc;
      }, {});
      return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [feedbackData]);
  
    // Feedback Volume by Date
    const volumeData = useMemo(() => {
      const counts = feedbackData.reduce((acc, item) => {
        acc[item.date] = (acc[item.date] || 0) + 1;
        return acc;
      }, {});
      return Object.entries(counts)
        .map(([date, value]) => ({ date, value }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [feedbackData]);
  
    // Action Breakdown Data
    const actionData = useMemo(() => {
      const counts = feedbackData.reduce((acc, item) => {
        acc[item.action] = (acc[item.action] || 0) + 1;
        return acc;
      }, {});
      return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [feedbackData]);
  
    const COLORS = ['#10B981', '#EF4444', '#3B82F6', '#64748B'];
  
    return (
      <div className="px-4 sm:px-6 lg:px-7 w-full mt-8 space-y-8">
        {/* Sentiment Distribution */}
        <div className="bg-white dark:bg-[#202325] border border-[#e5e7eb] dark:border-[#2f3235] rounded-sm p-4 sm:p-5">
          <h4 className="text-[#64748B] text-sm sm:text-[14px] font-medium uppercase tracking-wide mb-4">
            Sentiment Distribution
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                outerRadius="50%"
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={true}
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
  
        {/* Tag Distribution */}
        <div className="bg-white dark:bg-[#202325] border border-[#e5e7eb] dark:border-[#2f3235] rounded-sm p-4 sm:p-5">
          <h4 className="text-[#64748B] text-sm sm:text-[14px] font-medium uppercase tracking-wide mb-4">
            Tag Distribution
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={tagData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
              <YAxis stroke="#64748B" fontSize={12} />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
  
        {/* Feedback Volume Over Time */}
        <div className="bg-white dark:bg-[#202325] border border-[#e5e7eb] dark:border-[#2f3235] rounded-sm p-4 sm:p-5">
          <h4 className="text-[#64748B] text-sm sm:text-[14px] font-medium uppercase tracking-wide mb-4">
            Feedback Volume Over Time
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={volumeData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#64748B" fontSize={12} />
              <YAxis stroke="#64748B" fontSize={12} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3B82F6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
  
        {/* Action Breakdown */}
        <div className="bg-white dark:bg-[#202325] border border-[#e5e7eb] dark:border-[#2f3235] rounded-sm p-4 sm:p-5">
          <h4 className="text-[#64748B] text-sm sm:text-[14px] font-medium uppercase tracking-wide mb-4">
            Action Breakdown
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={actionData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
              <YAxis stroke="#64748B" fontSize={12} />
              <Tooltip />
              <Bar dataKey="value" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };
  
  export default Analytics;