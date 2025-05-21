import { 
  IconUpload,
  IconCopy,
  IconTrash 
} from '@tabler/icons-react';

const FeedBackSummary = () => {
  return (
    <div className='flex min-h-screen'>
      <div className='flex-1'>
        <header className="p-5 border-b border-[#e5e7eb]">
          <div className="flex items-center justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="text-[15px] text-[#64748B]">Home</span>
                <span className="text-[#64748B] text-[15px]">&gt;</span>
                <span className="font-medium text-[15px] text-[#1B2124]">Summarizer</span>
              </div>
              <span className="text-[18px] text-[#1B2124] font-semibold tracking-normal">Summarize Feedback</span>
            </div>
          </div>
        </header>
        <div className="p-5 max-w-7xl mx-auto">
          <div className="bg-white rounded-sm border border-[#e5e7eb]">
            {/* First Row: Modes */}
            <div className="px-5 py-3 border-b border-[#e5e7eb] flex items-center justify-between">
              <div className='flex items-center space-x-15'>
                <div className="flex items-center space-x-5">
                  <span className="font-medium text-[14px] text-[#1B2124] tracking-normal">Modes:</span>
                  <div className="space-x-4">
                    <span className="text-[#1B2124] text-[14px] tracking-normal">Paragraph</span>
                    <span className="text-[#1B2124] text-[14px] tracking-normal">Bullet Points</span>
                  </div>
                </div>
                <div className="flex items-center space-x-5">
                  <span className="font-medium text-[14px] text-[#1B2124] tracking-normal">Length:</span>
                  <div className="flex items-center space-x-2.5">
                    <span className='text-[#64748B] text-[14px] tracking-normal'>Short</span>
                    <input type="range" name="" id="" />
                    <spa className="text-[#64748B] text-[14px] tracking-normal">Long</spa>
                  </div>
                </div>
              </div>
              <IconTrash stroke={2} size={18} />
            </div>
            {/* Second Row: Two Columns with Border in Between */}
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="md:border-r md:border-[#e5e7eb]">
                <div className="px-5 py-3">sdsd</div>
                <div className="px-5">
                  <textarea
                    name=""
                    id=""
                    placeholder="Type here...."
                    className="w-full h-100 outline-none rounded-lg focus:ring-0 focus:border-gray-300"
                  ></textarea>
                </div>
                
                <div className='flex items-center justify-between px-5 py-3'>
                  
                  <div className='flex items-center space-x-4'>
                    <IconUpload stroke={2} size={17} />
                    <IconCopy stroke={2} size={17} />
                  </div>
                  <button 
                    className='tracking-normal space-x-2 px-3 py-[7px] rounded-sm 
                    text-[14px] text-white transition-colors duration-300 bg-[#3385F0]'>
                      Summarize
                  </button>
                </div>
              </div>
              <div>
                {/* Content for second column */}
                Column 2
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedBackSummary;