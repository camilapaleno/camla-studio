import { useState, useEffect, useRef, memo } from 'react';

const HeroChat = () => {
  const [messages, setMessages] = useState([]);
  const initializedRef = useRef(false);

  useEffect(() => {
    // Prevent double initialization in React Strict Mode
    if (initializedRef.current) return;
    initializedRef.current = true;

    const addMessage = (id, text, delay, isFirst = false) => {
      // Add message in typing state
      setTimeout(() => {
        setMessages(prev => [...prev, { id, state: 'typing', text, isFirst }]);
      }, delay);

      // Transition to expanding (dots fade out, bubble expands)
      setTimeout(() => {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, state: 'expanding' } : m));
      }, delay + 2000);

      // Transition to showing text
      setTimeout(() => {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, state: 'showing' } : m));
      }, delay + 2800);
    };

    addMessage('msg1', "Hey! My name is Camila. I'm your new partner in crime. :)", 0, true);
    addMessage('msg2', "I work with you to connect your brand identity to your online presence. Check it out:", 4000);

    return () => {};
  }, []);

  return (
    <div className="h-screen w-full p-10">
      <div className="w-full max-w-5xl space-y-6">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
      </div>
    </div>
  );
};

const ChatBubble = memo(({ message }) => {
  const textRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Measure the final text dimensions
  useEffect(() => {
    if (textRef.current) {
      const { offsetWidth, offsetHeight } = textRef.current;
      setDimensions({ width: offsetWidth, height: offsetHeight });
    }
  }, [message.text]);

  const isTyping = message.state === 'typing';
  const isExpanding = message.state === 'expanding';
  const isShowing = message.state === 'showing';

  return (
    <div className={`flex items-end space-x-4 mb-6 ${message.isFirst ? 'mb-4' : ''}`}>
      {/* Hidden text for measuring - positioned relative to this container */}
      <div style={{ position: 'relative', width: '100%' }}>
        <div style={{
          position: 'absolute',
          visibility: 'hidden',
          width: '100%',
          maxWidth: '1280px',
          pointerEvents: 'none',
          top: 0,
          left: 0
        }}>
          <p ref={textRef} className="text-[48px] leading-tight" style={{ padding: '48px 80px' }}>
            {message.text}
          </p>
        </div>

        {/* Visible bubble */}
        <div
          className="backdrop-blur-lg backdrop-brightness-[103%] border border-[#fff] flex items-center justify-center relative overflow-hidden"
          style={{
            width: isTyping ? '124px' : '100%',
            height: isTyping ? '72px' : (dimensions.height || '72px'),
            borderRadius: isTyping ? '9999px' : '200px',
            transition: 'all 800ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
        {/* Typing dots */}
        <div
          className="absolute inset-0 flex items-center justify-center space-x-2"
          style={{
            opacity: isTyping ? 1 : 0,
            transition: 'opacity 300ms ease-out'
          }}
        >
          <div className="w-4 h-4 bg-[#a6a09a] rounded-full animate-soft-bounce"></div>
          <div className="w-4 h-4 bg-[#a6a09a] rounded-full animate-soft-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-4 h-4 bg-[#a6a09a] rounded-full animate-soft-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>

        {/* Text content */}
        <div
          className="w-full"
          style={{
            opacity: isShowing ? 1 : 0,
            transition: 'opacity 400ms ease-in 200ms',
            padding: '48px 80px'
          }}
        >
          <p className="text-[48px] leading-tight text-[#49423A]">
            {message.text}
          </p>
        </div>
      </div>
      </div>
    </div>
  );
});

ChatBubble.displayName = 'ChatBubble';

export default HeroChat;