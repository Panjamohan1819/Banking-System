import { useState } from 'react';
import { FaRobot } from 'react-icons/fa';

function ChatbotPlaceholder() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end'
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => setShowTooltip(!showTooltip)}
    >
      {showTooltip && (
        <div style={{
          backgroundColor: '#16213e',
          color: '#fff',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          border: '1px solid rgba(0, 212, 255, 0.3)',
          fontSize: '14px',
          maxWidth: '200px',
          textAlign: 'center',
          animation: 'fadeIn 0.2s ease-in-out'
        }}>
          <strong style={{color: '#00d4ff'}}>AI Assistant</strong><br/>
          <span style={{color: '#aaa', fontSize: '12px'}}>Coming in a future version!</span>
        </div>
      )}
      <button 
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#2a2a3e',
          color: '#555',
          border: '2px solid #444',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '28px',
          cursor: 'not-allowed',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          transition: 'all 0.3s ease'
        }}
        aria-label="Chatbot disabled"
      >
        <FaRobot />
      </button>
    </div>
  );
}

export default ChatbotPlaceholder;
