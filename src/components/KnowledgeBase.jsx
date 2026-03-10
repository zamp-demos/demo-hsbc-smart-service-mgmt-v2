import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowUp, ArrowLeft, History, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { chatWithKnowledgeBase } from '../services/geminiService';
import VersionHistoryPanel from './VersionHistoryPanel';
import DiffViewModal from './DiffViewModal';

// Import all knowledge base contents
import kbContent from '../data/knowledgeBase.md?raw';

// ─── Thread C: Hard-coded demo Q&A ───────────────────────────────────
const THREAD_C_QA = [
    {
        question: "How does Pace handle an email when it first arrives?",
        answer: `The moment an email lands in the Commercial Cards inbox, Pace begins a structured intake process before doing anything else.

It reads the email and identifies the sender. It then cross-references that sender's email address and domain against the CRM — checking that the person who wrote in is the registered Programme Administrator for the programme they're writing about. If the domain matches, the name matches, and the programme is active, the PA is verified. Only then does Pace treat the email as an authorised instruction.

Once the PA is verified, Pace reads the body of the email and extracts every distinct request — not just the first one. A single email can contain two, three, or more separate asks buried in natural language. Pace classifies each one: is this a decline investigation? A spend data request? A limit change? A name update? Each request type maps to a different set of systems and a different policy check.

By the time Pace has finished the intake — typically within 15 to 20 seconds of the email arriving — it has a verified sender, a structured list of classified requests, the assigned SM identified, a CRM case created, and the relevant programme policy loaded. Then it starts working.`,
        suggestedFollowUps: [
            "What if the email comes from someone Pace doesn't recognise?",
            "How does Pace classify different request types from one email?",
            "What systems does Pace check during the intake process?"
        ]
    },
    {
        question: "What if the email comes from someone Pace doesn't recognise?",
        answer: `That is one of the conditions that immediately pauses Pace's processing and flags the case for SM review.

If the sender's email address doesn't match the registered PA record in the CRM — whether that's a different person, an unregistered domain, or a domain that doesn't match the programme — Pace does not proceed. It does not attempt to reason around the mismatch. It creates a case, logs the incoming email, flags the verification failure with a precise explanation of what didn't match, and routes it directly to the assigned SM.

The reason for this is straightforward. Every action Pace takes in a case — limit changes, travel activations, name updates — is executed on the authority of the PA instruction. If that authority can't be verified, the entire chain that follows is built on an unverified instruction. The risk isn't just a process error; it's a potential social engineering attempt or an impersonation. Pace treats an unverifiable sender the same way a careful SM would: stop, flag, escalate.

The SM then decides whether to call the client directly, request re-submission from a verified address, or handle the case manually. Pace stays out of it until the identity question is resolved.`,
        suggestedFollowUps: [
            "Once you escalate something to the SM, what exactly do they get?",
            "How does Pace handle a domain that partially matches?",
            "What happens after the SM resolves the identity question?"
        ]
    },
    {
        question: "Once you escalate something to the SM, what exactly do they get?",
        answer: `When Pace escalates, it never hands the SM a problem and walks away. It hands them a decision — fully prepared, with everything they need to make it in seconds.

The escalation prompt contains five things. First, a plain-language summary of what the case is and what triggered the escalation — written for someone who hasn't seen the email and needs to get up to speed in 30 seconds. Second, the complete investigation findings to that point: every system Pace has queried, every piece of data it retrieved, every anomaly it detected, every policy rule it applied. Third, two or three clearly labelled options for how to proceed — each one described in terms of what it does, not just what it says. Fourth, a recommended option with the reasoning behind it. Fifth, any regulatory flags — if one of the options carries POCA risk, or a legal exposure, or a compliance constraint, that is called out explicitly against that option.

The SM reads, chooses, confirms. In today's cases, that took eight seconds.

The design principle behind this is deliberate. The SM's judgment is the most valuable and the most scarce resource in the process. Pace is built to protect that resource — to make sure that when the SM is asked to decide, they are deciding on a fully understood situation, not scrambling to catch up on one.`,
        suggestedFollowUps: [
            "How does Pace handle an email when it first arrives?",
            "How does Pace ensure regulatory compliance during escalation?",
            "What metrics does Pace track across cases?"
        ]
    }
];

