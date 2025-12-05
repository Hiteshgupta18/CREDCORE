import React, { useState, useEffect, useRef } from 'react';
import './chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: 'Hello! 👋 I\'m CrediCore Assistant. How can I help you today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickReplies = [
    { text: '🏥 Hospital Validation', value: 'validation' },
    { text: '📋 Government Schemes', value: 'schemes' },
    { text: '📍 Hospital Directory', value: 'directory' },
    { text: '❓ How it works', value: 'how' },
    { text: '📞 Contact Us', value: 'contact' }
  ];

  const getResponse = (userMessage) => {
    const message = userMessage.toLowerCase();

    // Hospital Validation
    if (message.includes('validation') || message.includes('validate') || message.includes('verify')) {
      return {
        text: '🏥 **Hospital Validation Service**\n\nOur AI-powered system validates:\n• Hospital credentials\n• Registration documents\n• License verification\n• Address matching\n\nWould you like to:\n1. Start validation process\n2. View validated hospitals\n3. Learn about our Jaccard matching algorithm',
        links: [
          { text: 'Start Validation', url: '/validation' },
          { text: 'View Directory', url: '/directory' }
        ]
      };
    }

    // Schemes
    if (message.includes('scheme') || message.includes('ayushman') || message.includes('insurance')) {
      return {
        text: '📋 **Government Schemes**\n\nWe help you find:\n• Ayushman Bharat (PMJAY)\n• State Health Insurance\n• ESI Scheme\n• CGHS Coverage\n\nAll schemes are verified and updated regularly.',
        links: [
          { text: 'Browse Schemes', url: '/schemes' },
          { text: 'Check Eligibility', url: '/schemes' }
        ]
      };
    }

    // Directory
    if (message.includes('directory') || message.includes('hospital') || message.includes('find') || message.includes('search')) {
      return {
        text: '📍 **Hospital Directory**\n\nSearch our comprehensive database:\n• 500+ verified hospitals\n• Interactive map view\n• Real-time availability\n• Contact information\n• Scheme participation',
        links: [
          { text: 'Open Directory', url: '/directory' },
          { text: 'Map View', url: '/map-test' }
        ]
      };
    }

    // How it works
    if (message.includes('how') || message.includes('work') || message.includes('process')) {
      return {
        text: '⚙️ **How CrediCore Works**\n\n1️⃣ **Data Collection**: Hospitals submit documents\n2️⃣ **AI Validation**: Our AI verifies credentials\n3️⃣ **Jaccard Matching**: Address validation using advanced algorithms\n4️⃣ **Quality Score**: Automated scoring system\n5️⃣ **Directory Listing**: Verified hospitals added to directory\n\nAccuracy Rate: 95%+',
        links: [
          { text: 'See Demo', url: '/validation' },
          { text: 'Learn More', url: '/contact' }
        ]
      };
    }

    // Contact
    if (message.includes('contact') || message.includes('support') || message.includes('help')) {
      return {
        text: '📞 **Contact Information**\n\n• Email: credicore.team@eyhackathon.com\n• Response Time: 24 hours\n• Support: Mon-Fri, 9 AM - 6 PM\n\nYou can also send us a message through our contact form.',
        links: [
          { text: 'Contact Form', url: '/contact' }
        ]
      };
    }

    // Dashboard
    if (message.includes('dashboard') || message.includes('data') || message.includes('stats')) {
      return {
        text: '📊 **Dashboard & Analytics**\n\nView:\n• Real-time statistics\n• Validation metrics\n• Hospital data\n• System performance\n\nNote: Login required for full access.',
        links: [
          { text: 'View Dashboard', url: '/dashboard' },
          { text: 'Login', url: '/login' }
        ]
      };
    }

    // Login/Signup
    if (message.includes('login') || message.includes('signup') || message.includes('register') || message.includes('account')) {
      return {
        text: '🔐 **User Account**\n\n• Create free account\n• Access validation tools\n• Save favorite hospitals\n• Track validation history\n\nGet started in 2 minutes!',
        links: [
          { text: 'Sign Up', url: '/signup' },
          { text: 'Login', url: '/login' }
        ]
      };
    }

    // AI/Technology
    if (message.includes('ai') || message.includes('technology') || message.includes('algorithm')) {
      return {
        text: '🤖 **Our Technology**\n\nPowered by:\n• Advanced AI/ML models\n• Jaccard Similarity Algorithm\n• OCR for document scanning\n• Natural Language Processing\n• Real-time data validation\n\nBuilt for accuracy and speed.',
        links: [
          { text: 'Try Address Validation', url: '/address-validation' }
        ]
      };
    }

    // Default response
    return {
      text: 'I can help you with:\n\n🏥 Hospital validation\n📋 Government schemes\n📍 Finding hospitals\n⚙️ How our system works\n📞 Contact support\n\nWhat would you like to know more about?',
      links: []
    };
  };

  const handleSend = () => {
    if (inputMessage.trim() === '') return;

    const userMessage = {
      type: 'user',
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const response = getResponse(inputMessage);
      const botMessage = {
        type: 'bot',
        text: response.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        links: response.links
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickReply = (value) => {
    setInputMessage(value);
    setTimeout(() => handleSend(), 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        className={`chat-toggle-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chat"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-container">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-content">
              <div className="chatbot-avatar">🤖</div>
              <div className="chatbot-info">
                <h3>CrediCore Assistant</h3>
                <span className="chatbot-status">
                  <span className="status-indicator"></span>
                  Online
                </span>
              </div>
            </div>
            <button
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.type}`}>
                {message.type === 'bot' && (
                  <div className="message-avatar">🤖</div>
                )}
                <div className="message-content">
                  <div className="message-text">{message.text}</div>
                  {message.links && message.links.length > 0 && (
                    <div className="message-links">
                      {message.links.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.url}
                          className="message-link"
                          onClick={() => setIsOpen(false)}
                        >
                          {link.text} →
                        </a>
                      ))}
                    </div>
                  )}
                  <div className="message-time">{message.time}</div>
                </div>
                {message.type === 'user' && (
                  <div className="message-avatar user">👤</div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="message bot">
                <div className="message-avatar">🤖</div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="chatbot-quick-replies">
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                className="quick-reply-btn"
                onClick={() => handleQuickReply(reply.value)}
              >
                {reply.text}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="chatbot-input">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="chatbot-input-field"
            />
            <button
              onClick={handleSend}
              className="chatbot-send-btn"
              disabled={inputMessage.trim() === ''}
            >
              📤
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
