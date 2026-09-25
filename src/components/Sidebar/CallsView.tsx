import React from 'react';
import { 
  ArrowLeft, 
  Phone, 
  Video, 
  ArrowDownLeft, 
  ArrowUpRight, 
  PhoneMissed, 
  Link, 
  ShieldCheck 
} from 'lucide-react';
import { CallRecord, Contact } from '../../types/whatsapp';

interface CallsViewProps {
  calls: CallRecord[];
  contacts: Contact[];
  onClose: () => void;
  onStartVoiceCall: (contact: Contact) => void;
  onStartVideoCall: (contact: Contact) => void;
}

export const CallsView: React.FC<CallsViewProps> = ({
  calls,
  contacts,
  onClose,
  onStartVoiceCall,
  onStartVideoCall,
}) => {
  const getContactByUsername = (username: string) => {
    return contacts.find(c => c.username === username) || contacts[0];
  };

  return (
    <div className="absolute inset-0 bg-white dark:bg-[#111b21] z-30 flex flex-col select-none animate-in slide-in-from-left duration-200">
      {/* Header */}
      <div className="h-28 bg-[#008069] dark:bg-[#202c33] text-white px-4 flex flex-col justify-end pb-3 shrink-0">
        <div className="flex items-center gap-6">
          <button
            onClick={onClose}
            className="p-1 hover:bg-black/10 rounded-full transition-colors"
            title="Back to chats"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <span className="text-xl font-medium">Calls</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Create Call Link with @username */}
        <div 
          onClick={() => alert("Call link generated: https://wa.me/call/@tayyab_official - Share this unique handle link for anyone to join without phone numbers.")}
          className="flex items-center gap-4 px-4 py-3.5 hover:bg-[#f5f6f6] dark:hover:bg-[#202c33] cursor-pointer border-b border-[#e9edef]/60 dark:border-[#222e35]/60 transition-colors"
        >
          <div className="w-11 h-11 rounded-full bg-[#00a884] text-white flex items-center justify-center">
            <Link className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-medium text-[#111b21] dark:text-[#e9edef]">
              Create call link by @username
            </p>
            <p className="text-xs text-[#8696a0]">
              Share link for your unique WhatsApp Web call
            </p>
          </div>
        </div>

        {/* Recent Calls header */}
        <div className="px-4 py-3 bg-[#f0f2f5]/50 dark:bg-[#182229]/50">
          <span className="text-xs font-semibold text-[#00a884] uppercase tracking-wider">
            Recent (Identified by @username)
          </span>
        </div>

        {/* Calls List */}
        <div className="divide-y divide-[#e9edef]/40 dark:divide-[#222e35]/40">
          {calls.map((call) => {
            const contact = getContactByUsername(call.contactUsername);
            return (
              <div
                key={call.id}
                className="flex items-center justify-between px-4 py-3 hover:bg-[#f5f6f6] dark:hover:bg-[#202c33] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={call.contactAvatar}
                    alt={call.contactName}
                    className="w-11 h-11 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#111b21] dark:text-[#e9edef] truncate">
                      {call.contactName}
                    </p>
                    <p className="font-mono text-xs text-[#00a884]">
                      {call.contactUsername}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#8696a0] mt-0.5">
                      {call.direction === 'incoming' ? (
                        <ArrowDownLeft className="w-3.5 h-3.5 text-[#00a884]" />
                      ) : call.direction === 'outgoing' ? (
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#00a884]" />
                      ) : (
                        <PhoneMissed className="w-3.5 h-3.5 text-rose-500" />
                      )}
                      <span>{call.timestamp}</span>
                      {call.duration && (
                        <span>· {call.duration}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Direct Action buttons to call */}
                <div className="flex items-center gap-1 shrink-0 text-[#00a884]">
                  {call.type === 'video' ? (
                    <button
                      onClick={() => onStartVideoCall(contact)}
                      className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full"
                      title="Video call"
                    >
                      <Video className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onStartVoiceCall(contact)}
                      className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full"
                      title="Voice call"
                    >
                      <Phone className="w-4.5 h-4.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Security footnote */}
        <div className="p-6 text-center text-xs text-[#8696a0] flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#00a884]" />
          <span>Calls are encrypted and authenticated with @username keys</span>
        </div>
      </div>
    </div>
  );
};
