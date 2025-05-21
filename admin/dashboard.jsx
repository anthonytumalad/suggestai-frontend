import { useState } from 'react';
import {
  IconRefresh,
  IconSearch,
  IconMessageCircle2,
  IconAlertCircle,
  IconThumbUp,
  IconThumbDown,
} from '@tabler/icons-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  Line,
  ComposedChart,
  Area,
} from 'recharts';

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
    </div>
    <Skeleton className="h-74 w-full" />
  </div>
);

const Card = ({ title, value, icon, iconBgColor }) => (
  <div 
    className="border border-[#e5e7eb] bg-white dark:border-[#2f3235] p-3.5 flex items-start justify-between rounded-sm"
  >
    <div className="flex flex-col space-y-2"> 
      <span className="text-[#1B2124] dark:text-[#EBF2F5] text-[20px] font-semibold tracking-normal">
        {value}
      </span>
      <h4 className="text-[#1B2124] dark:text-[#A0AEC0] text-[15px] tracking-wide">
        {title}
      </h4>
    </div>
    <div className={`p-1.5 rounded-sm ${ iconBgColor }`}>
      {icon}
    </div>
  </div>
);

const ChartContainer = ({ title, children, onRefresh, isLoading, filter, setFilter }) => (
  <div 
    className="bg-white dark:bg-[#202325] border border-[#e5e7eb] dark:border-[#2f3235] rounded-sm p-3.5"
  >
    <div className="flex justify-between items-center mb-4">
      <h4 className="text-[#1B2124] text-[15px] tracking-wide">
        {title}
      </h4>
      <div className="flex items-center gap-2">
        {filter && (
          <div className="flex gap-2">
            <button
              className={`px-3 py-1 text-sm rounded-sm ${
                filter === 'today'
                  ? 'bg-[#3B82F6] text-white'
                  : 'bg-[#F5F5F7] dark:bg-[#2F3235] text-[#1B2124] dark:text-[#EBF2F5]'
              }`}
              onClick={() => setFilter('today')}
            >
              Today
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-sm ${
                filter === 'weekly'
                  ? 'bg-[#3B82F6] text-white'
                  : 'bg-[#F5F5F7] dark:bg-[#2F3235] text-[#1B2124] dark:text-[#EBF2F5]'
              }`}
              onClick={() => setFilter('weekly')}
            >
              Weekly
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-sm ${
                filter === 'monthly'
                  ? 'bg-[#3B82F6] text-white'
                  : 'bg-[#F5F5F7] dark:bg-[#2F3235] text-[#1B2124] dark:text-[#EBF2F5]'
              }`}
              onClick={() => setFilter('monthly')}
            >
              Monthly
            </button>
          </div>
        )}
        {/* {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-2 bg-[#3B82F6] rounded-sm"
            disabled={isLoading}
          >
            <IconRefresh
              size={17}
              stroke={1.5}
              className={`text-white ${isLoading ? 'animate-spin' : ''}`}
            />
          </button>
        )} */}
      </div>
    </div>
    {children}
  </div>
);

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [filter, setFilter] = useState('monthly');
  const [feedbackTimeRange, setFeedbackTimeRange] = useState("monthly")


  // Topic data for bar chart
  const topicData = [
    { topic: "Wifi Issues", count: 30, average: 4.2 },
    { topic: "Library Resources", count: 27, average: 3.8 },
    { topic: "Faculty Praise", count: 15, average: 4.5 },
    { topic: "Class Schedules", count: 13, average: 3.2 },
    { topic: "Lorem", count: 15, average: 2.9 },
    { topic: "Comform Room", count: 15, average: 2.9 },
    { topic: "Comform Room", count: 15, average: 2.9 },
  ]

  // Bar chart data for feedback frequency (Jan to Dec)
  const monthlyData = [
    { month: 'Jan', feedback: 20 },
    { month: 'Feb', feedback: 25 },
    { month: 'Mar', feedback: 18 },
    { month: 'Apr', feedback: 22 },
    { month: 'May', feedback: 30 },
    { month: 'Jun', feedback: 15 },
    { month: 'Jul', feedback: 12 },
    { month: 'Aug', feedback: 28 },
    { month: 'Sep', feedback: 10 },
    { month: 'Oct', feedback: 16 },
    { month: 'Nov', feedback: 8 },
    { month: 'Dec', feedback: 20 },
  ];

  const weeklyData = [
    { month: 'Jan', feedback: 5 },
    { month: 'Feb', feedback: 6 },
    { month: 'Mar', feedback: 4 },
    { month: 'Apr', feedback: 5 },
    { month: 'May', feedback: 7 },
    { month: 'Jun', feedback: 3 },
    { month: 'Jul', feedback: 2 },
    { month: 'Aug', feedback: 6 },
    { month: 'Sep', feedback: 2 },
    { month: 'Oct', feedback: 4 },
    { month: 'Nov', feedback: 1 },
    { month: 'Dec', feedback: 5 },
  ];

  const todayData = [
    { month: 'Jan', feedback: 1 },
    { month: 'Feb', feedback: 2 },
    { month: 'Mar', feedback: 1 },
    { month: 'Apr', feedback: 1 },
    { month: 'May', feedback: 3 },
    { month: 'Jun', feedback: 0 },
    { month: 'Jul', feedback: 0 },
    { month: 'Aug', feedback: 2 },
    { month: 'Sep', feedback: 0 },
    { month: 'Oct', feedback: 1 },
    { month: 'Nov', feedback: 0 },
    { month: 'Dec', feedback: 1 },
  ];


  const feedbackTrendData = [
    { month: "Jan", total: 45, positive: 25, negative: 10, neutral: 10 },
    { month: "Feb", total: 52, positive: 30, negative: 12, neutral: 10 },
    { month: "Mar", total: 48, positive: 28, negative: 8, neutral: 12 },
    { month: "Apr", total: 60, positive: 35, negative: 15, neutral: 10 },
    { month: "May", total: 75, positive: 45, negative: 18, neutral: 12 },
    { month: "Jun", total: 58, positive: 32, negative: 16, neutral: 10 },
    { month: "Jul", total: 63, positive: 38, negative: 12, neutral: 13 },
    { month: "Aug", total: 70, positive: 42, negative: 15, neutral: 13 },
    { month: "Sep", total: 55, positive: 30, negative: 10, neutral: 15 },
    { month: "Oct", total: 80, positive: 48, negative: 20, neutral: 12 },
    { month: "Nov", total: 65, positive: 40, negative: 15, neutral: 10 },
    { month: "Dec", total: 90, positive: 55, negative: 20, neutral: 15 },
  ]

  // Select data based on filter
  const barData = filter === 'today' ? todayData : filter === 'weekly' ? weeklyData : monthlyData;

  // Donut chart data for most frequent topics
  const pieData = [
    { name: 'Wifi Issues', value: 30.9 },
    { name: 'Library Resources', value: 27.3 },
    { name: 'Faculty Praise', value: 14.5 },
    { name: 'Class Schedules', value: 12.7 },
    { name: 'Payment & Transaction Experience', value: 14.5 },
  ];

  // Sentiment data for progress circles
  const sentimentData = [
    { name: 'Positive', value: 50, color: '#10B981' },
    { name: 'Neutral', value: 30, color: '#64748B' },
    { name: 'Negative', value: 20, color: '#EF4444' },
  ];

  const COLORS = ['#10B981', '#64748B', '#EF4444', '#3B82F6'];

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
        {`${pieData[index].name} `}
      </text>
    );
  };

  const totalFeedback = feedbackTrendData.reduce((sum, item) => sum + item.total, 0)
  const positiveFeedback = feedbackTrendData.reduce((sum, item) => sum + item.positive, 0)
  const negativeFeedback = feedbackTrendData.reduce((sum, item) => sum + item.negative, 0)
  const positivePercentage = Math.round((positiveFeedback / totalFeedback) * 100)
  const negativePercentage = Math.round((negativeFeedback / totalFeedback) * 100)

  // Calculate month-over-month growth
  const lastMonthTotal = feedbackTrendData[feedbackTrendData.length - 2].total
  const currentMonthTotal = feedbackTrendData[feedbackTrendData.length - 1].total
  const growthPercentage = Math.round(((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100)

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
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
        <header className="p-5">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[15px] text-[#64748B]">All Feedback</span>
              <span className="text-[#64748B] text-[15px]">&gt;</span>
              <span className="font-medium text-[15px] text-[#1B2124]">Overview</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex relative">
                <input
                  type="search"
                  placeholder="Search..."
                  className="w-64 pl-10 pr-1 py-[7px] text-[14px] border border-[#e5e7eb] dark:border-[#2f3235] bg-white dark:bg-[#202325] text-[#1B2124] dark:text-[#EBF2F5] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] rounded-sm"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none rounded-sm">
                  <IconSearch size={15} stroke={2} className="text-[#1B2124]" />
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
                <IconSearch
                  size={15}
                  stroke={2}
                  className={`transition-transform duration-200 ${isSearchOpen && 'text-[#3B82F6]'}`}
                />
              </button>
              <button
                onClick={handleRefresh}
                className="group p-2.5 bg-[#3B82F6] cursor-pointer disabled:opacity-50 rounded-sm transition-colors duration-300"
                disabled={isLoading}
              >
                <IconRefresh
                  size={15}
                  stroke={2}
                  className={`text-white ${isLoading ? 'animate-spin' : ''}`}
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

       

        {/* Main Content */}
        <main className="p-3 sm:p-4 md:p-5">
          <div className="w-full flex flex-col space-y-5">
            {/* First Row: Cards */}
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
                        // percentage: -4.3,
                        icon: <IconMessageCircle2 size={20} stroke={2} color="#fff" />,
                        // bgColor: 'bg-[#3385F0]/50 dark:bg-[#2A2E3F]',
                        // label: 'Last 30 days: -4.3% from previous',
                        iconBgColor: 'bg-[#3385F0]',
                      },
                      {
                        title: 'Positive Feedback',
                        value: '59%',
                        // percentage: 14.3,
                        // label: 'Feedback received today',
                        icon: <IconThumbUp size={20} stroke={2} color='#fff' />,
                        iconBgColor: 'bg-[#20c997]',
                      },
                      {
                        title: 'Negative Feedback',
                        value: '22%',
                        // label: 'Average sentiment score per feedback',
                        icon: <IconThumbDown size={20} stroke={2} color='#fff' />,
                        iconBgColor: 'bg-[#FF6363]',
                      },
                      {
                        title: 'Avg. Response Time',
                        value: '4.2 hrs',
                        // label: 'Most reported issue',
                        icon: <IconAlertCircle size={20} color="#fff" />,
                        iconBgColor: 'bg-yellow-500',
                      },
                    ].map((card, index) => <Card key={index} {...card} />)}
              </div>
            </div>

            <div className="w-full">
             

              <div className="grid grid-cols-1 gap-3">
                {/* Topic Bar Graph */}
                <div className=''>
                  {isLoading ? (
                    <ChartSkeleton />
                  ) : (
                    <ChartContainer title="Top Topic by Feedback Count" onRefresh={handleRefresh} isLoading={isLoading}>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          data={topicData}
                          margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                          layout="vertical"
                        >
                          <CartesianGrid strokeDasharray="2 2" stroke="#E5E7EB" strokeWidth={0.5} />
                          <XAxis type="number" stroke="#64748B" fontSize={14} tickMargin={5} />
                          <YAxis dataKey="topic" type="category" stroke="#64748B" width={130} fontSize={14} />
                          <Tooltip contentStyle={{ fontSize: 15 }} />
                          <Legend wrapperStyle={{ fontSize: 15 }} />
                          <Bar dataKey="count" name="Feedback Count" fill="#3B82F6" barSize={20} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  )}
                </div>

                
              </div>
            </div>

            {/* Second Row: Sentiment Breakdown + Donut Chart */}
            <div className="w-full">
              {/* Sentiment Breakdown */}
            
              <div className='grid grid-cols-1 gap-3'>
              <div>
                  {isLoading ? (
                    <ChartSkeleton />
                  ) : (
                    <ChartContainer
                      title="Feedback Trends with Sentiment Analysis"
                      onRefresh={handleRefresh}
                      isLoading={isLoading}
                      filter={feedbackTimeRange}
                      setFilter={setFeedbackTimeRange}
                    >
                      <div className="flex flex-wrap gap-3 mb-4 justify-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-sm bg-[#3B82F6]" />
                          <span className="text-[15px] text-[#1B2124] dark:text-[#EBF2F5]">Total Feedback</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-sm bg-[#10B981]" />
                          <span className="text-[15px] text-[#1B2124] dark:text-[#EBF2F5]">Positive</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-sm bg-[#EF4444]" />
                          <span className="text-[15px] text-[#1B2124] dark:text-[#EBF2F5]">Negative</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-sm bg-[#64748B]" />
                          <span className="text-[15px] text-[#1B2124] dark:text-[#EBF2F5]">Neutral</span>
                        </div>
                      </div>
                      <ResponsiveContainer width="100%" height={300}>
                        <ComposedChart data={feedbackTrendData}>
                          <CartesianGrid strokeDasharray="2 2" stroke="#E5E7EB" strokeWidth={0.5} />
                          <XAxis dataKey="month" stroke="#64748B" fontSize={15} />
                          <YAxis stroke="#64748B" fontSize={15} />
                          <Tooltip contentStyle={{ fontSize: 15 }} />
                          <Area
                            type="monotone"
                            dataKey="total"
                            fill="#3B82F6"
                            stroke="#3B82F6"
                            fillOpacity={0.1}
                            name="Total Feedback"
                          />
                          <Bar dataKey="positive" stackId="sentiment" fill="#10B981" name="Positive" />
                          <Bar dataKey="negative" stackId="sentiment" fill="#EF4444" name="Negative" />
                          <Bar dataKey="neutral" stackId="sentiment" fill="#64748B" name="Neutral" />
                          <Line
                            type="monotone"
                            dataKey="total"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            name="Total Feedback"
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  )}
                </div>
                <div>
                {isLoading ? (
                  <ChartSkeleton />
                ) : (
                  <ChartContainer title="Distribution of Feedback Across Topics">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          // innerRadius={80}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={renderCustomLabel}
                          labelLine={false}
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
              </div>

              {/* Donut Chart: Most Frequent Topics */}
            
            </div>

            {/* Third Row: Feedback Frequency */}
            <div className="w-full">
              {isLoading ? (
                <ChartSkeleton />
              ) : (
                <ChartContainer
                  title="Feedback Frequency (Jan - Dec)"
                  onRefresh={handleRefresh}
                  isLoading={isLoading}
                  filter={filter}
                  setFilter={setFilter}
                >
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart
                      data={barData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="2 2" stroke="#E5E7EB" />
                      <XAxis dataKey="month" stroke="#64748B" />
                      <YAxis stroke="#64748B" />
                      <Tooltip />
                      <Bar dataKey="feedback" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;