import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, AlertCircle, MessageSquare, Bot, User, X } from 'lucide-react';
import api from '../services/api';

const ChatBox = ({ documentId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { 
    if (isOpen) endRef.current?.scrollIntoView({ behavior: 'smooth' }); 
  }, [messages, isOpen]);

  const handleSend = async () => {
    const q = input.trim(); if (!q || isLoading) return;
    setError(''); setInput('');
    setMessages(prev => [...prev, { role: 'user', content: q }]);
    setIsLoading(true);
    try {
      const { data } = await api.post(`/api/query/${documentId}`, { question: q });
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer, sourceHint: data.sourceHint }]);
    } catch (err) { setError(err.error || 'Failed to get answer'); }
    finally { setIsLoading(false); inputRef.current?.focus(); }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl border border-indigo-200 overflow-hidden shadow-2xl flex flex-col mb-4 w-[360px] sm:w-[400px]"
            style={{ maxHeight: 'calc(100vh - 120px)' }}
          >
            {/* Header */}
            <div className="bg-white border-b border-indigo-100 px-5 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-navy-900 leading-tight">Contract Q&A</h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">Ask any question about your contract</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/50 min-h-[300px] max-h-[400px]">
        {messages.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <MessageSquare className="w-12 h-12 text-indigo-200 mx-auto mb-4" />
            <p className="text-sm font-bold text-gray-500">Ask a question to get started</p>
            <p className="text-sm mt-1.5 text-gray-400 font-medium">e.g., "What are the payment terms?"</p>
          </div>
        )}
        
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} gap-3`}>
            {m.role === 'assistant' && (
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4 text-indigo-600" />
              </div>
            )}
            
            <div className={`max-w-[80%] px-4 py-3 shadow-sm ${
              m.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-none' 
                : 'bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-tl-none'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{m.content}</p>
              {m.sourceHint && (
                <p className={`text-xs mt-2 italic ${m.role === 'user' ? 'text-indigo-200' : 'text-gray-400'}`}>
                  {m.sourceHint}
                </p>
              )}
            </div>
            
            {m.role === 'user' && (
              <div className="w-8 h-8 bg-navy-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-4 h-4 text-navy-600" />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start gap-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Bot className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none px-5 py-4 flex gap-1.5 shadow-sm h-11 items-center">
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        
        {error && (
          <div className="flex justify-center my-2">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 border border-red-100 rounded-xl text-sm font-medium">
              <AlertCircle className="w-4 h-4 text-red-500" />
              {error}
              <button onClick={() => setError('')} className="text-red-700 font-bold hover:underline ml-2">Dismiss</button>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-indigo-100 shrink-0">
        <div className="flex items-end gap-3">
          <textarea 
            ref={inputRef} 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Type your question..." 
            disabled={isLoading} 
            rows={1}
            className="flex-1 resize-none px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none disabled:opacity-50 transition-colors"
            style={{ minHeight: '46px', maxHeight: '120px' }} 
          />
          <button 
            onClick={handleSend} 
            disabled={!input.trim() || isLoading}
            className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 disabled:bg-gray-300 disabled:text-gray-500 transition-colors flex-shrink-0"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-0.5" />}
          </button>
        </div>
      </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 bg-indigo-600 rounded-full shadow-[0_8px_16px_rgba(79,70,229,0.3)] flex items-center justify-center text-white hover:bg-indigo-700 transition-colors"
          >
            <MessageSquare className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBox;