function findThreadCMatch(input) {
    const normalised = input.trim().toLowerCase().replace(/[?.,!'"]/g, '');
    for (const entry of THREAD_C_QA) {
        const entryNorm = entry.question.toLowerCase().replace(/[?.,!'"]/g, '');
        // Exact or close-enough match (substring both ways)
        if (normalised === entryNorm || entryNorm.includes(normalised) || normalised.includes(entryNorm)) {
            return entry;
        }
        // Also match if 80%+ of words overlap
        const inputWords = new Set(normalised.split(/\s+/));
        const entryWords = entryNorm.split(/\s+/);
        const overlap = entryWords.filter(w => inputWords.has(w)).length;
        if (overlap / entryWords.length >= 0.75) {
            return entry;
        }
    }
    return null;
}

// ─── Initial suggested questions (shown when chat first opens) ───────
const INITIAL_SUGGESTIONS = [
    "How does Pace handle an email when it first arrives?",
    "What if the email comes from someone Pace doesn't recognise?",
    "Once you escalate something to the SM, what exactly do they get?"
];

// ─── Chat Message Component ──────────────────────────────────────────
const ChatMessage = ({ msg, suggestions, onSuggestionClick }) => {
    const isUser = msg.role === 'user';
    return (
        <div className="mb-6">
            <div className="flex gap-3 w-full">
                <div className={`w-7 h-7 rounded flex items-center justify-center flex-shrink-0 mt-0.5 ${isUser ? 'bg-[#FFE2D1]' : 'bg-[#2445ff]'}`}>
                    {isUser ? (
                        <span className="text-[#AF521F] text-[11px] font-bold font-sans">U</span>
                    ) : (
                        <img src="/adam-icon.svg" alt="Pace" className="w-4 h-4 invert brightness-0" />
                    )}
                </div>
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <span className="text-[13px] font-semibold text-[#171717]">{isUser ? 'Umashankar' : 'Pace'}</span>
                    <div className="text-[13px] text-[#3a3a3a] leading-[1.7] break-words whitespace-pre-wrap">
                        {msg.content}
                    </div>
                    {/* Suggested follow-ups below Pace's answer */}
                    {!isUser && suggestions && suggestions.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {suggestions.map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => onSuggestionClick(s)}
                                    className="px-3 py-1.5 text-[12px] text-[#555] bg-white border border-[#e0e0e0] rounded-full hover:border-[#999] hover:text-[#171717] transition-all cursor-pointer"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Main Component ──────────────────────────────────────────────────
const KnowledgeBase = () => {
    const knowledgeBaseContent = kbContent;

    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [highlightText, setHighlightText] = useState(null);
    const [viewingVersion, setViewingVersion] = useState(null);
    const [displayContent, setDisplayContent] = useState(knowledgeBaseContent);
    const [latestVersion, setLatestVersion] = useState(null);
    const [showDiffModal, setShowDiffModal] = useState(false);
    const [isDiffLoading, setIsDiffLoading] = useState(false);
    const [diffData, setDiffData] = useState(null);
    // Track suggestions per message index
    const [messageSuggestions, setMessageSuggestions] = useState({});

    const messagesEndRef = useRef(null);
    const contentRef = useRef(null);
    const chatInputRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    useEffect(() => {
        if (showChat && chatInputRef.current) {
            chatInputRef.current.focus();
        }
    }, [showChat]);

    // Fetch latest version on mount
    useEffect(() => {
        const fetchLatest = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
                const res = await fetch(`${API_URL}/api/kb/versions`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.versions?.length > 0) setLatestVersion(data.versions[0]);
                }
            } catch (e) { /* silent */ }
        };
        fetchLatest();
    }, []);

    // ─── Send message handler with Thread C intercept ────────────────
    const handleSendMessage = async () => {
        const text = inputValue.trim();
        if (!text || isLoading) return;

        // Switch to chat view on first message
        if (!showChat) setShowChat(true);

        const userMsg = { role: 'user', content: text };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInputValue('');
        setIsLoading(true);

        try {
            // Thread C intercept — check for hard-coded demo answer
            const match = findThreadCMatch(text);
            if (match) {
                // Simulate brief typing delay for realism
                await new Promise(r => setTimeout(r, 3000));
                const assistantMsg = { role: 'assistant', content: match.answer };
                const updatedMessages = [...newMessages, assistantMsg];
                setMessages(updatedMessages);
                // Store suggestions for this assistant message index
                setMessageSuggestions(prev => ({
                    ...prev,
                    [updatedMessages.length - 1]: match.suggestedFollowUps
                }));
            } else {
                // Fall through to Gemini API
                const response = await chatWithKnowledgeBase(text, knowledgeBaseContent, newMessages);
                const assistantMsg = { role: 'assistant', content: response };
                setMessages([...newMessages, assistantMsg]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            const errorMsg = { role: 'assistant', content: 'Sorry, I couldn\'t process that. Please try again.' };
            setMessages([...newMessages, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setInputValue(suggestion);
        // Auto-send after a tick
        setTimeout(() => {
            setInputValue('');
            // Manually trigger send with the suggestion text
            const text = suggestion.trim();
            if (!text) return;

            const userMsg = { role: 'user', content: text };
            const newMessages = [...messages, userMsg];
            setMessages(newMessages);
            setIsLoading(true);

            const match = findThreadCMatch(text);
            if (match) {
                setTimeout(() => {
                    const assistantMsg = { role: 'assistant', content: match.answer };
                    const updatedMessages = [...newMessages, assistantMsg];
                    setMessages(updatedMessages);
                    setMessageSuggestions(prev => ({
                        ...prev,
                        [updatedMessages.length - 1]: match.suggestedFollowUps
                    }));
                    setIsLoading(false);
                }, 3000);
            } else {
                chatWithKnowledgeBase(text, knowledgeBaseContent, newMessages)
                    .then(response => {
                        setMessages([...newMessages, { role: 'assistant', content: response }]);
                    })
                    .catch(() => {
                        setMessages([...newMessages, { role: 'assistant', content: 'Sorry, I couldn\'t process that.' }]);
                    })
                    .finally(() => setIsLoading(false));
            }
        }, 50);
    };

    // ─── Render ──────────────────────────────────────────────────────
    return (
        <div className="flex h-full bg-[#FAFAFA] font-sans">
            <div className="flex flex-col w-full h-full">

                {/* ══════ CHAT VIEW ══════ */}
                {showChat ? (
                    <div className="flex flex-col h-full">
                        {/* Chat header */}
                        <div className="flex items-center gap-3 px-8 py-4 border-b border-[#ebebeb] bg-white">
                            <button
                                onClick={() => setShowChat(false)}
                                className="flex items-center gap-1.5 text-[13px] text-[#666] hover:text-[#171717] transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Knowledge Base</span>
                            </button>
                            <div className="h-4 w-px bg-[#e0e0e0]" />
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded bg-[#2445ff] flex items-center justify-center">
                                    <img src="/adam-icon.svg" alt="Pace" className="w-3.5 h-3.5 invert brightness-0" />
                                </div>
                                <span className="text-[14px] font-medium text-[#171717]">Pace</span>
                            </div>
                        </div>

                        {/* Messages area */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="max-w-[720px] mx-auto px-6 py-8">
                                {messages.map((msg, i) => (
                                    <ChatMessage
                                        key={i}
                                        msg={msg}
                                        suggestions={messageSuggestions[i] && i === messages.length - 1 ? messageSuggestions[i] : null}
                                        onSuggestionClick={handleSuggestionClick}
                                    />
                                ))}
                                {isLoading && (
                                    <div className="flex gap-3 mb-6">
                                        <div className="w-7 h-7 rounded bg-[#2445ff] flex items-center justify-center flex-shrink-0">
                                            <img src="/adam-icon.svg" alt="Pace" className="w-4 h-4 invert brightness-0" />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[13px] font-semibold text-[#171717]">Pace</span>
                                            <div className="flex gap-1 py-2">
                                                <div className="w-1.5 h-1.5 bg-[#999] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <div className="w-1.5 h-1.5 bg-[#999] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <div className="w-1.5 h-1.5 bg-[#999] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        {/* Chat input */}
                        <div className="px-6 pb-6 pt-2">
                            <div className="max-w-[720px] mx-auto">
                                <div className="bg-white border border-[#e0e0e0] rounded-2xl shadow-sm p-1 flex items-center">
                                    <input
                                        ref={chatInputRef}
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Ask a question..."
                                        className="flex-1 px-4 py-3 text-[14px] text-[#171717] placeholder-[#8f8f8f] focus:outline-none bg-transparent"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!inputValue.trim() || isLoading}
                                        className={`mr-1 p-2 rounded-lg transition-all ${inputValue.trim() ? 'bg-[#171717] text-white' : 'bg-transparent text-[#ddd]'}`}
                                    >
                                        <ArrowUp className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ══════ KB VIEW ══════ */
                    <div className="flex flex-col h-full relative">
                        <div className="flex-1 overflow-y-auto px-10 pt-10 pb-32">
                            <div className="max-w-[900px] mx-auto">
                                {/* Header */}
                                <div className="mb-2">
                                    <div className="flex items-center justify-between">
                                        <h1 className="text-[32px] font-bold text-[#171717] tracking-tight">Knowledge Base</h1>
                                        <div className="flex items-center gap-2">
                                            {latestVersion && (
                                                <button
                                                    onClick={() => setIsHistoryOpen(true)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] text-[#666] hover:text-[#171717] border border-[#e0e0e0] rounded-lg hover:border-[#bbb] transition-all"
                                                >
                                                    <History className="w-3.5 h-3.5" />
                                                    <span>History</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    {viewingVersion && (
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-[12px] text-[#888] bg-[#f0f0f0] px-2 py-0.5 rounded">
                                                Viewing: {viewingVersion.name}
                                            </span>
                                            <button
                                                onClick={() => { setViewingVersion(null); setDisplayContent(knowledgeBaseContent); setHighlightText(null); }}
                                                className="text-[12px] text-[#2445ff] hover:underline"
                                            >
                                                Back to latest
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="h-px bg-[#ebebeb] w-full mb-6" />

                                {/* Markdown Content */}
                                <div className="kb-content" ref={contentRef}>
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            p: ({ node, ...props }) => {
                                                const content = props.children;
                                                if (typeof content === 'string' && highlightText && content.includes(highlightText)) {
                                                    const parts = content.split(new RegExp(`(${highlightText})`, 'gi'));
                                                    return (
                                                        <p {...props}>
                                                            {parts.map((part, i) =>
                                                                part.toLowerCase() === highlightText.toLowerCase() ?
                                                                    <mark key={i} className="bg-yellow-200 px-1 rounded">{part}</mark> : part
                                                            )}
                                                        </p>
                                                    );
                                                }
                                                return <p {...props} />;
                                            },
                                            li: ({ node, ...props }) => {
                                                const processContent = (items) => {
                                                    return React.Children.map(items, item => {
                                                        if (typeof item === 'string' && highlightText && item.includes(highlightText)) {
                                                            const parts = item.split(new RegExp(`(${highlightText})`, 'gi'));
                                                            return parts.map((part, i) =>
                                                                part.toLowerCase() === highlightText.toLowerCase() ?
                                                                    <mark key={i} className="bg-yellow-200 px-1 rounded">{part}</mark> : part
                                                            );
                                                        }
                                                        return item;
                                                    });
                                                };
                                                return <li {...props}>{processContent(props.children)}</li>;
                                            }
                                        }}
                                    >
                                        {displayContent}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>

                        {/* Floating chat input at bottom of KB */}
                        <div className="absolute bottom-8 left-0 right-0 flex justify-center px-6 pointer-events-none z-10">
                            <div className="max-w-[600px] w-full bg-white border border-[#e0e0e0] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-1 flex items-center pointer-events-auto">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Ask Pace about this knowledge base..."
                                    className="flex-1 px-4 py-3 text-[14px] text-[#171717] placeholder-[#8f8f8f] focus:outline-none bg-transparent"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!inputValue.trim() || isLoading}
                                    className={`mr-1 p-2 rounded-lg transition-all ${inputValue.trim() ? 'bg-[#171717] text-white' : 'bg-transparent text-[#ddd]'}`}
                                >
                                    <ArrowUp className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <VersionHistoryPanel
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
                onRestore={() => {
                    setIsHistoryOpen(false);
                    window.location.reload();
                }}
                onViewChanges={async (version, index, allVersions) => {
                    const previousVersion = allVersions[index + 1];
                    if (!previousVersion) return;

                    setShowDiffModal(true);
                    setIsDiffLoading(true);
                    setDiffData({
                        currentVersion: version,
                        previousVersion: previousVersion,
                        current: '',
                        previous: ''
                    });

                    handleSelectVersion(version);

                    try {
                        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
                        const [currentRes, previousRes] = await Promise.all([
                            fetch(`${API_URL}/api/kb/content?versionId=${version.id}`),
                            fetch(`${API_URL}/api/kb/content?versionId=${previousVersion.id}`)
                        ]);

                        if (!currentRes.ok || !previousRes.ok) throw new Error('Failed to fetch version content');

                        const currentData = await currentRes.json();
                        const previousData = await previousRes.json();

                        setDiffData({
                            current: currentData.content,
                            previous: previousData.content,
                            currentVersion: version,
                            previousVersion: previousVersion
                        });
                        setIsDiffLoading(false);
                    } catch (error) {
                        console.error('Error fetching versions for diff:', error);
                        setIsDiffLoading(false);
                        setShowDiffModal(false);
                    }
                }}
                onSelectVersion={(version) => {
                    setIsHistoryOpen(false);
                    handleSelectVersion(version);
                }}
            />

            {showDiffModal && diffData && (
                <DiffViewModal
                    diffData={diffData}
                    isLoading={isDiffLoading}
                    onClose={() => {
                        setShowDiffModal(false);
                        setDiffData(null);
                    }}
                />
            )}
        </div>
    );

    async function handleSelectVersion(version) {
        setViewingVersion(version);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            const response = await fetch(`${API_URL}/api/kb/content?versionId=${version.id}`);
            if (response.ok) {
                const data = await response.json();
                setDisplayContent(data.content || knowledgeBaseContent);

                if (version.changes && version.changes.length > 0) {
                    const changeText = version.changes[0];
                    let highlightCandidate = changeText;
                    if (changeText.includes(':')) {
                        highlightCandidate = changeText.split(':')[1].trim();
                    }
                    if (highlightCandidate.length > 60) {
                        highlightCandidate = highlightCandidate.substring(0, 60);
                    }
                    setHighlightText(highlightCandidate);

                    setTimeout(() => {
                        if (contentRef.current) {
                            const markElement = contentRef.current.querySelector('mark');
                            if (markElement) {
                                markElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                markElement.style.transition = 'background-color 0.5s';
                                const originalColor = markElement.style.backgroundColor;
                                markElement.style.backgroundColor = '#fde047';
                                setTimeout(() => {
                                    markElement.style.backgroundColor = originalColor;
                                }, 1000);
                            }
                        }
                    }, 300);
                }
            }
        } catch (error) {
            console.error('Error viewing version:', error);
        }
    }
};

export default KnowledgeBase;
