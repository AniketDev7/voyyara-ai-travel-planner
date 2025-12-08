'use client';

/**
 * Chat Interface using Contentstack Generative AI
 * Uses Voyyara Voice Profile for on-brand responses
 */

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
}

export function ChatInterfaceGenAI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  useEffect(() => {
    scrollToBottom();
    if (messages.length > 0 && inputRef.current) {
      inputRef.current.blur();
    }
  }, [messages, isLoading]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      // Parse JSON response with content and suggestions
      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content || data,
        suggestions: data.suggestions || [],
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      // changed height to 750px
      className="flex flex-col h-[750px] bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center space-x-3">
          <motion.div 
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl shadow-lg"
            animate={{ scale: isLoading ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 1.5, repeat: isLoading ? Infinity : 0, ease: "easeInOut" }}
          >
            🧞
          </motion.div>
          <div>
            <h3 className="font-bold text-gray-900">Voyyara Genie</h3>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-600">
                {isLoading ? '✨ Crafting your perfect itinerary...' : 'Ready to help you plan your adventure'}
              </p>
              <span className="text-xs bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-0.5 rounded-full font-medium">
                Contentstack AI
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-gradient-to-b from-gray-50/50 to-white"
      >
        {messages.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center text-gray-600 py-16"
          >
            <div className="text-6xl mb-6">🧳</div>
            <p className="text-2xl font-bold mb-3 text-gray-900">Start Planning Your Trip!</p>
            <p className="text-base text-gray-600 mb-8">Tell me where you want to go and I&apos;ll help you create the perfect itinerary.</p>
            <div className="mt-8 grid grid-cols-1 gap-3 max-w-lg mx-auto">
              <motion.button
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setInput('I want to visit Vietnam for 7 days with $1500 budget')}
                className="text-left p-4 rounded-2xl bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 transition-all border border-purple-200 text-sm font-medium text-gray-800 shadow-sm hover:shadow-md"
              >
                <span className="text-lg mr-2">🇻🇳</span>
                I want to visit Vietnam for 7 days with $1500 budget
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setInput('Plan a cultural trip to Japan for 10 days')}
                className="text-left p-4 rounded-2xl bg-gradient-to-r from-pink-100 to-orange-100 hover:from-pink-200 hover:to-orange-200 transition-all border border-pink-200 text-sm font-medium text-gray-800 shadow-sm hover:shadow-md"
              >
                <span className="text-lg mr-2">🇯🇵</span>
                Plan a cultural trip to Japan for 10 days
              </motion.button>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-md ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'bg-white text-gray-800 border border-gray-200'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
              </div>
              
              {/* Suggestions - only show for the last assistant message */}
              {message.role === 'assistant' && 
               message.suggestions && 
               index === messages.length - 1 && 
               !isLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-3 w-full"
                >
                  <p className="text-xs text-gray-500 mb-2">You might want to ask:</p>
                  <div className="flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => setInput(suggestion)}
                        className="text-xs px-3 py-1.5 rounded-full bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700 border border-gray-200 hover:border-purple-300 transition-all"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-white rounded-2xl px-4 py-3 border border-gray-200 shadow-md">
              <div className="flex space-x-2">
                <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce" />
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2.5 h-2.5 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-5 bg-white">
        <form onSubmit={handleSubmit} className="flex space-x-3 mb-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            placeholder="Tell me about your dream trip..."
            disabled={isLoading}
            autoFocus={false}
            autoComplete="off"
            className="flex-1 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-purple-400 transition-all rounded-2xl h-12 px-5 text-base"
          />
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-0 shadow-lg rounded-2xl px-8 h-12 font-semibold"
          >
            {isLoading ? '✨ Sending...' : 'Send'}
          </Button>
        </form>
        <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1">
          <span className="text-gray-300">ⓘ</span>
          Voyyara Genie can make mistakes. Check important info.
        </p>
      </div>
    </motion.div>
  );
}

