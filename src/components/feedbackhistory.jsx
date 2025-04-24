import React from 'react';
import PropTypes from 'prop-types';

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusStyles = {
    Resolved: 'bg-green-100 text-green-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    Viewed: 'bg-orange-100 text-orange-800',
    'Noted—Thanks!': 'bg-gray-100 text-gray-800',
    'Under Review': 'bg-purple-100 text-purple-800',
  };

  return (
    <span className={`px-3 py-1 rounded text-sm font-medium ${statusStyles[status]}`}>
      {status}
    </span>
  );
};

// Skeleton Loader Component
const SkeletonLoader = ({ count = 5 }) => (
  <div className="space-y-6">
    {[...Array(count)].map((_, index) => (
      <div key={index} className="animate-pulse">
        <div className="flex justify-between items-start">
          <div className="space-y-2 w-full">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded px-4"></div>
        </div>
        <div className="mt-2 pl-4 border-l-2 border-gray-200">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
);

const FeedbackHistory = ({ feedbackHistory, isLoading }) => {
  return (
    <div className="py-5">
      {isLoading ? (
        <SkeletonLoader count={5} />
      ) : feedbackHistory.length === 0 ? (
        <p className="text-center text-gray-600">No feedback history available.</p>
      ) : (
        <div className="space-y-6">
          {feedbackHistory.map((entry) => (
            <div key={entry.id} className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-gray-800">{entry.text}</p>
                  <p className="text-sm text-gray-500 mt-1">Submitted: {entry.submitted}</p>
                </div>
                <StatusBadge status={entry.status} />
              </div>
              {entry.adminReply && (
                <div className="mt-2 ml-4 pl-2 border-l-2 border-blue-500">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Admin Reply:</span> {entry.adminReply}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

FeedbackHistory.propTypes = {
  feedbackHistory: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
      submitted: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      adminReply: PropTypes.string,
    })
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default FeedbackHistory;