const Summary = ({ feedbackData }) => {
    // Analyze feedback for common themes
    const totalFeedback = feedbackData.length;
    const negativeFeedback = feedbackData.filter(
      (item) => item.sentiment === 'Negative'
    );
    const positiveFeedback = feedbackData.filter(
      (item) => item.sentiment === 'Good'
    );
  
    // Simple keyword analysis for negative feedback
    const commonNegativeThemes = negativeFeedback.reduce((acc, item) => {
      const words = item.feedback.toLowerCase().split(/\s+/);
      words.forEach((word) => {
        if (word.length > 3) { // Ignore short words
          acc[word] = (acc[word] || 0) + 1;
        }
      });
      return acc;
    }, {});
    const topNegativeThemes = Object.entries(commonNegativeThemes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([word]) => word);
  
    // Simple keyword analysis for positive feedback
    const commonPositiveThemes = positiveFeedback.reduce((acc, item) => {
      const words = item.feedback.toLowerCase().split(/\s+/);
      words.forEach((word) => {
        if (word.length > 3) {
          acc[word] = (acc[word] || 0) + 1;
        }
      });
      return acc;
    }, {});
    const topPositiveThemes = Object.entries(commonPositiveThemes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([word]) => word);
  
    return (
      <div className="px-5 w-full mt-8">
        <h2 className="text-xl font-semibold text-[#1B2124] dark:text-[#ebf2f5]">
          Feedback Summary
        </h2>
        <div className="mt-4 p-6 bg-[#F5F5F7] dark:bg-[#202325] rounded-sm shadow-sm">
          <p className="text-[15px] text-[#1B2124] dark:text-[#ebf2f5]">
            Out of {totalFeedback} feedback entries, {negativeFeedback.length} were negative and {positiveFeedback.length} were positive.
          </p>
          {negativeFeedback.length > 0 && (
            <p className="mt-2 text-[15px] text-[#1B2124] dark:text-[#ebf2f5]">
              Common issues mentioned in negative feedback include: <span className="font-medium">{topNegativeThemes.join(', ')}</span>.
            </p>
          )}
          {positiveFeedback.length > 0 && (
            <p className="mt-2 text-[15px] text-[#1B2124] dark:text-[#ebf2f5]">
              Positive feedback often highlighted: <span className="font-medium">{topPositiveThemes.join(', ')}</span>.
            </p>
          )}
        </div>
      </div>
    );
  };
  
  export default Summary;