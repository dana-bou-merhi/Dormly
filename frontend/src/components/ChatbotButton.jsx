import { useState } from 'react';
import { X, Minus, Send, Bot} from 'lucide-react';

export default function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: "Hey there! Looking at this Hamra studio? I've analyzed the current utility rates for this area to help you budget.",
    },
  ]);
  const [inputValue, setInputValue] = useState('');

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { type: 'user', text: inputValue }]);
      setInputValue('');
      // Simulate bot response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { type: 'bot', text: 'Thanks for your question! I\'m here to help.' },
        ]);
      }, 500);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-105 h-175 mb-4 shadow-2xl rounded-3xl overflow-hidden border border-slate-200 bg-white animate-in fade-in slide-in-from-bottom-4 duration-300 flex flex-col">
          
          <div className="bg-linear-to-r from-slate-800 to-slate-900 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo  */}
              <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center shrink-0 border-2 border-teal-300 relative">
                <div className="w-6 h-6 text-white">
                  <Bot size={24} />
                </div>
                {/* Online indicator */}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-teal-400 rounded-full border-2 border-white"></div>
              </div>

              <div>
                <h3 className="font-heading font-bold text-white text-lg">Dormly AI</h3>
                <p className="text-xs text-slate-400">Verified Assistant • Online</p>
              </div>

            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {}}
                className="text-slate-400 hover:text-white transition p-1"
                aria-label="Minimize"
              >
                <Minus size={20} />
              </button>
              <button
                onClick={toggleChat}
                className="text-slate-400 hover:text-white transition p-1"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.type === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center shrink-0">
                    <Bot size={16} className="text-white" />
                  </div>
                )}
                <div
                  className={`max-w-xs rounded-2xl px-4 py-3 ${
                    msg.type === 'user'
                      ? 'bg-teal-500 text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}

            {/* Utility Cost Card */}
            <div className="bg-teal-50 rounded-2xl border border-teal-200 p-4 mt-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 text-teal-600">
                  <Bot size={16} />
                </div>
                <h4 className="font-bold text-teal-600 text-sm uppercase tracking-wide">Utility Cost Estimate</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">Bldg Generator (5A)</span>
                  <span className="font-semibold text-gray-900">$65 - $80</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">EDL (State Power)</span>
                  <span className="font-semibold text-gray-900">$12 - $20</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">High-Speed Fiber</span>
                  <span className="font-semibold text-gray-900">$25</span>
                </div>
                <div className="border-t border-teal-200 pt-2 mt-2 flex justify-between">
                  <span className="font-bold text-gray-900">Est. Total</span>
                  <span className="font-bold text-teal-600">~$110/mo</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-3">
              <button className="flex-1 px-3 py-2 rounded-full border border-teal-500 text-teal-600 text-xs font-semibold hover:bg-teal-50 transition">
                Ask about the neighborhood
              </button>
              <button className="flex-1 px-3 py-2 rounded-full border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition">
                Is it noisy?
              </button>
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a question about this dorm..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 px-4 py-3 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                className="w-10 h-10 bg-teal-500 hover:bg-teal-600 text-white rounded-full flex items-center justify-center transition shrink-0"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>
           
          </div>
        </div>
      )}

      
      <button
        onClick={toggleChat}
        className="w-14 h-14 bg-white rounded-full shadow-lg border-2 border-teal-500 flex items-center justify-center hover:scale-110 transition duration-300 overflow-hidden focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        aria-label="Toggle chat"
        aria-expanded={isOpen}
      >
        <Bot size={24} className="text-teal-500" />
      </button>
    </div>
  );
}
