import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { IconX, IconLoader2 } from "@tabler/icons-react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const AnalyzeModal = ({ isOpen, onClose, feedbackText }) => {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const [isVisible, setIsVisible] = useState(isOpen);
  const [isLoading, setIsLoading] = useState(true);
  const [topics, setTopics] = useState([]);
  const [sentiments, setSentiments] = useState({
    Positive: { count: 0, percentage: 0 },
    Negative: { count: 0, percentage: 0 },
    Neutral: { count: 0, percentage: 0 },
  });
  const [activeTab, setActiveTab] = useState("topics");

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      if (feedbackText.length > 0) {
        setIsLoading(true);
        setTimeout(() => {
          const { analyzedTopics, analyzedSentiments } = performMockTopicModeling(feedbackText);
          setTopics(analyzedTopics);
          setSentiments(analyzedSentiments);
          setIsLoading(false);
        }, 1000);
      } else {
        setIsLoading(false);
      }
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, feedbackText]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEscape);
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const performMockTopicModeling = (feedbackArray) => {
    const uniqueFeedback = [...new Set(feedbackArray)];

    const topics = [
      {
        id: 1,
        name: "Facilities Issues",
        keywords: ["cold", "temperature", "crowded", "noisy", "wifi", "slow", "gym", "dorms", "parking"],
        count: 0,
        percentage: 0,
        feedbackSamples: [],
      },
      {
        id: 2,
        name: "Food Services",
        keywords: ["cafeteria", "food", "vegetarian", "options", "meal", "dining"],
        count: 0,
        percentage: 0,
        feedbackSamples: [],
      },
      {
        id: 3,
        name: "Campus Services",
        keywords: ["library", "hours", "staff", "shuttle", "tracking", "events", "calendar"],
        count: 0,
        percentage: 0,
        feedbackSamples: [],
      },
      {
        id: 4,
        name: "Campus Environment",
        keywords: ["beautiful", "safe", "secure", "maintained", "clean", "campus"],
        count: 0,
        percentage: 0,
        feedbackSamples: [],
      },
      {
        id: 5,
        name: "Academic Experience",
        keywords: ["professors", "knowledgeable", "approachable", "classes", "course"],
        count: 0,
        percentage: 0,
        feedbackSamples: [],
      },
    ];

    const sentiments = {
      Positive: { count: 0, percentage: 0 },
      Negative: { count: 0, percentage: 0 },
      Neutral: { count: 0, percentage: 0 },
    };

    const positiveKeywords = ["great", "good", "beautiful", "helpful", "safe", "secure", "maintained", "knowledgeable", "approachable", "clean"];
    const negativeKeywords = ["slow", "bad", "unreliable", "noisy", "cold", "crowded", "not"];

    uniqueFeedback.forEach((feedback) => {
      const lowerFeedback = feedback.toLowerCase();

      // Sentiment Analysis
      let sentiment = "Neutral";
      const hasPositive = positiveKeywords.some((keyword) => lowerFeedback.includes(keyword));
      const hasNegative = negativeKeywords.some((keyword) => lowerFeedback.includes(keyword));

      if (hasPositive && !hasNegative) {
        sentiment = "Positive";
      } else if (hasNegative && !hasPositive) {
        sentiment = "Negative";
      }

      sentiments[sentiment].count++;

      // Topic Modeling
      topics.forEach((topic) => {
        if (topic.keywords.some((keyword) => lowerFeedback.includes(keyword))) {
          topic.count++;
          if (topic.feedbackSamples.length < 3) {
            topic.feedbackSamples.push({ text: feedback, sentiment });
          }
        }
      });
    });

    const totalFeedbackItems = uniqueFeedback.length;

    // Calculate topic percentages
    topics.forEach((topic) => {
      topic.percentage = totalFeedbackItems > 0 ? Math.round((topic.count / totalFeedbackItems) * 100) : 0;
    });

    // Calculate sentiment percentages
    Object.keys(sentiments).forEach((sentiment) => {
      sentiments[sentiment].percentage = totalFeedbackItems > 0
        ? Math.round((sentiments[sentiment].count / totalFeedbackItems) * 100)
        : 0;
    });

    return {
      analyzedTopics: topics.sort((a, b) => b.count - a.count),
      analyzedSentiments: sentiments,
    };
  };

  // Prepare data for Recharts
  const topicChartData = topics
    .filter((topic) => topic.percentage > 0)
    .map((topic) => ({
      name: topic.name,
      value: topic.percentage,
    }));

  const sentimentChartData = Object.entries(sentiments)
    .filter(([_, data]) => data.percentage > 0)
    .map(([name, data]) => ({
      name,
      value: data.percentage,
    }));

  const topicColors = ["#3385F0", "#22C55E", "#F59E0B", "#EF4444", "#8B5CF6"];
  const sentimentColors = ["#22C55E", "#EF4444", "#6B7280"];

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ease-out ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        ref={modalRef}
        className={`bg-white rounded-sm border border-[#e5e7eb] shadow-lg w-full max-w-3xl max-h-[80vh] flex flex-col mx-auto mt-5 relative transition-all duration-300 ease-out transform dark:bg-[#202325] dark:border-[#2f3235] ${
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between p-3 border-b border-[#e5e7eb] dark:border-[#2f3235]">
          <span
            id="modal-title"
            className="text-[15px] font-semibold text-[#1B2124] tracking-normal dark:text-[#ebf2f5]"
          >
            Feedback Topic Analysis
          </span>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="text-[#1B2124] p-1 cursor-pointer hover:bg-[#F5F5F7] rounded-sm dark:text-[#ebf2f5] dark:hover:bg-[#2f3235]"
            aria-label="Close modal"
          >
            <IconX size={20} />
          </button>
        </div>

        <div className="flex border-b border-[#e5e7eb] dark:border-[#2f3235]">
          <button
            onClick={() => setActiveTab("topics")}
            className={`flex-1 py-3 text-[14px] text-center transition-colors duration-200 ${
              activeTab === "topics"
                ? "text-[#3385F0] border-b-2 border-[#3385F0] font-medium"
                : "text-[#64748B] hover:text-[#3385F0] dark:hover:text-[#EBF2F5]"
            }`}
            aria-label="View Topics"
          >
            Topics
          </button>
          <button
            onClick={() => setActiveTab("visualization")}
            className={`flex-1 py-3 text-[14px] text-center transition-colors duration-200 ${
              activeTab === "visualization"
                ? "text-[#3385F0] border-b-2 border-[#3385F0] font-medium"
                : "text-[#64748B] hover:text-[#3385F0] dark:hover:text-[#EBF2F5]"
            }`}
            aria-label="View Visualization"
          >
            Visualization
          </button>
          <button
            onClick={() => setActiveTab("sentiment")}
            className={`flex-1 py-3 text-[14px] text-center transition-colors duration-200 ${
              activeTab === "sentiment"
                ? "text-[#3385F0] border-b-2 border-[#3385F0] font-medium"
                : "text-[#64748B] hover:text-[#3385F0] dark:hover:text-[#EBF2F5]"
            }`}
            aria-label="View Sentiment"
          >
            Sentiment
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <IconLoader2 size={36} className="animate-spin text-[#3385F0]" />
              <p className="mt-4 text-[#64748B] dark:text-[#A3ADB8]">Analyzing feedback data...</p>
            </div>
          ) : feedbackText.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-[14px] text-[#64748B] dark:text-[#A3ADB8]">
                No feedback selected. Please select at least one feedback item to analyze.
              </p>
            </div>
          ) : topics.every((topic) => topic.count === 0) &&
            sentiments.Positive.count === 0 &&
            sentiments.Negative.count === 0 &&
            sentiments.Neutral.count === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-[14px] text-[#64748B] dark:text-[#A3ADB8]">
                No topics or sentiments matched the selected feedback. Try selecting different feedback items.
              </p>
            </div>
          ) : (
            <>
              {activeTab === "topics" && (
                <div className="space-y-6">
                  <div className="text-[14px] text-[#64748B] dark:text-[#A3ADB8]">
                    {feedbackText.length} feedback items analyzed and categorized into {topics.length} main topics.
                  </div>

                  {topics
                    .filter((topic) => topic.count > 0)
                    .map((topic) => (
                      <div key={topic.id} className="border border-[#e5e7eb] dark:border-[#2f3235] rounded-md p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[15px] font-medium text-[#1B2124] dark:text-[#EBF2F5]">{topic.name}</span>
                          <div className="flex items-center">
                            <span className="text-[14px] font-medium text-[#1B2124] dark:text-[#EBF2F5]">
                              {topic.count}
                            </span>
                            <span className="ml-2 text-[14px] text-[#64748B] dark:text-[#A3ADB8]">
                              ({topic.percentage}%)
                            </span>
                          </div>
                        </div>

                        <div className="mb-5">
                          <div className="h-2 bg-[#F1F5F9] dark:bg-[#2f3235] rounded-full overflow-hidden">
                            <div className="h-full bg-[#3385F0]" style={{ width: `${topic.percentage}%` }}></div>
                          </div>
                        </div>

                        <div className="mb-5">
                          <div className="flex flex-wrap gap-2">
                            {topic.keywords.map((keyword, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 text-[12px] bg-[#F1F5F9] dark:bg-[#2f3235] text-[#64748B] dark:text-[#A3ADB8] rounded-md"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>

                        {topic.feedbackSamples.length > 0 && (
                          <div>
                            <h4 className="text-[14px] font-medium text-[#1B2124] dark:text-[#EBF2F5] mb-2">
                              Sample Feedback:
                            </h4>
                            <ul className="space-y-2">
                              {topic.feedbackSamples.map((sample, idx) => (
                                <li
                                  key={idx}
                                  className="text-[13px] text-[#64748B] dark:text-[#A3ADB8] p-2 bg-[#F9FAFB] dark:bg-[#1e2022] rounded-md"
                                >
                                  <span
                                    className={`font-medium ${
                                      sample.sentiment === "Positive"
                                        ? "text-green-600 dark:text-green-400"
                                        : sample.sentiment === "Negative"
                                        ? "text-red-600 dark:text-red-400"
                                        : "text-gray-600 dark:text-gray-400"
                                    }`}
                                  >
                                    {sample.sentiment}:
                                  </span>{" "}
                                  "{sample.text}"
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}

              {activeTab === "visualization" && (
                <div>
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-[16px] font-medium text-[#1B2124] dark:text-[#EBF2F5] mb-4">Topic Distribution</h3>
                      <div className="flex justify-center items-center h-64">
                        <PieChart width={300} height={250}>
                          <Pie
                            data={topicChartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label={({ name, value }) => `${name} (${value}%)`}
                          >
                            {topicChartData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={topicColors[index % topicColors.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-[16px] font-medium text-[#1B2124] dark:text-[#EBF2F5] mb-4">Sentiment Distribution</h3>
                      <div className="flex justify-center items-center h-64">
                        <PieChart width={300} height={250}>
                          <Pie
                            data={sentimentChartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label={({ name, value }) => `${name} (${value}%)`}
                          >
                            {sentimentChartData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={sentimentColors[index % sentimentColors.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-[16px] font-medium text-[#1B2124] dark:text-[#EBF2F5] mb-4">Key Insights</h3>
                    <ul className="space-y-2">
                      {topics
                        .filter((topic) => topic.count > 0)
                        .map((topic) => (
                          <li
                            key={topic.id}
                            className="flex items-start text-[14px] text-[#64748B] dark:text-[#A3ADB8]"
                          >
                            <span className="mr-2">•</span>
                            <span>
                              <strong>{topic.name}</strong>: {topic.count} feedback items ({topic.percentage}%) mention
                              keywords like {topic.keywords.slice(0, 3).join(", ")}.
                            </span>
                          </li>
                        ))}
                      {Object.entries(sentiments)
                        .filter(([_, data]) => data.count > 0)
                        .map(([sentiment, data]) => (
                          <li
                            key={sentiment}
                            className="flex items-start text-[14px] text-[#64748B] dark:text-[#A3ADB8]"
                          >
                            <span className="mr-2">•</span>
                            <span>
                              <strong>{sentiment} Sentiment</strong>: {data.count} feedback items ({data.percentage}%).
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === "sentiment" && (
                <div className="space-y-6">
                  <div className="text-[14px] text-[#64748B] dark:text-[#A3ADB8]">
                    {feedbackText.length} feedback items analyzed for sentiment (Positive, Negative, Neutral).
                  </div>

                  <div className="border border-[#e5e7eb] dark:border-[#2f3235] rounded-md p-4">
                    <h3 className="text-[15px] font-medium text-[#1B2124] dark:text-[#EBF2F5] mb-3">Sentiment Breakdown</h3>
                    {Object.entries(sentiments).map(([sentiment, data]) => (
                      <div key={sentiment} className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[14px] font-medium text-[#1B2124] dark:text-[#EBF2F5]">
                            {sentiment}
                          </span>
                          <div className="flex items-center">
                            <span className="text-[14px] font-medium text-[#1B2124] dark:text-[#EBF2F5]">
                              {data.count}
                            </span>
                            <span className="ml-2 text-[14px] text-[#64748B] dark:text-[#A3ADB8]">
                              ({data.percentage}%)
                            </span>
                          </div>
                        </div>
                        <div className="h-2 bg-[#F1F5F9] dark:bg-[#2f3235] rounded-full overflow-hidden">
                          <div
                            className="h-full"
                            style={{
                              width: `${data.percentage}%`,
                              backgroundColor:
                                sentiment === "Positive"
                                  ? "#22C55E"
                                  : sentiment === "Negative"
                                  ? "#EF4444"
                                  : "#6B7280",
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center items-center h-64">
                    <PieChart width={300} height={250}>
                      <Pie
                        data={sentimentChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, value }) => `${name} (${value}%)`}
                      >
                        {sentimentChartData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={sentimentColors[index % sentimentColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="p-4 border-t border-[#e5e7eb] dark:border-[#2f3235] flex justify-end space-x-2">
          <button
            onClick={() => onSaveAnalysis({ topics, sentiments, timestamp: new Date().toISOString() })}
            className="px-4 py-2 text-[14px] text-white bg-[#22C55E] rounded-sm hover:bg-[#16A34A]"
          >
            Save Analysis
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-[14px] text-[#1B2124] dark:text-[#EBF2F5] border border-[#e5e7eb] dark:border-[#2f3235] rounded-sm hover:bg-[#F5F5F7] dark:hover:bg-[#2f3235]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

AnalyzeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  feedbackText: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSaveAnalysis: PropTypes.func.isRequired,
};

export default AnalyzeModal;