import React, { useState } from 'react';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import CampaignForm from './campaign_form';

const CampaignCard = ({ campaign = { name: 'Open Day Feedback', description: 'Help us improve our Open Day event!', date: 'May 10, 2025' } }) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="mt-6 bg-white dark:bg-[#202325] border border-[#C3D3DB] dark:border-[#2f3235] rounded-lg shadow-sm">
      <div className="p-4">
        <h3 className="text-[16px] font-semibold text-[#1B2124] dark:text-[#EBF2F5]">{campaign.name}</h3>
        <p className="text-[14px] text-[#1B2124] dark:text-[#EBF2F5] mt-1">{campaign.description}</p>
        <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">Date: {campaign.date}</p>
        <button
          onClick={() => setShowForm(!showForm)}
          className="mt-2 flex items-center text-[#3385F0] hover:text-[#2b73d1] text-[14px]"
        >
          {showForm ? (
            <>
              <IconChevronUp size={16} className="mr-1" /> Show Less
            </>
          ) : (
            <>
              <IconChevronDown size={16} className="mr-1" /> Show More
            </>
          )}
        </button>
      </div>
      {showForm && (
        <div className="p-4 border-t border-[#C3D3DB] dark:border-[#2f3235]">
          <CampaignForm
            title={`Submit Feedback for ${campaign.name}`}
            placeholder={`Share your thoughts about ${campaign.name}...`}
          />
        </div>
      )}
    </div>
  );
};

export default CampaignCard;