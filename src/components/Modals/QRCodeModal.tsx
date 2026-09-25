import React, { useState } from 'react';
import { X, Copy, Check, Share2, QrCode, ShieldCheck } from 'lucide-react';
import { CurrentUser } from '../../types/whatsapp';

interface QRCodeModalProps {
  user: CurrentUser;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ user, onClose }) => {
  const [copied, setCopied] = useState(false);
  const shareLink = `https://wa.me/${user.username.replace('@', '')}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white dark:bg-[#202c33] rounded-2xl shadow-2xl border border-[#e9edef] dark:border-[#222e35] overflow-hidden flex flex-col text-[#111b21] dark:text-[#e9edef]">
        {/* Header */}
        <div className="h-14 px-4 border-b border-[#e9edef] dark:border-[#222e35] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-[#00a884]" />
            <span className="font-semibold text-base">QR Code & Username</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#8696a0] hover:text-[#111b21] dark:hover:text-white rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col items-center text-center">
          <p className="text-xs text-[#8696a0] mb-4">
            Your QR code and unique username are private. Others can scan or add your handle to start a chat without your phone number.
          </p>

          {/* QR Code Container */}
          <div className="p-4 bg-white rounded-2xl shadow-md border border-[#e9edef] relative mb-4">
            {/* SVG Authentic QR code simulation */}
            <svg
              className="w-48 h-48"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="100" height="100" fill="white" />
              {/* Corner markers */}
              <rect x="5" y="5" width="26" height="26" stroke="#111b21" strokeWidth="4" fill="white" />
              <rect x="11" y="11" width="14" height="14" fill="#111b21" />
              <rect x="69" y="5" width="26" height="26" stroke="#111b21" strokeWidth="4" fill="white" />
              <rect x="75" y="11" width="14" height="14" fill="#111b21" />
              <rect x="5" y="69" width="26" height="26" stroke="#111b21" strokeWidth="4" fill="white" />
              <rect x="11" y="75" width="14" height="14" fill="#111b21" />
              {/* Data blocks */}
              <rect x="36" y="8" width="6" height="6" fill="#111b21" />
              <rect x="46" y="8" width="6" height="12" fill="#111b21" />
              <rect x="56" y="8" width="6" height="6" fill="#111b21" />
              <rect x="36" y="20" width="16" height="6" fill="#111b21" />
              <rect x="8" y="36" width="6" height="16" fill="#111b21" />
              <rect x="20" y="36" width="12" height="6" fill="#111b21" />
              <rect x="20" y="46" width="6" height="16" fill="#111b21" />
              <rect x="68" y="36" width="14" height="6" fill="#111b21" />
              <rect x="86" y="36" width="6" height="12" fill="#111b21" />
              <rect x="74" y="46" width="6" height="16" fill="#111b21" />
              <rect x="36" y="68" width="6" height="12" fill="#111b21" />
              <rect x="46" y="74" width="12" height="6" fill="#111b21" />
              <rect x="64" y="68" width="16" height="6" fill="#111b21" />
              <rect x="64" y="78" width="6" height="14" fill="#111b21" />
              <rect x="74" y="86" width="18" height="6" fill="#111b21" />
              <rect x="36" y="86" width="14" height="6" fill="#111b21" />
              {/* WhatsApp Emerald logo in center */}
              <circle cx="50" cy="50" r="12" fill="#00a884" />
              <path
                d="M50 42c-4.4 0-8 3.6-8 8 0 1.4.4 2.8 1.1 4L42 58l4.1-1.1c1.2.7 2.5 1.1 3.9 1.1 4.4 0 8-3.6 8-8s-3.6-8-8-8z"
                fill="white"
              />
            </svg>
          </div>

          <h3 className="text-lg font-semibold">{user.name}</h3>

          {/* Unique Username Display */}
          <div className="mt-1 flex items-center gap-1.5 bg-[#00a884]/15 px-3 py-1 rounded-full border border-[#00a884]/30">
            <span className="font-mono text-sm font-semibold text-[#00a884]">
              {user.username}
            </span>
          </div>

          <p className="text-[11px] text-[#8696a0] mt-2 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00a884]" />
            <span>Encrypted username ID</span>
          </p>

          {/* Action buttons */}
          <div className="w-full grid grid-cols-2 gap-2 mt-5">
            <button
              onClick={handleCopyLink}
              className="py-2.5 px-3 bg-[#f0f2f5] dark:bg-[#111b21] hover:bg-[#e9edef] dark:hover:bg-[#2a3942] rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-[#00a884]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied Link!' : 'Copy Link'}</span>
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(user.username);
                alert(`Copied handle: ${user.username}`);
              }}
              className="py-2.5 px-3 bg-[#00a884] hover:bg-[#008f6f] text-white rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Username</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
