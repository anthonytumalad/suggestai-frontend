import { useState } from 'react';
import {
  IconPercentage,
  IconTrendingDown,
  IconTrendingUp,
  IconClipboardList,
  IconReportAnalytics,
  IconRefresh,
  IconSearch,
} from '@tabler/icons-react';
import {
  // BarChart,
  // Bar,
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

// Skeleton Component
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}></div>
);

// Card Skeleton
const CardSkeleton = () => (
  <div className="bg-white dark:bg-[#202325] border border-[#e5e7eb] dark:border-[#2f3235] p-5 flex items-start justify-between">
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-5 w-16" />
      <div className="flex gap-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
    <Skeleton className="h-10 w-10 rounded-full" />
  </div>
);

// Chart Skeleton
const ChartSkeleton = () => (
  <div className="bg-white dark:bg-[#202325] border border-[#e5e7eb] dark:border-[#2f3235] p-5">
    <div className="flex justify-between items-center mb-4">
      <Skeleton className="h-4 w-40" />
      {/* <Skeleton className="h-6 w-6 rounded-full" /> */}
    </div>
    <Skeleton className="h-74 w-full" />
  </div>
);

const Card = ({ title, value, orders, change, icon, sentimentBreakdown }) => (
  <div className="bg-white dark:bg-[#202325] border border-[#e5e7eb] dark:border-[#2f3235] p-5 flex items-start justify-between rounded-sm">
    <div className="flex flex-col">
      <h4 className="text-[#64748B] dark:text-[#A0AEC0] text-[14px] font-medium uppercase tracking-wider">
        {title}
      </h4>
      <div className="flex items-center gap-2">
        <span className="text-[#1B2124] dark:text-[#EBF2F5] text-xl font-semibold">
          {value}
        </span>
        {title === 'Sentiment' && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-[#D1FAE5] text-[#10B981]">
            <IconTrendingUp size={14} stroke={1.5} />
            Positive
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center">
        {orders && (
          <span className="text-[#64748B] dark:text-[#A0AEC0] text-xs">{orders}</span>
        )}
        {change !== 0 && title !== 'Sentiment' && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              change > 0 ? 'bg-[#D1FAE5] text-[#10B981]' : 'bg-[#FEE2E2] text-[#EF4444]'
            }`}
          >
            {change > 0 ? (
              <IconTrendingUp size={14} stroke={1.5} />
            ) : (
              <IconTrendingDown size={14} stroke={1.5} />
            )}
            {Math.abs(change)}%
          </div>
        )}
        {sentimentBreakdown && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-[#E5E7EB] text-[#64748B]">
              {sentimentBreakdown.neutral}% Neutral
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-[#FEE2E2] text-[#EF4444]">
              {sentimentBreakdown.negative}% Negative
            </div>
          </div>
        )}
      </div>
    </div>
    <div className="bg-[#F5F5F7] dark:bg-[#2F3235] rounded-full p-2">{icon}</div>
  </div>
);

const ChartContainer = ({ title, children, onRefresh, isLoading }) => (
  <div className="bg-white dark:bg-[#202325] border border-[#e5e7eb] dark:border-[#2f3235] rounded-sm p-5">
    <h4 className="text-[#64748B] text-[14px] font-medium uppercase tracking-wide mb-4">
      {title}
    </h4>
      {children}
  </div>
);

const Dashboard = () => {
  // const [chartData, setChartData] = useState([
  //   { month: 'Jan', ProjectedFeedback: 20, ActualFeedback: 15 },
  //   { month: 'Feb', ProjectedFeedback: 25, ActualFeedback: 10 },
  //   { month: 'Mar', ProjectedFeedback: 18, ActualFeedback: 12 },
  //   { month: 'Apr', ProjectedFeedback: 22, ActualFeedback: 14 },
  //   { month: 'May', ProjectedFeedback: 30, ActualFeedback: 20 },
  //   { month: 'Jun', ProjectedFeedback: 15, ActualFeedback: 8 },
  //   { month: 'Jul', ProjectedFeedback: 12, ActualFeedback: 5 },
  //   { month: 'Aug', ProjectedFeedback: 28, ActualFeedback: 18 },
  //   { month: 'Sep', ProjectedFeedback: 10, ActualFeedback: 6 },
  //   { month: 'Oct', ProjectedFeedback: 16, ActualFeedback: 9 },
  //   { month: 'Nov', ProjectedFeedback: 8, ActualFeedback: 4 },
  //   { month: 'Dec', ProjectedFeedback: 20, ActualFeedback: 12 },
  // ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);


  const pieData = [
    { name: 'Wifi Issues', value: 60 },
    { name: 'Library Resources', value: 20 },
    { name: 'Faculty Praise', value: 10 },
    { name: 'Class Schedules', value: 10 },
  ];

  const COLORS = ['#10B981', '#64748B', '#EF4444', '#3B82F6'];
  const lineData = [
    { sentiment: 'Positive', percentage: 50 },
    { sentiment: 'Neutral', percentage: 30 },
    { sentiment: 'Negative', percentage: 20 },
  ];

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 20;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#1B2124"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs"
      >
        {`${pieData[index].name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      // setChartData((prevData) =>
      //   prevData.map((item) => ({
      //     ...item,
      //     ActualFeedback: Math.floor(Math.random() * 30),
      //   }))
      // );
      setIsLoading(false);
    }, 800);
  };

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen dark:bg-[#1e2022]">
      <div className="flex-1">
        {/* Header with Breadcrumbs */}
        <header className="px-3 sm:px-4 md:px-5 py-2 sm:py-3">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[15px] text-[#64748B]">Home</span>
              <span className="text-[#64748B] text-[15px]">&gt;</span>
              <span className="font-medium text-[15px] text-[#1B2124]">Dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex relative">
                <input
                  type="search"
                  placeholder="Search..."
                  className="w-64 pl-10 pr-1 py-[7px] text-[15px] border border-[#e5e7eb] dark:border-[#2f3235] bg-white dark:bg-[#202325] text-[#1B2124] dark:text-[#EBF2F5] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] rounded-sm"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none rounded-sm">
                  <IconSearch size={17} stroke={1.5} className="text-[#1B2124]" />
                </div>
              </div>
              <button
                className={`p-2.5 border rounded-sm cursor-pointer sm:hidden ${
                  isSearchOpen
                    ? 'bg-[#F5F5F7] text-[#3385F0] dark:bg-[#1e2022] border-[#3385F0]'
                    : 'hover:bg-[#F5F5F7] dark:bg-[#202325] dark:text-[#ebf2f5] dark:border-[#2f3235] dark:hover:bg-[#1e2022] border-[#e5e7eb] text-[#1B2124]'
                }`}
                onClick={toggleSearch}
              >
                <IconSearch size={17} stroke={1.5} 
                  className={`transition-transform duration-200 ${
                    isSearchOpen && 'text-[#3B82F6]'
                  }`}
                />
              </button>
              <button
                onClick={handleRefresh}
                className="group p-2.5 bg-[#3B82F6] cursor-pointer disabled:opacity-50 rounded-sm transition-colors duration-300"
                disabled={isLoading}
              >
                <IconRefresh
                  size={17}
                  stroke={1.5}
                  className={` text-white ${
                    isLoading ? 'animate-spin' : ''
                  }`}
                />
              </button>
            </div>
          </nav>
          {isSearchOpen && (
            <div className="sm:hidden py-3">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search..."
                  className="w-full pl-10 pr-1 py-[7px] text-[15px] border border-[#e5e7eb] dark:border-[#2f3235] bg-white dark:bg-[#202325] text-[#1B2124] dark:text-[#EBF2F5] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] rounded-sm"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <IconSearch size={17} stroke={1.5} className="text-[#1B2124]" />
                </div>
              </div>
            </div>
          )}
        </header>

        <div className='px-3 sm:px-4 md:px-5'>
          <span className='text-[18px] text-[#1B2124] font-semibold tracking-normal'>Overview</span>
        </div>

        {/* Main Content */}
        <main className="p-3 sm:p-4 md:p-5">
          <div className="w-full flex flex-col gap-4">
            {/* Row 1: Cards (3 columns) */}
            <div className="w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3">
                {isLoading
                  ? Array(4)
                      .fill(0)
                      .map((_, index) => <CardSkeleton key={index} />)
                  : [
                      {
                        title: 'Total Feedback',
                        value: '15',
                        change: -4.3,
                        icon: <IconClipboardList size={24} stroke={1} color="#1B2124" />,
                      },
                      {
                        title: 'Sentiment',
                        value: '60%',
                        icon: <IconReportAnalytics size={24} stroke={1} color="#1B2124" />,
                        sentimentBreakdown: { neutral: 30, negative: 10 },
                      },
                      {
                        title: 'Recent Feedback',
                        value: '12 Today',
                        orders: '6k orders',
                        change: 0,
                        icon: <IconPercentage size={24} stroke={1} color="#1B2124" />,
                      },
                      {
                        title: 'Recent Feedback',
                        value: '12 Today',
                        orders: '6k orders',
                        change: 0,
                        icon: <IconPercentage size={24} stroke={1} color="#1B2124" />,
                      },
                    ].map((card, index) => <Card key={index} {...card} />)}
              </div>
            </div>

            {/* Row 2: Bar Chart (1 column, full width) */}
            {/* <div className="w-full">
              {isLoading ? (
                <ChartSkeleton />
              ) : (
                <ChartContainer
                  title="Projected vs Actual Feedback Submissions"
                  onRefresh={handleRefresh}
                  isLoading={isLoading}
                >
                  <ResponsiveContainer width="100%" height={274}>
                    <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="month" stroke="#64748B" />
                      <YAxis stroke="#64748B" />
                      <Tooltip />
                      <Bar dataKey="ProjectedFeedback" fill="#D1D5DB" />
                      <Bar dataKey="ActualFeedback" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </div> */}

            {/* Row 3: Pie Chart and Line Chart (2 columns) */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-3">
              {/* Pie Chart */}
              <div>
                {isLoading ? (
                  <ChartSkeleton />
                ) : (
                  <ChartContainer title="Most Frequent Topics">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label={renderCustomLabel}
                          labelLine={true}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </div>

              {/* Line Chart */}
              <div>
                {isLoading ? (
                  <ChartSkeleton />
                ) : (
                  <ChartContainer title="Sentiment Trends">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={lineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="sentiment" stroke="#64748B" />
                        <YAxis stroke="#64748B" />
                        <Tooltip />
                        <Line type="monotone" dataKey="percentage" stroke="#3B82F6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;