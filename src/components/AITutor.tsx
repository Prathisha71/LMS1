import React, { useState, useRef, useEffect } from 'react';
import { tutorAPI } from '../services/api';
import { 
  Send, Sparkles, Trash2, Brain, 
  MessageSquare, BookOpen, AlertCircle, ArrowRight 
} from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const AITutor: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested prompts for student quickstart
  const suggestedPrompts = [
    {
      title: "Matrices & Determinants",
      prompt: "Can you explain how to find the inverse of a 2x2 matrix step-by-step with an example?",
      icon: "📐"
    },
    {
      title: "Chemical Reactions",
      prompt: "How do I balance a chemical equation? Explain the steps using the combustion of methane.",
      icon: "🧪"
    },
    {
      title: "Study Tips",
      prompt: "Give me a 30-minute revision plan for the Metallurgy chapter.",
      icon: "💡"
    }
  ];

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage: Message = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      // Pass both the current question and conversational history to the API
      const response = await tutorAPI.askQuestion(textToSend, messages);
      const modelMessage: Message = { role: 'model', text: response.answer };
      setMessages(prev => [...prev, modelMessage]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please check if the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
    setError(null);
  };

  // Basic function to format basic markdown elements (bold, code blocks, lists)
  const formatMessage = (text: string) => {
    // Simple parser for demonstration; can be expanded.
    return text.split('\n').map((line, idx) => {
      // Code blocks
      if (line.trim().startsWith('```')) {
        return null; // Handle separately if full block parsing is needed
      }
      
      // Headers
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="text-sm font-bold text-slate-900 dark:text-white mt-3 mb-1">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={idx} className="text-base font-extrabold text-slate-900 dark:text-white mt-4 mb-2">{line.replace('## ', '')}</h3>;
      }
      if (line.startsWith('# ')) {
        return <h2 key={idx} className="text-lg font-black text-slate-900 dark:text-white mt-4 mb-2">{line.replace('# ', '')}</h2>;
      }

      // Bullet points
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const itemText = line.replace(/^[\s]*[-*]\s+/, '');
        return (
          <li key={idx} className="ml-4 list-disc text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-1">
            {parseInlineMarkdown(itemText)}
          </li>
        );
      }

      // Ordered list items
      if (/^\d+\.\s+/.test(line.trim())) {
        const itemText = line.replace(/^\d+\.\s+/, '');
        return (
          <li key={idx} className="ml-4 list-decimal text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-1">
            {parseInlineMarkdown(itemText)}
          </li>
        );
      }

      return (
        <p key={idx} className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-2.5">
          {parseInlineMarkdown(line)}
        </p>
      );
    });
  };

  // Helper to parse bold (**text**) and code (`code`) inline
  const parseInlineMarkdown = (text: string) => {
    const boldPattern = /\*\*(.*?)\*\*/g;
    const codePattern = /`(.*?)`/g;
    
    let parts: React.ReactNode[] = [text];
    
    // Parse bold
    let hasBold = false;
    const boldResult: React.ReactNode[] = [];
    parts.forEach(part => {
      if (typeof part === 'string') {
        const matches = [...part.matchAll(boldPattern)];
        if (matches.length > 0) {
          hasBold = true;
          let lastIndex = 0;
          matches.forEach((match, index) => {
            const matchIndex = match.index || 0;
            if (matchIndex > lastIndex) {
              boldResult.push(part.substring(lastIndex, matchIndex));
            }
            boldResult.push(<strong key={`b-${index}`} className="font-bold text-slate-900 dark:text-white">{match[1]}</strong>);
            lastIndex = matchIndex + match[0].length;
          });
          if (lastIndex < part.length) {
            boldResult.push(part.substring(lastIndex));
          }
        } else {
          boldResult.push(part);
        }
      } else {
        boldResult.push(part);
      }
    });

    if (hasBold) parts = boldResult;

    // Parse inline code
    const codeResult: React.ReactNode[] = [];
    parts.forEach(part => {
      if (typeof part === 'string') {
        const matches = [...part.matchAll(codePattern)];
        if (matches.length > 0) {
          let lastIndex = 0;
          matches.forEach((match, index) => {
            const matchIndex = match.index || 0;
            if (matchIndex > lastIndex) {
              codeResult.push(part.substring(lastIndex, matchIndex));
            }
            codeResult.push(
              <code key={`c-${index}`} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 font-mono text-[11px] text-brand-violet font-semibold">
                {match[1]}
              </code>
            );
            lastIndex = matchIndex + match[0].length;
          });
          if (lastIndex < part.length) {
            codeResult.push(part.substring(lastIndex));
          }
        } else {
          codeResult.push(part);
        }
      } else {
        codeResult.push(part);
      }
    });

    return codeResult.length > 0 ? codeResult : parts;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] font-sans space-y-4 max-w-5xl mx-auto">
      {/* Bot Header */}
      <div className="flex items-center justify-between p-4 glass-card border-slate-200 dark:border-white/5 bg-gradient-to-r from-slate-50/50 via-white/50 to-slate-50/50 dark:from-slate-950/40 dark:via-brand-navy-light/20 dark:to-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-royal to-brand-violet flex items-center justify-center text-white shadow-lg shadow-brand-royal/10">
            <Brain className="w-5.5 h-5.5" />
          </div>
          <div className="text-left">
            <h2 className="text-base font-extrabold font-display text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
              AI Tutor Bot
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Online
              </span>
            </h2>
            <p className="text-[10px] text-slate-500 dark:text-slate-500">Encouraging & expert curriculum support</p>
          </div>
        </div>
        
        {messages.length > 0 && (
          <button 
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors border border-rose-500/20 font-semibold"
            title="Clear Chat History"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Chat</span>
          </button>
        )}
      </div>

      {/* Main Chat Workspace */}
      <div className="flex-1 glass-card border-slate-200 dark:border-white/5 p-4 overflow-y-auto flex flex-col justify-between space-y-4 min-h-0">
        {messages.length === 0 ? (
          // Welcome / Quickstart suggestions
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-400 dark:text-slate-500">
              <MessageSquare className="w-8 h-8" />
            </div>
            
            <div className="max-w-md">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">Ask your AI Study Buddy!</h3>
              <p className="text-xs text-slate-650 dark:text-slate-500 mt-2">
                Need help with a math formula, a chemistry reaction, or explaining complex concepts? Ask your AI Tutor below or pick a starting topic!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl pt-4">
              {suggestedPrompts.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSend(item.prompt)}
                  className="p-4 rounded-xl bg-slate-50/50 hover:bg-slate-100 border border-slate-200 dark:bg-slate-900/40 dark:hover:bg-slate-900/80 dark:border-white/5 dark:hover:border-white/10 text-left transition-all group flex flex-col justify-between h-32"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">{item.icon}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-violet transition-colors group-hover:translate-x-0.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-905 dark:text-white">{item.title}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-500 mt-1 line-clamp-2">{item.prompt}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Chat history display
          <div className="space-y-4 pr-1">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow ${
                  msg.role === 'user' 
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-white/5' 
                    : 'bg-gradient-to-tr from-brand-royal to-brand-violet'
                }`}>
                  {msg.role === 'user' ? 'Me' : <Brain className="w-4.5 h-4.5" />}
                </div>

                {/* Message Bubble */}
                <div className={`rounded-2xl px-4 py-3 text-left relative ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-r from-brand-royal/10 to-brand-violet/10 border border-brand-royal/20 text-slate-800 dark:text-white rounded-tr-none' 
                    : 'bg-slate-50/70 border border-slate-200 dark:bg-slate-900/40 dark:border-white/5 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-sm'
                }`}>
                  {formatMessage(msg.text)}
                </div>
              </div>
            ))}
            
            {/* Loading / Typing indicator */}
            {isLoading && (
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-royal to-brand-violet flex items-center justify-center text-white shrink-0 shadow animate-pulse">
                  <Brain className="w-4.5 h-4.5" />
                </div>
                <div className="rounded-2xl rounded-tl-none px-4 py-3 bg-slate-50/70 border border-slate-200 dark:bg-slate-900/40 dark:border-white/5 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}

            {/* Error Message Box */}
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl flex items-start gap-2 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="text-left">
                  <span className="font-bold">Error:</span> {error}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Message Area */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }}
        className="flex items-center gap-3 p-2 glass-card border-slate-200 dark:border-white/5"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isLoading}
          placeholder={isLoading ? "Tutor is thinking..." : "Type your question here (e.g. 'What is the de Moivre's Theorem?')..."}
          className="flex-1 py-3 px-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-white/5 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-brand-violet transition-colors min-w-0"
        />
        
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="w-11 h-11 rounded-xl bg-gradient-to-r from-brand-royal to-brand-violet hover:from-brand-royal/90 hover:to-brand-violet/90 text-white flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0 shadow-lg shadow-brand-royal/10 hover:shadow-brand-royal/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
      
      <p className="text-[9px] text-slate-400 dark:text-slate-600 text-center">
        EduVerse AI Tutor is optimized for school syllabi. Verify important formulas before exams.
      </p>
    </div>
  );
};
