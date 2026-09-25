import React from 'react';
import { Search, ArrowLeft, Filter, X } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: 'all' | 'unread' | 'favourites' | 'groups';
  onFilterChange: (filter: 'all' | 'unread' | 'favourites' | 'groups') => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
}) => {
  return (
    <div className="px-3 pt-2 pb-2 bg-white dark:bg-[#111b21] border-b border-[#e9edef] dark:border-[#222e35]">
      {/* Search Input Box */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 flex items-center bg-[#f0f2f5] dark:bg-[#202c33] rounded-lg px-3 py-1.5 focus-within:ring-1 focus-within:ring-[#00a884] transition-all">
          {searchQuery ? (
            <button 
              onClick={() => onSearchChange('')}
              className="text-[#00a884] hover:text-[#008f6f] mr-2"
              title="Clear search"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : (
            <Search className="w-4 h-4 text-[#54656f] dark:text-[#aebac1] mr-2 shrink-0" />
          )}

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search or start new chat by @username"
            className="w-full bg-transparent text-sm text-[#111b21] dark:text-[#d1d7db] placeholder-[#54656f] dark:placeholder-[#8696a0] focus:outline-none"
          />

          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="text-[#54656f] dark:text-[#8696a0] hover:text-[#111b21] dark:hover:text-[#e9edef] p-0.5 ml-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Unread Button */}
        <button
          onClick={() => onFilterChange(activeFilter === 'unread' ? 'all' : 'unread')}
          className={`p-2 rounded-full transition-colors ${
            activeFilter === 'unread'
              ? 'bg-[#00a884]/20 text-[#00a884]'
              : 'text-[#54656f] dark:text-[#aebac1] hover:bg-[#f0f2f5] dark:hover:bg-[#202c33]'
          }`}
          title="Filter unread chats"
        >
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* WhatsApp filter tabs: All, Unread, Favourites, Groups */}
      <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto no-scrollbar pb-0.5">
        {(['all', 'unread', 'favourites', 'groups'] as const).map((filter) => {
          const isActive = activeFilter === filter;
          const labels: Record<string, string> = {
            all: 'All',
            unread: 'Unread',
            favourites: 'Favourites',
            groups: 'Groups'
          };

          return (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-[#00a884] text-white shadow-xs'
                  : 'bg-[#f0f2f5] dark:bg-[#202c33] text-[#54656f] dark:text-[#8696a0] hover:bg-[#e9edef] dark:hover:bg-[#2a3942]'
              }`}
            >
              {labels[filter]}
            </button>
          );
        })}
      </div>
    </div>
  );
};
