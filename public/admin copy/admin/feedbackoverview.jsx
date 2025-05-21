const Overview = ({ feedbackData }) => {
    // Calculate statistics
    const totalFeedback = feedbackData.length;
    const sentimentBreakdown = feedbackData.reduce(
      (acc, item) => {
        acc[item.sentiment] = (acc[item.sentiment] || 0) + 1;
        return acc;
      },
      {}
    );
    const tagBreakdown = feedbackData.reduce(
      (acc, item) => {
        acc[item.tag] = (acc[item.tag] || 0) + 1;
        return acc;
      },
      {}
    );
  
    return (
      <div className="px-5 w-full mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {/* Total Feedback Card */}
          <div className="p-6 bg-[#F5F5F7] dark:bg-[#202325] rounded-sm shadow-sm">
            <h3 className="text-lg font-medium text-[#1B2124] dark:text-[#ebf2f5]">
              Total Feedback
            </h3>
            <p className="text-2xl font-semibold text-[#3385F0] mt-2">
              {totalFeedback}
            </p>
          </div>
  
          {/* Sentiment Breakdown Card */}
          <div className="p-6 bg-[#F5F5F7] dark:bg-[#202325] rounded-sm shadow-sm">
            <h3 className="text-lg font-medium text-[#1B2124] dark:text-[#ebf2f5]">
              Sentiment Breakdown
            </h3>
            <ul className="mt-2 space-y-1">
              {Object.entries(sentimentBreakdown).map(([sentiment, count]) => (
                <li
                  key={sentiment}
                  className="text-[15px] text-[#1B2124] dark:text-[#ebf2f5]"
                >
                  {sentiment}: {count} ({((count / totalFeedback) * 100).toFixed(1)}%)
                </li>
              ))}
            </ul>
          </div>
  
          {/* Tag Breakdown Card */}
          <div className="p-6 bg-[#F5F5F7] dark:bg-[#202325] rounded-sm shadow-sm">
            <h3 className="text-lg font-medium text-[#1B2124] dark:text-[#ebf2f5]">
              Tag Breakdown
            </h3>
            <ul className="mt-2 space-y-1">
              {Object.entries(tagBreakdown).map(([tag, count]) => (
                <li
                  key={tag}
                  className="text-[15px] text-[#1B2124] dark:text-[#ebf2f5]"
                >
                  {tag}: {count} ({((count / totalFeedback) * 100).toFixed(1)}%)
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };
  
  export default Overview;