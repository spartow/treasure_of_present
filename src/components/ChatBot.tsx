'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, X, MessageCircle, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Array<{
    program_number?: number;
    title?: string;
    score?: number;
  }>;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'سلام! من دستیار هوشمند گنج حضور هستم. می‌توانم به شما در یافتن برنامه‌ها و پاسخ به سوالات درباره محتوای آن‌ها کمک کنم.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // TODO: Replace with actual API call to RAG backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, history: messages }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response || 'متاسفانه نتوانستم پاسخی پیدا کنم.',
        timestamp: new Date(),
        sources: data.sources || [],
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      // Fallback response for demo
      const assistantMessage: Message = {
        role: 'assistant',
        content: 'متاسفانه در حال حاضر امکان پاسخگویی وجود ندارد. لطفاً بعداً تلاش کنید.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-full shadow-elegant-lg hover-lift pulse-glow z-50"
          title="دستیار هوشمند"
        >
          <MessageCircle className="w-6 h-6 animate-pulse" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] glass-dark rounded-2xl shadow-elegant-lg flex flex-col z-50 backdrop-blur-xl fade-in-up">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200/10 dark:border-gray-700/10 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-2xl shadow-lg">
            <h3 className="font-semibold text-right flex-1">دستیار هوشمند گنج حضور</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-purple-700 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" dir="rtl">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl p-3 shadow-md ${
                    message.role === 'user'
                      ? 'bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-gray-100 backdrop-blur-sm'
                      : 'bg-gradient-to-br from-purple-600 to-blue-600 text-white'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-white/20">
                      <p className="text-xs opacity-75 mb-1">منابع:</p>
                      <div className="space-y-1">
                        {message.sources.map((source, i) => (
                          <a
                            key={i}
                            href={source.program_number 
                              ? `https://www.parvizshahbazi.com/ganj_videos/musicvideo.php?vid=${source.program_number}`
                              : '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-xs opacity-90 hover:opacity-100 underline"
                          >
                            {source.program_number 
                              ? `برنامه #${source.program_number}${source.title ? `: ${source.title}` : ''}`
                              : 'منبع عمومی'}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString('fa-IR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-end">
                <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-xl p-3 shadow-md pulse-glow">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200/10 dark:border-gray-700/10 backdrop-blur-sm">
            <div className="flex gap-2">
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 hover-lift disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-xl shadow-elegant transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="سوال خود را بپرسید..."
                className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 border-none rounded-lg focus:ring-2 focus:ring-purple-500 resize-none text-right"
                rows={2}
                dir="rtl"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
