import React, { useState } from 'react';
import {
  Bot,
  Send,
  Building2,
  ShieldCheck,
  Lock,
  Search,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  Landmark,
} from 'lucide-react';
import { ASSISTANT_KNOWLEDGE_BASE, queryAssistant } from '../data/assistantKnowledge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';

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

function MarkdownRenderer({ content }) {
  if (!content) return null;

  const blocks = content.split('\n\n');

  return (
    <div className="space-y-2 text-xs leading-relaxed text-zinc-800 dark:text-zinc-200">
      {blocks.map((block, bIdx) => {
        const trimmed = block.trim();

        // 1. Table
        if (trimmed.includes('|') && trimmed.includes('\n')) {
          const lines = trimmed.split('\n').filter((l) => l.trim().startsWith('|'));
          if (lines.length >= 2) {
            const headerCells = lines[0].split('|').map((c) => c.trim()).filter(Boolean);
            const dataRows = lines.slice(2);
            return (
              <div key={bIdx} className="my-2 overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
                <table className="w-full text-left text-[11px] divide-y divide-zinc-200 dark:divide-zinc-800">
                  <thead className="bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 font-semibold">
                    <tr>
                      {headerCells.map((h, i) => (
                        <th key={i} className="py-1 px-2.5">{parseInlineMarkdown(h)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60 bg-white dark:bg-[#16181e]">
                    {dataRows.map((row, rIdx) => {
                      const cells = row.split('|').map((c) => c.trim()).filter(Boolean);
                      return (
                        <tr key={rIdx}>
                          {cells.map((cell, cIdx) => (
                            <td key={cIdx} className="py-1 px-2.5">{parseInlineMarkdown(cell)}</td>
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

        // 2. Headings
        if (trimmed.startsWith('#')) {
          const title = trimmed.replace(/^#+\s*/, '');
          return (
            <h4 key={bIdx} className="font-bold text-xs sm:text-sm text-amber-600 dark:text-amber-400 mt-2 mb-1">
              {parseInlineMarkdown(title)}
            </h4>
          );
        }

        // 3. Blockquotes
        if (trimmed.startsWith('>')) {
          const quoteLines = trimmed.split('\n').map((l) => l.replace(/^>\s*/, '')).join(' ');
          return (
            <div key={bIdx} className="p-2 rounded-lg bg-amber-500/10 border-l-2 border-amber-500 text-zinc-700 dark:text-zinc-300 text-[11px] my-1">
              {parseInlineMarkdown(quoteLines)}
            </div>
          );
        }

        // 4. Bullet lists
        const lines = trimmed.split('\n');
        const isList = lines.every((l) => /^\s*([*•\-+]|\d+\.)\s+/.test(l));

        if (isList) {
          return (
            <ul key={bIdx} className="space-y-1 my-1 pl-0.5">
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

        // Mixed paragraphs with bullets
        if (lines.length > 1 && lines.some((l) => /^\s*([*•\-+]|\d+\.)\s+/.test(l))) {
          return (
            <div key={bIdx} className="space-y-1 my-1">
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
                return <p key={lIdx} className="leading-relaxed">{parseInlineMarkdown(line)}</p>;
              })}
            </div>
          );
        }

        return <p key={bIdx} className="leading-relaxed">{parseInlineMarkdown(trimmed)}</p>;
      })}
    </div>
  );
}

export default function AssistantPage() {
  const navigate = useNavigate();
  const { role: authRole } = useAuth();

  // STRICTLY locked to the active user's authenticated role
  const role = authRole === 'admin' ? 'admin' : authRole === 'institution' ? 'institution' : 'officer';

  const [searchQuery, setSearchQuery] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  // Filter knowledge base strictly by authenticated user's role
  const filteredKnowledge = ASSISTANT_KNOWLEDGE_BASE.filter((item) => {
    const matchRole = item.role === role;
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.keywords.some((k) => k.toLowerCase().includes(q));
    return matchRole && matchSearch;
  });

  const handleAsk = (text) => {
    const q = text || chatInput;
    if (!q || !q.trim()) return;

    const userEntry = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: q.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const res = queryAssistant(q, role);
    const botEntry = {
      id: 'bot-' + Date.now(),
      sender: 'bot',
      title: res?.data?.title,
      text: res?.data?.answer,
      actions: res?.data?.quickActions || [],
      category: res?.data?.category,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatLog((prev) => [botEntry, userEntry, ...prev]);
    setChatInput('');
  };

  const handleCopy = (id, text) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const roleTitle =
    role === 'officer'
      ? 'Scrutiny Officer Regulatory Intelligence'
      : role === 'admin'
      ? 'Vault Governance & Cryptographic Ledger Sentinel'
      : 'Institution FDR Compliance Portal';

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner (Clean institutional design - no neon glow) */}
      <div className="rounded-2xl bg-white dark:bg-[#131519] border border-zinc-200/90 dark:border-zinc-800/80 p-6 sm:p-7 text-zinc-900 dark:text-zinc-100 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
              <Bot className="w-3.5 h-3.5 text-amber-500" />
              <span>{roleTitle}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 font-display">
              {role === 'officer'
                ? 'Officer Scrutiny AI Intelligence'
                : role === 'admin'
                ? 'System Admin Governance AI'
                : 'Institution FDR AI Assistant'}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
              {role === 'officer'
                ? 'Specialized scrutiny guidance on 12 Regional Directorates, Tier-1 to Tier-3 bank confirmation, risk thresholds, and release authorization workflows.'
                : role === 'admin'
                ? 'Administrative console for Merkle audit ledger hashing, Core Banking sandbox integration, and compliance alert schedule triggers.'
                : 'Step-by-step regulatory guidance for technical institutions regarding fixed deposit submissions, joint lien clauses, renewal schedules, and NOC requests.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {role === 'officer' && (
              <button
                onClick={() => navigate('/officer/regional-offices')}
                className="px-3.5 py-2 rounded-xl text-xs font-medium border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-all flex items-center gap-2"
              >
                <Landmark className="w-4 h-4 text-amber-500" />
                <span>12 Regional Offices</span>
              </button>
            )}
            <button
              onClick={() => navigate('/mock-bank')}
              className="px-3.5 py-2 rounded-xl text-xs font-medium border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-all flex items-center gap-2"
            >
              <span>Bank Simulator</span>
              <ArrowRight className="w-3.5 h-3.5 text-sky-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Role lock status strip (No cross-switching allowed) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-[#131519] border border-zinc-200/90 dark:border-zinc-800/80 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Active Workspace:</span>
          <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-amber-500 text-zinc-950 flex items-center gap-1.5 capitalize">
            {role === 'officer' ? (
              <ShieldCheck className="w-3.5 h-3.5" />
            ) : role === 'admin' ? (
              <Lock className="w-3.5 h-3.5" />
            ) : (
              <Building2 className="w-3.5 h-3.5" />
            )}
            <span>{role} Desk</span>
          </span>
          <span className="text-xs text-zinc-400 hidden sm:inline">
            (Regulations strictly tailored to your role credentials)
          </span>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px] flex-1 max-w-sm">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${role} regulations, clauses, guidelines...`}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-[#1a1d24] text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500/50"
          />
        </div>
      </div>

      {/* Main Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Role-Specific Knowledge Cards */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-500" />
              Role Dossier ({filteredKnowledge.length} Topics for {role.toUpperCase()})
            </h2>
            <span className="text-xs text-zinc-400">Click to ask AI assistant</span>
          </div>

          <div className="space-y-3">
            {filteredKnowledge.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-white dark:bg-[#131519] border border-zinc-200/90 dark:border-zinc-800/80 hover:border-amber-500/40 dark:hover:border-amber-500/30 transition-all shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-amber-500 dark:text-amber-400 uppercase tracking-wider">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                      {item.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAsk(item.title)}
                    className="p-1.5 rounded-lg bg-zinc-100 hover:bg-amber-500 hover:text-zinc-950 dark:bg-zinc-800 dark:hover:bg-amber-400 dark:hover:text-zinc-950 transition-colors text-xs flex items-center gap-1 font-medium flex-shrink-0"
                    title="Ask AI this question"
                  >
                    <span>Ask AI</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="mt-3">
                  <MarkdownRenderer content={item.answer} />
                </div>

                {item.quickActions && item.quickActions.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/60 flex flex-wrap gap-2">
                    {item.quickActions.map((act, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => navigate(act.link)}
                        className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <span>{act.label}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Interactive Terminal */}
        <div className="lg:col-span-5 flex flex-col h-[700px] rounded-2xl bg-white dark:bg-[#131519] border border-zinc-200/90 dark:border-zinc-800/80 shadow-xs overflow-hidden sticky top-20">
          <div className="p-3.5 bg-zinc-50 dark:bg-[#181a20] border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-amber-500" />
              <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                Interactive {role.toUpperCase()} AI Terminal
              </span>
            </div>
            <span className="text-[10px] text-emerald-500 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Ready
            </span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {chatLog.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-400">
                <Bot className="w-10 h-10 text-amber-500/40 mb-2" />
                <p className="font-bold text-zinc-700 dark:text-zinc-300">
                  Ask Any AICTE {role.toUpperCase()} Regulatory Question
                </p>
                <p className="text-xs max-w-xs mt-1 text-zinc-400">
                  Type your inquiry below or click on any topic card on the left.
                </p>
              </div>
            ) : (
              chatLog.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                  >
                    <div
                      className={`max-w-[90%] rounded-2xl p-3.5 shadow-xs leading-relaxed ${
                        isUser
                          ? 'bg-amber-500 text-zinc-950 font-semibold'
                          : 'bg-zinc-50 dark:bg-[#181a20] text-zinc-800 dark:text-zinc-200 border border-zinc-200/90 dark:border-zinc-800'
                      }`}
                    >
                      {!isUser && msg.category && (
                        <span className="text-[10px] font-bold text-amber-500 block mb-1">
                          {msg.category}
                        </span>
                      )}
                      {isUser ? (
                        <p className="whitespace-pre-wrap text-xs">{msg.text}</p>
                      ) : (
                        <MarkdownRenderer content={msg.text} />
                      )}

                      {!isUser && msg.actions && msg.actions.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-1.5">
                          {msg.actions.map((act, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => navigate(act.link)}
                              className="px-2 py-0.5 rounded text-[10px] font-bold bg-white dark:bg-zinc-800 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-zinc-950 transition-colors border border-zinc-200 dark:border-zinc-700"
                            >
                              {act.label} →
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-zinc-400 px-1">{msg.time}</span>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-3 bg-zinc-50 dark:bg-[#16181e] border-t border-zinc-200 dark:border-zinc-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAsk();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={`Ask about ${role} regulations, procedures, rules...`}
                className="flex-1 py-2 px-3 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#1a1d24] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/50"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="p-2 rounded-xl bg-amber-500 text-zinc-950 font-bold hover:bg-amber-400 disabled:opacity-40 transition-colors shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
