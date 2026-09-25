import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Send, Plus, CircleDashed } from 'lucide-react';
import { UserStatus } from '../../types/whatsapp';

interface StatusViewerModalProps {
  statuses: UserStatus[];
  initialContactId?: string;
  onClose: () => void;
  onReplyToStory: (contactId: string, replyText: string) => void;
}

export const StatusViewerModal: React.FC<StatusViewerModalProps> = ({
  statuses,
  initialContactId,
  onClose,
  onReplyToStory,
}) => {
  const activeStatuses = statuses.filter(s => s.items.length > 0);
  const initialIndex = initialContactId
    ? Math.max(0, activeStatuses.findIndex(s => s.userId === initialContactId))
    : 0;

  const [currentUserIndex, setCurrentUserIndex] = useState(initialIndex >= 0 ? initialIndex : 0);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [replyText, setReplyText] = useState('');
  const [isPaused, setIsPaused] = useState(false);

  const currentStatus = activeStatuses[currentUserIndex];
  const currentStory = currentStatus?.items[currentStoryIndex];

  // Auto-progress story timer (5 seconds per slide)
  useEffect(() => {
    if (!currentStatus || !currentStory || isPaused) return;

    const timer = setTimeout(() => {
      if (currentStoryIndex < currentStatus.items.length - 1) {
        setCurrentStoryIndex(prev => prev + 1);
      } else if (currentUserIndex < activeStatuses.length - 1) {
        setCurrentUserIndex(prev => prev + 1);
        setCurrentStoryIndex(0);
      } else {
        onClose();
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentUserIndex, currentStoryIndex, currentStatus, isPaused, activeStatuses.length, onClose]);

  const handleNext = () => {
    if (!currentStatus) return;
    if (currentStoryIndex < currentStatus.items.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
    } else if (currentUserIndex < activeStatuses.length - 1) {
      setCurrentUserIndex(prev => prev + 1);
      setCurrentStoryIndex(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
    } else if (currentUserIndex > 0) {
      setCurrentUserIndex(prev => prev - 1);
      const prevItems = activeStatuses[currentUserIndex - 1]?.items;
      setCurrentStoryIndex(prevItems ? prevItems.length - 1 : 0);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyText.trim() && currentStatus) {
      onReplyToStory(
        currentStatus.userId,
        `Replied to your status: "${replyText.trim()}"`
      );
      setReplyText('');
      alert(`Sent reply to ${currentStatus.username}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0c1317] flex select-none text-white animate-in fade-in duration-200">
      {/* Left Sidebar: List of all statuses */}
      <div className="w-80 sm:w-96 h-full bg-[#111b21] border-r border-[#222e35] hidden md:flex flex-col">
        {/* Top Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#222e35]">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1 text-[#aebac1] hover:text-white rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="font-semibold text-lg">Status</span>
          </div>
        </div>

        {/* My Status row */}
        <div className="p-4 border-b border-[#222e35] flex items-center gap-3">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="My Avatar"
              className="w-12 h-12 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#00a884] rounded-full flex items-center justify-center text-white">
              <Plus className="w-3 h-3" />
            </div>
          </div>
          <div>
            <p className="font-medium text-sm">My Status</p>
            <p className="text-xs text-[#8696a0]">No updates · @tayyab_official</p>
          </div>
        </div>

        {/* Recent updates list with unique usernames */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <span className="text-xs font-semibold text-[#00a884] uppercase tracking-wider">
            Recent updates (by @username)
          </span>

          <div className="space-y-1">
            {activeStatuses.map((st, idx) => (
              <div
                key={st.id}
                onClick={() => {
                  setCurrentUserIndex(idx);
                  setCurrentStoryIndex(0);
                }}
                className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
                  idx === currentUserIndex
                    ? 'bg-[#2a3942]'
                    : 'hover:bg-[#202c33]'
                }`}
              >
                <div className="p-0.5 rounded-full ring-2 ring-[#00a884]">
                  <img
                    src={st.avatar}
                    alt={st.name}
                    className="w-10 h-10 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{st.name}</p>
                  <p className="font-mono text-xs text-[#00a884]">{st.username}</p>
                  <p className="text-[11px] text-[#8696a0]">{st.updatedAt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Story Display Area */}
      <div 
        className="flex-1 h-full flex flex-col items-center justify-between relative p-4 sm:p-6"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 z-50 p-2 bg-black/40 rounded-full text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Story Card Container */}
        {currentStatus && currentStory ? (
          <div className="w-full max-w-lg h-full flex flex-col justify-between py-2">
            {/* Top Progress Bars & User Info */}
            <div className="space-y-3 z-20">
              {/* Progress bars */}
              <div className="flex items-center gap-1.5 w-full">
                {currentStatus.items.map((_, idx) => (
                  <div key={idx} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-white transition-all ${
                        idx < currentStoryIndex
                          ? 'w-full'
                          : idx === currentStoryIndex
                          ? 'w-full duration-[5000ms] ease-linear'
                          : 'w-0'
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* User info bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={currentStatus.avatar}
                    alt={currentStatus.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-[#00a884]"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{currentStatus.name}</span>
                      <span className="font-mono text-xs text-[#00a884] bg-black/40 px-1.5 py-0.5 rounded">
                        {currentStatus.username}
                      </span>
                    </div>
                    <span className="text-[11px] text-white/70">{currentStory.timestamp}</span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="hidden md:block p-2 text-white/70 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Story Content Canvas */}
            <div className="flex-1 flex items-center justify-center my-4 relative rounded-2xl overflow-hidden shadow-2xl bg-black/40">
              {/* Left/Right Navigation click areas */}
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/70 rounded-full z-20"
                title="Previous story"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/70 rounded-full z-20"
                title="Next story"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Story Visual */}
              {currentStory.mediaUrl ? (
                <div className="w-full h-full flex flex-col items-center justify-center relative">
                  <img
                    src={currentStory.mediaUrl}
                    alt="Status story"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {currentStory.caption && (
                    <div className="absolute bottom-4 inset-x-4 bg-black/60 backdrop-blur-md p-3 rounded-xl text-center text-sm">
                      {currentStory.caption}
                    </div>
                  )}
                </div>
              ) : (
                <div
                  style={{ backgroundColor: currentStory.bgColor || '#005c4b' }}
                  className="w-full h-full flex items-center justify-center p-8 text-center"
                >
                  <p className="text-xl sm:text-2xl font-serif leading-relaxed">
                    {currentStory.text}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Reply Bar */}
            <form onSubmit={handleSendReply} className="flex items-center gap-2 z-20">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Reply to ${currentStatus.username}...`}
                className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2.5 text-sm text-white placeholder-white/60 focus:outline-none focus:border-[#00a884]"
              />
              <button
                type="submit"
                className="p-2.5 bg-[#00a884] hover:bg-[#008f6f] text-white rounded-full transition-colors"
                title="Send reply"
              >
                <Send className="w-4 h-4 fill-current ml-0.5" />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-[#8696a0]">
            <CircleDashed className="w-12 h-12 mb-3 text-[#00a884]" />
            <p className="text-lg font-medium text-white">No active status updates</p>
            <p className="text-xs mt-1">Status updates from your @usernames will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};
