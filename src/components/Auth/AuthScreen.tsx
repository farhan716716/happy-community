import React, { useState, useEffect } from 'react';
import { 
  Check, 
  AlertCircle, 
  ShieldCheck, 
  AtSign, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles,
  Globe,
  QrCode
} from 'lucide-react';
import { CurrentUser } from '../../types/whatsapp';
import { checkUsernameAvailability, registerAccount, loginAccount } from '../../services/api';

interface AuthScreenProps {
  onAuthSuccess: (user: CurrentUser) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<'register' | 'login'>('register');

  // Register fields
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPin, setRegPin] = useState('');
  const [regAbout, setRegAbout] = useState('Available on WhatsApp Web');

  // Login fields
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPin, setLoginPin] = useState('');

  // UI status
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debounced check for username availability
  useEffect(() => {
    if (mode !== 'register') return;
    const clean = regUsername.replace(/^@/, '').trim().toLowerCase();
    if (clean.length < 3) {
      setIsUsernameAvailable(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsCheckingUsername(true);
      const available = await checkUsernameAvailability(`@${clean}`);
      setIsUsernameAvailable(available);
      setIsCheckingUsername(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [regUsername, mode]);

  // Handle register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!regName.trim() || !regUsername.trim()) {
      setErrorMsg('Please provide both your display name and a unique @username.');
      return;
    }

    const cleanHandle = `@${regUsername.replace(/^@/, '').trim().toLowerCase()}`;
    if (!/^@[a-z0-9_.]+$/.test(cleanHandle) || cleanHandle.length < 4) {
      setErrorMsg('Username must be at least 3 characters and only contain letters, numbers, or underscores.');
      return;
    }

    setIsSubmitting(true);
    const res = await registerAccount(regName.trim(), cleanHandle, regPin || '1234', regAbout);
    setIsSubmitting(false);

    if (res.error) {
      setErrorMsg(res.error);
    } else if (res.user) {
      onAuthSuccess(res.user);
    }
  };

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginUsername.trim()) {
      setErrorMsg('Please enter your unique @username to log in.');
      return;
    }

    const cleanHandle = `@${loginUsername.replace(/^@/, '').trim().toLowerCase()}`;
    setIsSubmitting(true);
    const res = await loginAccount(cleanHandle, loginPin);
    setIsSubmitting(false);

    if (res.error) {
      setErrorMsg(res.error);
    } else if (res.user) {
      onAuthSuccess(res.user);
    }
  };

  // Quick 1-click login for testing
  const handleQuickLogin = async (demoHandle: string) => {
    setErrorMsg('');
    setIsSubmitting(true);
    const res = await loginAccount(demoHandle, '1234');
    setIsSubmitting(false);
    if (res.user) {
      onAuthSuccess(res.user);
    } else if (res.error) {
      setErrorMsg(res.error);
    }
  };

  return (
    <div className="w-screen h-screen bg-[#111b21] flex flex-col overflow-y-auto select-none font-sans">
      {/* Signature WhatsApp Green Banner */}
      <div className="h-44 sm:h-52 w-full bg-[#00a884] px-6 sm:px-16 pt-8 pb-16 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#00a884] shadow-md">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.19 8.19 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24-1.42 0-2.82-.37-4.06-1.07l-.29-.17-3.02.79.81-2.94-.19-.3a8.17 8.17 0 0 1-1.25-4.37c0-4.54 3.7-8.24 8.24-8.24zm-3.57 3.52c-.2 0-.44.07-.67.33-.23.27-.88.86-.88 2.1s.9 2.43 1.03 2.6c.13.17 1.74 2.66 4.22 3.73 2.06.89 2.48.71 2.93.67.45-.04 1.45-.59 1.66-1.16.2-.57.2-1.06.14-1.16-.06-.1-.23-.17-.48-.29s-1.46-.72-1.69-.8-.4-.13-.57.13c-.17.26-.65.82-.8 1-.15.17-.29.2-.54.07-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.4-1.75-.15-.26-.02-.4.11-.53.11-.11.25-.29.38-.43.13-.15.17-.25.25-.42.09-.17.04-.32-.02-.45-.06-.13-.57-1.37-.78-1.88-.2-.5-.41-.43-.57-.44l-.49-.01z" />
            </svg>
          </div>
          <span className="text-white text-xl sm:text-2xl font-semibold tracking-wide">
            WHATSAPP WEB
          </span>
          <span className="ml-2 text-[11px] font-mono bg-white/20 text-white px-2 py-0.5 rounded-full font-medium">
            USERNAME EDITION
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2 text-white/90 text-xs">
          <Globe className="w-4 h-4" />
          <span>Global Username Directory Active</span>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="flex-1 -mt-16 sm:-mt-24 px-4 sm:px-8 pb-12 flex justify-center">
        <div className="w-full max-w-4xl bg-white dark:bg-[#202c33] rounded-2xl shadow-2xl border border-[#e9edef] dark:border-[#222e35] overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Column: Instructions & Advantages */}
          <div className="md:w-5/12 p-6 sm:p-8 bg-[#f0f2f5] dark:bg-[#182229] border-b md:border-b-0 md:border-r border-[#e9edef] dark:border-[#222e35] flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#00a884]/15 px-3 py-1 rounded-full text-xs font-semibold text-[#00a884] mb-4">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Phone Number Privacy</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-semibold text-[#111b21] dark:text-[#e9edef] mb-3 leading-tight">
                Use WhatsApp with your unique @username
              </h2>

              <p className="text-xs sm:text-sm text-[#667781] dark:text-[#8696a0] leading-relaxed mb-6">
                No phone numbers needed. Anyone anywhere in the world can create an account, save your username, and message you directly.
              </p>

              <ol className="space-y-3.5 text-xs sm:text-sm text-[#111b21] dark:text-[#d1d7db]">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#00a884] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    1
                  </span>
                  <span>Create your unique handle (e.g. <strong>@tayyab</strong> or <strong>@ali_khan</strong>)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#00a884] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    2
                  </span>
                  <span>Your personal phone number is never asked, stored, or revealed</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#00a884] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    3
                  </span>
                  <span>Anyone in the world can search your handle and start chatting instantly</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#00a884] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    4
                  </span>
                  <span>Full voice notes, photos, calls, and encrypted message delivery</span>
                </li>
              </ol>
            </div>

            {/* Quick Demo Switcher */}
            <div className="mt-8 pt-4 border-t border-[#e9edef] dark:border-[#222e35]">
              <p className="text-[11px] font-semibold text-[#8696a0] uppercase tracking-wider mb-2">
                Quick Test Accounts (1-Click Login):
              </p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('@tayyab_official')}
                  className="px-2.5 py-1 text-xs font-mono bg-white dark:bg-[#202c33] hover:bg-[#00a884] hover:text-white rounded border border-[#e9edef] dark:border-[#222e35] transition-colors"
                >
                  @tayyab_official
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('@ayesha.khan')}
                  className="px-2.5 py-1 text-xs font-mono bg-white dark:bg-[#202c33] hover:bg-[#00a884] hover:text-white rounded border border-[#e9edef] dark:border-[#222e35] transition-colors"
                >
                  @ayesha.khan
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('@zain_dev')}
                  className="px-2.5 py-1 text-xs font-mono bg-white dark:bg-[#202c33] hover:bg-[#00a884] hover:text-white rounded border border-[#e9edef] dark:border-[#222e35] transition-colors"
                >
                  @zain_dev
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Register / Login Form */}
          <div className="md:w-7/12 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Tabs: Create Account vs Log In */}
              <div className="flex items-center gap-2 p-1 bg-[#f0f2f5] dark:bg-[#111b21] rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMsg('');
                  }}
                  className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                    mode === 'register'
                      ? 'bg-[#00a884] text-white shadow-sm'
                      : 'text-[#667781] dark:text-[#8696a0] hover:text-[#111b21] dark:hover:text-white'
                  }`}
                >
                  Create New Account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg('');
                  }}
                  className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                    mode === 'login'
                      ? 'bg-[#00a884] text-white shadow-sm'
                      : 'text-[#667781] dark:text-[#8696a0] hover:text-[#111b21] dark:hover:text-white'
                  }`}
                >
                  Log In to Account
                </button>
              </div>

              {/* Error Banner */}
              {errorMsg && (
                <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs sm:text-sm rounded-xl flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Mode 1: Register Form */}
              {mode === 'register' && (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#54656f] dark:text-[#aebac1] mb-1">
                      Display Name
                    </label>
                    <div className="relative flex items-center">
                      <User className="w-4 h-4 text-[#8696a0] absolute left-3 pointer-events-none" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tayyab Malik or Maria Silva"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#f0f2f5] dark:bg-[#111b21] text-[#111b21] dark:text-[#e9edef] rounded-xl border border-transparent focus:border-[#00a884] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-[#54656f] dark:text-[#aebac1]">
                        Choose Unique @username
                      </label>
                      {/* Availability status */}
                      {isCheckingUsername ? (
                        <span className="text-[10px] text-[#8696a0]">Checking...</span>
                      ) : isUsernameAvailable === true ? (
                        <span className="text-[10px] text-[#00a884] font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Handle Available!
                        </span>
                      ) : isUsernameAvailable === false ? (
                        <span className="text-[10px] text-rose-500 font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Already Taken!
                        </span>
                      ) : null}
                    </div>

                    <div className="relative flex items-center">
                      <AtSign className="w-4 h-4 text-[#8696a0] absolute left-3 pointer-events-none" />
                      <input
                        type="text"
                        required
                        placeholder="your_unique_username"
                        value={regUsername.replace(/^@/, '')}
                        onChange={(e) => {
                          setErrorMsg('');
                          setRegUsername(`@${e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, '')}`);
                        }}
                        className={`w-full pl-9 pr-3 py-2.5 text-sm font-mono bg-[#f0f2f5] dark:bg-[#111b21] text-[#00a884] font-semibold rounded-xl border focus:outline-none transition-colors ${
                          isUsernameAvailable === false
                            ? 'border-rose-500'
                            : isUsernameAvailable === true
                            ? 'border-[#00a884]'
                            : 'border-transparent focus:border-[#00a884]'
                        }`}
                      />
                    </div>
                    <p className="text-[10px] text-[#8696a0] mt-1">
                      This will be your universal address. Anyone worldwide can reach you via this handle.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#54656f] dark:text-[#aebac1] mb-1">
                        4-Digit PIN (Optional)
                      </label>
                      <div className="relative flex items-center">
                        <Lock className="w-4 h-4 text-[#8696a0] absolute left-3 pointer-events-none" />
                        <input
                          type="password"
                          maxLength={6}
                          placeholder="1234"
                          value={regPin}
                          onChange={(e) => setRegPin(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#f0f2f5] dark:bg-[#111b21] text-[#111b21] dark:text-[#e9edef] rounded-xl border border-transparent focus:border-[#00a884] focus:outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#54656f] dark:text-[#aebac1] mb-1">
                        About / Bio
                      </label>
                      <input
                        type="text"
                        placeholder="Available on WhatsApp"
                        value={regAbout}
                        onChange={(e) => setRegAbout(e.target.value)}
                        className="w-full px-3 py-2.5 text-sm bg-[#f0f2f5] dark:bg-[#111b21] text-[#111b21] dark:text-[#e9edef] rounded-xl border border-transparent focus:border-[#00a884] focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || isUsernameAvailable === false}
                    className="w-full mt-2 py-3 bg-[#00a884] hover:bg-[#008f6f] disabled:opacity-50 text-white font-medium text-sm rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{isSubmitting ? 'Creating account...' : 'Create Account & Enter WhatsApp'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* Mode 2: Login Form */}
              {mode === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#54656f] dark:text-[#aebac1] mb-1">
                      Your Unique @username
                    </label>
                    <div className="relative flex items-center">
                      <AtSign className="w-4 h-4 text-[#8696a0] absolute left-3 pointer-events-none" />
                      <input
                        type="text"
                        required
                        placeholder="your_unique_username"
                        value={loginUsername.replace(/^@/, '')}
                        onChange={(e) => {
                          setErrorMsg('');
                          setLoginUsername(`@${e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, '')}`);
                        }}
                        className="w-full pl-9 pr-3 py-2.5 text-sm font-mono bg-[#f0f2f5] dark:bg-[#111b21] text-[#00a884] font-semibold rounded-xl border border-transparent focus:border-[#00a884] focus:outline-none"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#54656f] dark:text-[#aebac1] mb-1">
                      4-Digit Security PIN (if set)
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="w-4 h-4 text-[#8696a0] absolute left-3 pointer-events-none" />
                      <input
                        type="password"
                        placeholder="1234"
                        value={loginPin}
                        onChange={(e) => setLoginPin(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#f0f2f5] dark:bg-[#111b21] text-[#111b21] dark:text-[#e9edef] rounded-xl border border-transparent focus:border-[#00a884] focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 py-3 bg-[#00a884] hover:bg-[#008f6f] disabled:opacity-50 text-white font-medium text-sm rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{isSubmitting ? 'Logging in...' : 'Log In to WhatsApp Web'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

            <div className="mt-6 text-center text-xs text-[#8696a0] flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00a884]" />
              <span>Global directory protected · Messages verified by @username</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
