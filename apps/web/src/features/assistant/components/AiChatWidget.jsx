import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  Send,
  X,
  Minimize2,
  Maximize2,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Mic,
  Building2,
  ShieldCheck,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { queryAssistant } from '../data/assistantKnowledge';
import { useAuth } from '../../auth/useAuth';

/**
 * Parses inline markdown: **bold**, *italic*, `code`, [link](url)
 */
function parseInlineMarkdown(text) {
  if (!text) return null;

  const tokens = [];
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g;
  let lastIndex = 0;
  let match;
  let keyIndex = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(text.substring(lastIndex, match.index));
    }

    const matchedStr = match[0];
    if (matchedStr.startsWith('**') && matchedStr.endsWith('**')) {
      const boldText = matchedStr.slice(2, -2);
      tokens.push(
        <strong key={keyIndex++} className="font-semibold text-zinc-950 dark:text-white">
          {boldText}
        </strong>
      );
    } else if (matchedStr.startsWith('*') && matchedStr.endsWith('*')) {
      const italicText = matchedStr.slice(1, -1);
      tokens.push(
        <em key={keyIndex++} className="italic text-zinc-700 dark:text-zinc-300">
          {italicText}
        </em>
      );
    } else if (matchedStr.startsWith('`') && matchedStr.endsWith('`')) {
      const codeText = matchedStr.slice(1, -1);
      tokens.push(
        <code
          key={keyIndex++}
          className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-amber-600 dark:text-amber-400 font-mono text-[11px]"
        >
          {codeText}
        </code>
      );
    } else if (matchedStr.startsWith('[') && matchedStr.includes('](')) {
      const linkMatch = matchedStr.match(/\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
        tokens.push(
          <a
            key={keyIndex++}
            href={linkMatch[2]}
            className="text-amber-600 dark:text-amber-400 font-medium underline hover:text-amber-500"
          >
            {linkMatch[1]}
          </a>
        );
      } else {
        tokens.push(matchedStr);
      }
    } else {
      tokens.push(matchedStr);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push(text.substring(lastIndex));
  }

  return tokens;
}

/**
 * Clean multi-line Markdown block renderer (Headings, Tables, Lists, Quotes, Paragraphs)
 */
