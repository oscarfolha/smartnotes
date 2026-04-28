import { useState, useRef, useEffect } from 'react';
import { useAIQuery } from '../../hooks/useAI';
import { useAppPreferences } from '../../contexts/appPreferences';
import './AIChatBox.css';

export function AIChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { mutate, isPending, history } = useAIQuery();
  const { t } = useAppPreferences();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  function handleSend() {
    const q = input.trim();
    if (!q) return;
    setInput('');
    mutate(q);
  }

  return (
    <>
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="ai-chat-toggle"
        aria-label="Open AI assistant"
      >
        🤖
      </button>

      {isOpen && (
        <div className="ai-chat-panel">
          <div className="ai-chat-header">
            <span className="ai-chat-title">{t('aiAssistantTitle')}</span>
            <button onClick={() => setIsOpen(false)} className="ai-chat-close-button">
              ×
            </button>
          </div>

          <div className="ai-chat-body">
            {history.length === 0 && (
              <p className="ai-chat-empty-state">
                {t('aiHelperText')}
              </p>
            )}
            {history.map((item) => (
              <div key={`${item.question}-${item.answer}`} className="ai-chat-history-item">
                <div className="ai-chat-question">
                  {item.question}
                </div>
                <div className="ai-chat-answer">
                  {item.answer}
                </div>
              </div>
            ))}
            {isPending && (
              <div className="ai-chat-thinking">{t('aiThinking')}</div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="ai-chat-footer">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t('askAiPlaceholder')}
              className="ai-chat-input"
              disabled={isPending}
            />
            <button
              onClick={handleSend}
              disabled={isPending || !input.trim()}
              className="ai-chat-send-button"
            >
              →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
