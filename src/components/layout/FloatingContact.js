'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { MessageSquare, X, Send, Bot, User, RefreshCw, Phone, Check } from 'lucide-react';

export default function FloatingContact() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [activeTab, setActiveTab] = useState('ai'); // 'ai' or 'direct'
  const [isTyping, setIsTyping] = useState(false);
  
  // Chatbot State
  const [chatStep, setChatStep] = useState(0); // 0: Bill, 1: Property, 2: Backup, 3: Recommendation
  const [selections, setSelections] = useState({
    bill: '',
    property: '',
    backup: ''
  });
  
  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'ai',
      text: "Welcome to SolarPlex! ☀️ I am your AI Solar Consultant. Let's find the best solar system for your needs. What is your average monthly electricity bill?"
    }
  ]);

  const chatEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  // Auto-show tooltip after 3 seconds to attract attention
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) setShowTooltip(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Hide on admin and staff portals
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/staff')) {
    return null;
  }

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setShowTooltip(false);
  };

  const handleUserSelection = (field, value, label) => {
    // Add user response to history
    setChatHistory(prev => [...prev, { sender: 'user', text: label }]);
    
    const updatedSelections = { ...selections, [field]: value };
    setSelections(updatedSelections);
    
    // Simulate AI thinking & reply
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      
      if (field === 'bill') {
        setChatStep(1);
        setChatHistory(prev => [...prev, {
          sender: 'ai',
          text: "Understood. What type of property is this system for?"
        }]);
      } else if (field === 'property') {
        setChatStep(2);
        setChatHistory(prev => [...prev, {
          sender: 'ai',
          text: "Excellent. Do you require battery backup during load-shedding power outages?"
        }]);
      } else if (field === 'backup') {
        setChatStep(3);
        
        // Compute recommendation details
        const rec = getRecommendation(updatedSelections);
        
        setChatHistory(prev => [...prev, {
          sender: 'ai',
          text: `Based on your inputs, we recommend the following customized setup:

• Recommended System: ${rec.size} kW
• Type: ${rec.type}
• Monthly Savings: ~${rec.savings}
• Net-Metering: Eligible

Would you like to send this solar estimate to our Managing Director Kafeel Ahmed Khan to book a free structural survey?`
        }]);
      }
    }, 800);
  };

  const getRecommendation = (data) => {
    let size = "5 kW";
    let type = "On-Grid (Net-Metered)";
    let savings = "Rs. 25,000";

    // Size calculation logic
    if (data.bill === 'mid') {
      size = "10 kW";
      savings = "Rs. 55,000";
    } else if (data.bill === 'high') {
      size = "20 kW";
      savings = "Rs. 110,000";
    } else if (data.bill === 'industrial') {
      size = "50 kW+";
      savings = "Rs. 280,000+";
    }

    // Type logic
    if (data.backup === 'yes') {
      type = "Hybrid (Battery Backup)";
    } else if (data.backup === 'both') {
      type = "Smart Hybrid (High-Yield Lithium Backup + Net-Metering)";
    }

    if (data.property === 'commercial') {
      type = "Commercial " + type;
    } else if (data.property === 'industrial') {
      type = "Industrial " + type;
      if (data.bill === 'low') {
        size = "15 kW";
        savings = "Rs. 85,000";
      }
    }

    return { size, type, savings };
  };

  const handleReset = () => {
    setChatStep(0);
    setSelections({ bill: '', property: '', backup: '' });
    setChatHistory([
      {
        sender: 'ai',
        text: "Let's restart! ☀️ What is your average monthly electricity bill?"
      }
    ]);
  };

  const getWhatsAppLink = () => {
    const rec = getRecommendation(selections);
    const text = `Hi Kafeel, I just ran the SolarPlex AI Consultant. Here is my estimate:
- Property: ${selections.property || 'Not specified'}
- Average Bill range: ${selections.bill === 'low' ? 'Under Rs. 30k' : selections.bill === 'mid' ? 'Rs. 30k-70k' : 'Above Rs. 70k'}
- Backup Required: ${selections.backup || 'Not specified'}
- Recommended: ${rec.size} (${rec.type})
I would like to schedule a survey!`;
    return `https://wa.me/923122469522?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end select-none font-sans">
      
      {/* Expanded Chat Widget (Reduced size: w-76) */}
      {isOpen && (
        <div className="w-76 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden mb-4 animate-fade-in flex flex-col h-[400px]">
          
          {/* Header */}
          <div className="bg-slate-900 dark:bg-slate-950 text-white p-3.5 flex justify-between items-center border-b border-slate-800 shrink-0">
            <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
              <div className="relative">
                <img 
                  src="/solarplex_logo.png" 
                  alt="SolarPlex Operations" 
                  className="h-8.5 w-8.5 rounded-full object-cover border border-solar-orange/40"
                />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-slate-900 animate-pulse"></span>
              </div>
              <div className="text-left rtl:text-right">
                <h4 className="font-extrabold text-xs text-white">SolarPlex Support</h4>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">AI & MD Kafeel Ahmed</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer p-0.5 rounded-md hover:bg-slate-800"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs shrink-0 bg-slate-50 dark:bg-slate-900/60">
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex-1 py-2 font-bold transition-colors cursor-pointer text-center flex items-center justify-center space-x-1.5 ${
                activeTab === 'ai' 
                  ? 'text-solar-orange border-b-2 border-solar-orange bg-white dark:bg-slate-900' 
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Bot className="h-3.5 w-3.5" />
              <span>AI Consultant</span>
            </button>
            <button
              onClick={() => setActiveTab('direct')}
              className={`flex-1 py-2 font-bold transition-colors cursor-pointer text-center flex items-center justify-center space-x-1.5 ${
                activeTab === 'direct' 
                  ? 'text-solar-orange border-b-2 border-solar-orange bg-white dark:bg-slate-900' 
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Direct MD Chat</span>
            </button>
          </div>

          {/* AI Chat Tab View */}
          {activeTab === 'ai' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Message History */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 scrollbar-thin">
                {chatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex items-start space-x-2 rtl:space-x-reverse ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                    {msg.sender === 'ai' && (
                      <div className="bg-solar-orange/10 text-solar-orange p-1.5 rounded-lg shrink-0 mt-0.5">
                        <Bot className="h-3.5 w-3.5" />
                      </div>
                    )}
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[82%] whitespace-pre-line ${
                      msg.sender === 'user'
                        ? 'bg-solar-orange text-white rounded-tr-none font-semibold text-right'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none font-sans'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-start space-x-2 rtl:space-x-reverse">
                    <div className="bg-solar-orange/10 text-solar-orange p-1.5 rounded-lg shrink-0 mt-0.5">
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none flex space-x-1 items-center">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Options / Control Panel */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
                {chatStep === 0 && !isTyping && (
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <button 
                      onClick={() => handleUserSelection('bill', 'low', 'Under Rs. 30,000')}
                      className="py-2 px-1 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-solar-orange hover:text-white transition-colors cursor-pointer text-center font-bold"
                    >
                      Under Rs. 30k
                    </button>
                    <button 
                      onClick={() => handleUserSelection('bill', 'mid', 'Rs. 30,000 - 70,000')}
                      className="py-2 px-1 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-solar-orange hover:text-white transition-colors cursor-pointer text-center font-bold"
                    >
                      Rs. 30k - 70k
                    </button>
                    <button 
                      onClick={() => handleUserSelection('bill', 'high', 'Rs. 70,000 - 150,000')}
                      className="py-2 px-1 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-solar-orange hover:text-white transition-colors cursor-pointer text-center font-bold"
                    >
                      Rs. 70k - 150k
                    </button>
                    <button 
                      onClick={() => handleUserSelection('bill', 'industrial', 'Above Rs. 150,000')}
                      className="py-2 px-1 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-solar-orange hover:text-white transition-colors cursor-pointer text-center font-bold"
                    >
                      Above Rs. 150k
                    </button>
                  </div>
                )}

                {chatStep === 1 && !isTyping && (
                  <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                    <button 
                      onClick={() => handleUserSelection('property', 'residential', 'Residential (Home)')}
                      className="py-2 px-1 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-solar-orange hover:text-white transition-colors cursor-pointer text-center font-bold truncate"
                    >
                      Home
                    </button>
                    <button 
                      onClick={() => handleUserSelection('property', 'commercial', 'Commercial (Office)')}
                      className="py-2 px-1 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-solar-orange hover:text-white transition-colors cursor-pointer text-center font-bold truncate"
                    >
                      Office
                    </button>
                    <button 
                      onClick={() => handleUserSelection('property', 'industrial', 'Industrial (Factory)')}
                      className="py-2 px-1 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-solar-orange hover:text-white transition-colors cursor-pointer text-center font-bold truncate"
                    >
                      Factory
                    </button>
                  </div>
                )}

                {chatStep === 2 && !isTyping && (
                  <div className="flex flex-col space-y-1.5 text-[10px]">
                    <button 
                      onClick={() => handleUserSelection('backup', 'yes', 'Yes, need backup')}
                      className="py-2 px-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-solar-orange hover:text-white transition-colors cursor-pointer text-center font-bold"
                    >
                      Yes, need Battery Backup (Hybrid)
                    </button>
                    <button 
                      onClick={() => handleUserSelection('backup', 'no', 'No, grid-tied')}
                      className="py-2 px-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-solar-orange hover:text-white transition-colors cursor-pointer text-center font-bold"
                    >
                      No, Grid-Tied only (Net-Metering)
                    </button>
                    <button 
                      onClick={() => handleUserSelection('backup', 'both', 'Need both features')}
                      className="py-2 px-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-solar-orange hover:text-white transition-colors cursor-pointer text-center font-bold"
                    >
                      High-yield Backup + Net-Metering
                    </button>
                  </div>
                )}

                {chatStep === 3 && !isTyping && (
                  <div className="flex flex-col space-y-2">
                    <a
                      href={getWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-1.5 w-full py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold rounded-lg shadow-md cursor-pointer text-[10px]"
                    >
                      <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M12.004 2C6.5 2 2.002 6.5 2.002 12c0 2.01.6 3.88 1.63 5.46L2 22l4.7-.1.08.05c1.55.93 3.32 1.45 5.22 1.45 5.5 0 10-4.5 10-10S17.5 2 12.004 2zm0 1.7c4.6 0 8.3 3.7 8.3 8.3s-3.7 8.3-8.3 8.3c-1.8 0-3.4-.6-4.7-1.6l-.3-.2-2.8.6.6-2.7-.2-.3c-1.1-1.4-1.7-3.1-1.7-4.9.1-4.6 3.8-8.3 8.3-8.3zm-3.6 3.6c-.2 0-.4.1-.6.3-.2.2-.6.6-.6 1.4 0 .8.6 1.6.7 1.7.1.1 1.2 1.9 2.9 2.6.4.2.7.3.9.4.4.1.8.1 1.1 0 .4-.1.9-.4 1.1-.8.2-.4.2-.7.1-.8l-.5-.3c-.2-.1-.8-.4-.9-.5-.1-.1-.2-.1-.3 0-.1.1-.3.4-.4.5-.1.1-.2.1-.4 0-.3-.1-1.1-.4-2.1-1.3-.8-.7-1.3-1.6-1.5-1.9-.2-.3 0-.4.1-.5l.4-.4c.1-.1.1-.2.2-.3v-.3c-.1-.1-.5-.9-.6-1.2-.2-.5-.3-.4-.4-.4z"/>
                      </svg>
                      <span>Send to Kafeel on WhatsApp</span>
                    </a>
                    
                    <button
                      onClick={handleReset}
                      className="flex items-center justify-center space-x-1.5 w-full py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-lg cursor-pointer text-[10px]"
                    >
                      <RefreshCw className="h-3 w-3" />
                      <span>Start Over</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Direct Chat Tab View */}
          {activeTab === 'direct' && (
            <div className="flex-1 p-4 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs font-bold text-slate-700 dark:text-slate-350">
                  <User className="h-4 w-4 text-solar-orange" />
                  <span>MD Operations: Kafeel Ahmed Khan</span>
                </div>
                
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                  Connect directly with the business owner. Kafeel oversees all procurement, sales quotes, and active installations.
                </p>

                <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-[10px] space-y-2 font-sans text-slate-600 dark:text-slate-300">
                  <p><strong>Hotline:</strong> 03122469522</p>
                  <p><strong>Address:</strong> D-27 Kauser Town Malir Karachi</p>
                </div>
              </div>

              {/* Contact Redirect Buttons */}
              <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <a
                  href="https://wa.me/923122469522?text=Hi%20Kafeel,%20I%27m%20interested%20in%20a%20solar%20solution%20quote!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 w-full py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-xl shadow-sm text-xs cursor-pointer"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.004 2C6.5 2 2.002 6.5 2.002 12c0 2.01.6 3.88 1.63 5.46L2 22l4.7-.1.08.05c1.55.93 3.32 1.45 5.22 1.45 5.5 0 10-4.5 10-10S17.5 2 12.004 2zm0 1.7c4.6 0 8.3 3.7 8.3 8.3s-3.7 8.3-8.3 8.3c-1.8 0-3.4-.6-4.7-1.6l-.3-.2-2.8.6.6-2.7-.2-.3c-1.1-1.4-1.7-3.1-1.7-4.9.1-4.6 3.8-8.3 8.3-8.3zm-3.6 3.6c-.2 0-.4.1-.6.3-.2.2-.6.6-.6 1.4 0 .8.6 1.6.7 1.7.1.1 1.2 1.9 2.9 2.6.4.2.7.3.9.4.4.1.8.1 1.1 0 .4-.1.9-.4 1.1-.8.2-.4.2-.7.1-.8l-.5-.3c-.2-.1-.8-.4-.9-.5-.1-.1-.2-.1-.3 0-.1.1-.3.4-.4.5-.1.1-.2.1-.4 0-.3-.1-1.1-.4-2.1-1.3-.8-.7-1.3-1.6-1.5-1.9-.2-.3 0-.4.1-.5l.4-.4c.1-.1.1-.2.2-.3v-.3c-.1-.1-.5-.9-.6-1.2-.2-.5-.3-.4-.4-.4z"/>
                  </svg>
                  <span>Chat on WhatsApp</span>
                </a>

                <a
                  href="https://www.facebook.com/profile.php?id=61591159013017"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 w-full py-2.5 bg-[#1877F2] hover:bg-[#1565D8] text-white font-bold rounded-xl shadow-sm text-xs cursor-pointer"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Visit Facebook Page</span>
                </a>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Tooltip Alert */}
      {showTooltip && !isOpen && (
        <div className="bg-slate-900 dark:bg-slate-800 text-white text-[10px] font-semibold py-1.5 px-3 rounded-lg shadow-lg mb-2.5 animate-fade-in relative max-w-[160px] text-center">
          <span className="absolute -bottom-1 right-5.5 w-1.5 h-1.5 bg-slate-900 dark:bg-slate-800 rotate-45"></span>
          Solar Questions? Ask our AI!
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={handleToggle}
        className={`w-11.5 h-11.5 bg-solar-orange hover:bg-solar-deep text-white rounded-full flex items-center justify-center shadow-2xl cursor-pointer transition-all hover:scale-105 active:scale-95 relative ${
          isOpen ? 'rotate-90 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700' : ''
        }`}
        title="Contact Operations Support"
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <>
            <MessageSquare className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-slate-50 animate-pulse"></span>
          </>
        )}
      </button>

    </div>
  );
}