function MarkdownRenderer({ content }) {
  if (!content) return null;

  const blocks = content.split('\n\n');

  return (
    <div className="space-y-2 text-xs leading-relaxed text-zinc-800 dark:text-zinc-200">
      {blocks.map((block, bIdx) => {
        const trimmed = block.trim();

        // 1. Markdown Table
        if (trimmed.includes('|') && trimmed.includes('\n')) {
          const lines = trimmed.split('\n').filter((l) => l.trim().startsWith('|'));
          if (lines.length >= 2) {
            const headerCells = lines[0]
              .split('|')
              .map((c) => c.trim())
              .filter(Boolean);
            const dataRows = lines.slice(2);
            return (
              <div
                key={bIdx}
                className="my-2.5 overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800"
              >
                <table className="w-full text-left text-[11px] divide-y divide-zinc-200 dark:divide-zinc-800">
                  <thead className="bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 font-semibold">
                    <tr>
                      {headerCells.map((h, i) => (
                        <th key={i} className="py-1.5 px-2.5">
                          {parseInlineMarkdown(h)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60 bg-white dark:bg-[#16181e]">
                    {dataRows.map((row, rIdx) => {
                      const cells = row
                        .split('|')
                        .map((c) => c.trim())
                        .filter(Boolean);
                      return (
                        <tr key={rIdx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                          {cells.map((cell, cIdx) => (
                            <td key={cIdx} className="py-1 px-2.5">
                              {parseInlineMarkdown(cell)}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          }
        }

        // 2. Headings (### or ## or #)
        if (trimmed.startsWith('#')) {
          const title = trimmed.replace(/^#+\s*/, '');
          return (
            <h4
              key={bIdx}
              className="font-bold text-xs sm:text-sm text-amber-600 dark:text-amber-400 mt-2 mb-1 flex items-center gap-1.5"
            >
              {parseInlineMarkdown(title)}
            </h4>
          );
        }

        // 3. Blockquotes / Tips
        if (trimmed.startsWith('>')) {
          const quoteLines = trimmed
            .split('\n')
            .map((l) => l.replace(/^>\s*/, ''))
            .join(' ');
          return (
            <div
              key={bIdx}
              className="p-2.5 rounded-lg bg-amber-500/10 border-l-2 border-amber-500 text-zinc-700 dark:text-zinc-300 text-[11px] my-1.5"
            >
              {parseInlineMarkdown(quoteLines)}
            </div>
          );
        }

        // 4. Bullet lists
        const lines = trimmed.split('\n');
        const isList = lines.every((l) => /^\s*([*•\-+]|\d+\.)\s+/.test(l));

        if (isList) {
          return (
            <ul key={bIdx} className="space-y-1.5 my-1.5 pl-0.5">
              {lines.map((line, lIdx) => {
                const cleaned = line.replace(/^\s*([*•\-+]|\d+\.)\s+/, '');
                return (
                  <li key={lIdx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                    <span className="flex-1">{parseInlineMarkdown(cleaned)}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        // Mixed paragraphs with inline bullet items
        if (lines.length > 1 && lines.some((l) => /^\s*([*•\-+]|\d+\.)\s+/.test(l))) {
          return (
            <div key={bIdx} className="space-y-1.5 my-1">
              {lines.map((line, lIdx) => {
                if (/^\s*([*•\-+]|\d+\.)\s+/.test(line)) {
                  const cleaned = line.replace(/^\s*([*•\-+]|\d+\.)\s+/, '');
                  return (
                    <div key={lIdx} className="flex items-start gap-2 pl-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                      <span className="flex-1">{parseInlineMarkdown(cleaned)}</span>
                    </div>
                  );
                }
                return (
                  <p key={lIdx} className="leading-relaxed">
                    {parseInlineMarkdown(line)}
                  </p>
                );
              })}
            </div>
          );
        }

        // 5. Standard paragraph
        return (
          <p key={bIdx} className="leading-relaxed">
            {parseInlineMarkdown(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

export default function AiChatWidget() {
  const navigate = useNavigate();
  const { role: authRole } = useAuth();

  // STRICTLY lock role to currently authenticated role. No cross-switching!
  const role = authRole === 'admin' ? 'admin' : authRole === 'institution' ? 'institution' : 'officer';

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [language, setLanguage] = useState('en'); // 'en' | 'hi'
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [feedbackMap, setFeedbackMap] = useState({});

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Persona Details strictly based on logged in role
  const personaConfig = {
    officer: {
      title: 'Scrutiny Officer AI Assistant',
      deskName: 'Officer Scrutiny Bureau',
      badge: 'Officer Desk',
      badgeColor: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
      icon: <ShieldCheck className="w-5 h-5 text-sky-400" />,
      avatarBg: 'bg-sky-500',
      placeholder: 'Ask about 12 regional offices, risk queue, tiers...',
      welcomeText: `Greetings, Scrutiny Officer.\n\n**AICTE Scrutiny Assistant** is ready to assist your bureau:\n* **12 Regional Directorates status & vault metrics**\n* **Verification Tiers (T0 self-declared to T3 NeSL / Core API)**\n* **Risk Queue scoring & Coverage Gap detection**\n* **Release approval hierarchy sign-offs**\n\nWhat case or jurisdiction metric would you like to review?`,
      presetQueries: [
        { label: '12 Regional Offices status', query: 'How are the 12 AICTE Regional Offices monitored?' },
        { label: 'Verification Tiers (T0 - T3)', query: 'How does the Multi-Tier Trust Verification (T0 - T3) work?' },
        { label: 'High-Risk Queue criteria', query: 'What criteria place an institution into the High-Risk Queue?' },
      ],
    },
    institution: {
      title: 'Institution FDR AI Assistant',
      deskName: 'Approved College Registrar Desk',
      badge: 'Institution Desk',
      badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      icon: <Building2 className="w-5 h-5 text-emerald-400" />,
      avatarBg: 'bg-emerald-500',
      placeholder: 'Ask about FDR submission, joint lien, renewal...',
      welcomeText: `Namaste! 🙏 Welcome to **AICTE Sahayak**, your FDR Regulatory Assistant.\n\nI can assist your institution with:\n* **FDR Submissions & Mandatory Joint Lien wording**\n* **Renewal timelines & zero-day gap protection**\n* **Release & NOC protocols**\n* **Bank verification status**\n\nHow can I help your institution today?`,
      presetQueries: [
        { label: 'How to submit new FDR?', query: 'How to submit new FDR on the portal?' },
        { label: 'Mandatory joint lien wording', query: 'What is the mandatory AICTE Joint Lien clause wording?' },
        { label: 'Renewal rules & grace period', query: 'What is the FDR renewal timeline and grace period?' },
      ],
    },
    admin: {
      title: 'System Admin Vault AI',
      deskName: 'Cryptographic Vault Sentinel',
      badge: 'Admin Desk',
      badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      icon: <Lock className="w-5 h-5 text-amber-400" />,
      avatarBg: 'bg-amber-500',
      placeholder: 'Ask about Merkle audit, mock bank, alerts...',
      welcomeText: `Welcome, Vault Administrator.\n\nSystem Sentinel is operational with active ledger oversight:\n* **SHA-256 Merkle Tree cryptographic integrity**\n* **Core Banking gateway & Mock Bank sandbox simulation**\n* **Automated compliance alert rules (60/30/15/7 days)**\n* **Regional office ledger sync**\n\nSelect an administrative query or type your instruction.`,
      presetQueries: [
        { label: 'Explain Merkle Audit Ledger', query: 'Explain the Merkle Tree Cryptographic Audit Ledger' },
        { label: 'Mock Bank Gateway simulator', query: 'How does the Core Banking / NeSL Gateway Simulator work?' },
        { label: 'Automated alert dispatch rules', query: 'How are automated renewal alerts dispatched?' },
      ],
    },
  }[role];

  // Initialize welcome message for the authenticated user's role
  useEffect(() => {
    setMessages([
      {
        id: 'welcome-' + role,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: personaConfig.welcomeText,
        actions: personaConfig.presetQueries,
      },
    ]);
  }, [role]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Handle send message
  const handleSend = (textToSend) => {
    const query = textToSend || inputText;
    if (!query || !query.trim()) return;

    const userMsg = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const result = queryAssistant(query, role, language);

      const botMsg = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: result?.data?.answer || 'I am looking into AICTE regulations for this query.',
        quickActions: result?.data?.quickActions || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: result?.data?.category,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 350);
  };

  const handleCopy = (id, text) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Voice dictation demo simulator
  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    setIsListening(true);
    const demoVoicePrompts =
      role === 'officer'
        ? [
            'How are the 12 AICTE Regional Offices monitored?',
            'What criteria place an institution into the High-Risk Queue?',
            'How does the Multi-Tier Trust Verification (T0 - T3) work?',
          ]
        : role === 'institution'
        ? [
            'How to submit new FDR on the portal?',
            'What is the mandatory AICTE Joint Lien clause wording?',
            'What is the FDR renewal timeline and grace period?',
          ]
        : [
            'Explain the Merkle Tree Cryptographic Audit Ledger',
            'How does the Core Banking / NeSL Gateway Simulator work?',
            'How are automated renewal alerts dispatched?',
          ];

    const picked = demoVoicePrompts[Math.floor(Math.random() * demoVoicePrompts.length)];

    let curr = '';
    let i = 0;
    const interval = setInterval(() => {
      if (i < picked.length) {
        curr += picked[i];
        setInputText(curr);
        i++;
      } else {
        clearInterval(interval);
        setIsListening(false);
      }
    }, 35);
  };

  const handleReset = () => {
    setMessages([
      {
        id: 'welcome-' + role + '-' + Date.now(),
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: personaConfig.welcomeText,
        actions: personaConfig.presetQueries,
      },
    ]);
  };

  return (
    <>
      {/* Floating Action Button (FAB) */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setTimeout(() => inputRef.current?.focus(), 150);
          }}
          className="fixed bottom-5 right-5 z-50 group flex items-center gap-2.5 p-3 sm:px-4 sm:py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 border border-amber-400"
          title={`Open ${personaConfig.title}`}
        >
          <div className="relative flex items-center justify-center">
            <Bot className="w-5 h-5 text-zinc-950" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-emerald-600" />
          </div>
          <span className="hidden sm:inline font-display text-xs tracking-tight">
            {role === 'officer' ? 'Scrutiny AI' : role === 'admin' ? 'Admin AI' : 'AICTE Sahayak'}
          </span>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 flex flex-col shadow-2xl rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121418] text-zinc-900 dark:text-zinc-100 overflow-hidden ${
            isExpanded
              ? 'inset-3 sm:inset-6'
              : 'bottom-4 right-4 w-[94vw] sm:w-[440px] h-[600px] max-h-[88vh]'
          }`}
          role="dialog"
        >
          {/* Header */}
          <div className="p-3.5 sm:p-4 bg-zinc-900 text-white border-b border-zinc-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-9 h-9 rounded-xl ${personaConfig.avatarBg} text-zinc-950 flex items-center justify-center font-bold shadow-xs flex-shrink-0`}
              >
                <Bot className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm tracking-tight truncate font-display">
                    {personaConfig.title}
                  </h3>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] font-semibold border ${personaConfig.badgeColor}`}
                  >
                    {personaConfig.badge}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                  {personaConfig.deskName}
                </p>
              </div>
            </div>

            {/* Header Controls (NO SPEAKER ICON) */}
            <div className="flex items-center gap-1 text-zinc-300">
              {/* Reset */}
              <button
                type="button"
                onClick={handleReset}
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors text-xs"
                title="Reset Conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Expand */}
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors text-xs hidden sm:block"
                title={isExpanded ? 'Restore Size' : 'Expand View'}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>

              {/* Close */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-rose-500/20 hover:text-rose-400 transition-colors text-xs"
                title="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sub-header: Role lock indicator & Language Toggle */}
          <div className="px-3.5 py-2 bg-zinc-50 dark:bg-[#16181e] border-b border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
              <span className="text-[11px] font-medium text-zinc-600 dark:text-zinc-300 truncate">
                Locked to <span className="font-semibold text-amber-500 capitalize">{role}</span> regulations
              </span>
            </div>

            {/* Language Toggle */}
            <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-md overflow-hidden text-[10px]">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 ${
                  language === 'en'
                    ? 'bg-zinc-800 text-white font-bold'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-2 py-0.5 ${
                  language === 'hi'
                    ? 'bg-zinc-800 text-white font-bold'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                हिंदी
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-4 text-xs">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5 animate-in fade-in duration-150`}
                >
                  <div
                    className={`max-w-[90%] rounded-2xl p-3.5 shadow-xs leading-relaxed ${
                      isUser
                        ? 'bg-amber-500 text-zinc-950 font-medium rounded-tr-xs'
                        : 'bg-zinc-50 dark:bg-[#181a20] text-zinc-900 dark:text-zinc-100 border border-zinc-200/90 dark:border-zinc-800 rounded-tl-xs'
                    }`}
                  >
                    {/* Bot category pill */}
                    {!isUser && msg.category && (
                      <span className="inline-block text-[10px] font-bold text-amber-500 dark:text-amber-400 mb-1.5 uppercase tracking-wider">
                        {msg.category}
                      </span>
                    )}

                    {/* Clean Markdown Rendering */}
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    ) : (
                      <MarkdownRenderer content={msg.text} />
                    )}

                    {/* Quick Link Actions */}
                    {!isUser && msg.quickActions && msg.quickActions.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-zinc-200/70 dark:border-zinc-800 flex flex-wrap gap-1.5">
                        {msg.quickActions.map((act, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              if (act.link) {
                                navigate(act.link);
                                if (!isExpanded) setIsOpen(false);
                              }
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white dark:bg-zinc-800 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-zinc-950 dark:hover:bg-amber-400 dark:hover:text-zinc-950 border border-zinc-200 dark:border-zinc-700 transition-colors shadow-2xs"
                          >
                            <span>{act.label}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Message Meta & Action Bar */}
                  <div className="flex items-center gap-2 px-1 text-[10px] text-zinc-400">
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="hover:text-zinc-200 flex items-center gap-0.5"
                          title="Copy Answer"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setFeedbackMap((prev) => ({ ...prev, [msg.id]: 'up' }))
                          }
                          className={`hover:text-emerald-400 ${
                            feedbackMap[msg.id] === 'up' ? 'text-emerald-400 font-bold' : ''
                          }`}
                          title="Helpful"
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setFeedbackMap((prev) => ({ ...prev, [msg.id]: 'down' }))
                          }
                          className={`hover:text-rose-400 ${
                            feedbackMap[msg.id] === 'down' ? 'text-rose-400 font-bold' : ''
                          }`}
                          title="Not Helpful"
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Suggested Query Buttons on Welcome Message */}
                  {!isUser && msg.actions && (
                    <div className="w-full space-y-1.5 pt-1.5">
                      <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                        Suggested Queries ({personaConfig.badge}):
                      </p>
                      <div className="flex flex-col gap-1.5">
                        {msg.actions.map((item, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSend(item.query)}
                            className="text-left py-2 px-3 rounded-xl text-xs bg-zinc-50 dark:bg-[#181a20] hover:bg-amber-500/10 hover:border-amber-500/40 dark:hover:bg-amber-500/10 dark:hover:border-amber-500/30 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 transition-all flex items-center justify-between group"
                          >
                            <span>{item.label}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-zinc-400 text-xs pl-2">
                <Bot className="w-4 h-4 text-amber-500 animate-bounce" />
                <span>AICTE Sentinel is reasoning regulations...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-zinc-50 dark:bg-[#16181e] border-t border-zinc-200 dark:border-zinc-800">
            {isListening && (
              <div className="mb-2 p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[11px] flex items-center justify-between">
                <span className="flex items-center gap-1.5 animate-pulse">
                  <Mic className="w-3.5 h-3.5" /> Listening to spoken query...
                </span>
                <button
                  type="button"
                  onClick={toggleListening}
                  className="text-[10px] underline hover:text-amber-300"
                >
                  Cancel
                </button>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              {/* Voice dictation demo button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2 rounded-xl transition-colors ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700'
                }`}
                title="Voice Dictation Simulator"
              >
                <Mic className="w-4 h-4" />
              </button>

              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={personaConfig.placeholder}
                className="flex-1 py-2 px-3 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#1a1d24] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/50"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2 rounded-xl bg-amber-500 text-zinc-950 font-bold hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
                title="Send Query"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-zinc-400 px-1">
              <span>AICTE Approval Process Handbook Guidelines</span>
              {role === 'officer' && (
                <button
                  type="button"
                  onClick={() => handleSend('How are the 12 AICTE Regional Offices monitored?')}
                  className="hover:text-amber-500 underline"
                >
                  12 Regional Offices
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
