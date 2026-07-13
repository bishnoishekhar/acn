import { useState, useEffect, useRef } from 'react';
import ChatWindow from './components/ChatWindow';
import { bootstrapGecx } from './components/gecx';

/* ── Hero mockup scenes ── */
const SCENES = [
  {
    user: 'Transfer $500 to Maria',
    bot: <>On it! Transferring <strong>CAD 500</strong> to Maria Badillo.</>,
    receipt: { icon: '✅', title: 'Transfer complete', sub: 'CAD 500.00 → Maria Badillo · 3s' },
  },
  {
    user: "What's my balance?",
    bot: 'Here are your accounts:',
    cards: [
      { label: 'Chequing', val: 'CAD 12,450', color: 'purple' },
      { label: 'Savings', val: 'CAD 28,750', color: 'green' },
    ],
  },
  {
    user: 'Apply for the Platinum Card',
    bot: <>Great choice! You're <strong>pre-approved</strong>.</>,
    receipt: { icon: '🎁', title: 'Pre-approved offer ready', sub: '5× points · CAD 300 bonus' },
  },
];

export default function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatIntent, setChatIntent] = useState(null);
  const [showBadge, setShowBadge] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [sceneIdx, setSceneIdx] = useState(0);
  const tooltipTimer = useRef(null);

  /* ── Bootstrap GECX once on mount ── */
  useEffect(() => {
    bootstrapGecx();
    tooltipTimer.current = setTimeout(() => setShowTooltip(true), 6000);
    const sceneInterval = setInterval(() => setSceneIdx((i) => (i + 1) % SCENES.length), 3500);
    return () => {
      clearTimeout(tooltipTimer.current);
      clearInterval(sceneInterval);
    };
  }, []);

  const openChat = (intent = null) => {
    setChatOpen(true);
    setChatIntent(intent);
    setShowBadge(false);
    setShowTooltip(false);
    clearTimeout(tooltipTimer.current);
  };

  const closeChat = () => setChatOpen(false);
  const dismissTooltip = () => {
    setShowTooltip(false);
    clearTimeout(tooltipTimer.current);
  };

  const scene = SCENES[sceneIdx];

  return (
    <>
      {/* ── Nav ── */}
      <nav>
        <div className="logo">
          <div className="logo-mark">»</div>
          ACN Bank
        </div>
        <div className="nav-links">
          <a href="#">Products</a>
          <a href="#">Services</a>
          <a href="#">Investing</a>
          <a href="#">About</a>
        </div>
        <div className="nav-btns">
          <button className="btn-ghost">Sign in</button>
          <button className="btn-purple" onClick={() => openChat()}>Chat with us</button>
          <button className="btn-solid">Open account</button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-badge">
              <div className="badge-dot" />
              Agentic AI · Built on Accenture × Google GECX
            </div>
            <h1>Your time matters.<br /><span>We act fast.</span></h1>
            <p>Finally, banking on your terms. No queues, no long calls, no paperwork — just tell us what you need and it's handled, securely and personally.</p>
            <div className="hero-ctas">
              <button className="btn-hero" onClick={() => openChat()}>Get started</button>
              <button className="btn-hero-ghost">See what it can do</button>
            </div>
            <div className="stats">
              <div className="stat"><div className="stat-val">50+</div><div className="stat-lbl">Banking actions</div></div>
              <div className="stat"><div className="stat-val">&lt;30s</div><div className="stat-lbl">Task completion</div></div>
              <div className="stat"><div className="stat-val">24/7</div><div className="stat-lbl">Always on</div></div>
              <div className="stat"><div className="stat-val">4.8★</div><div className="stat-lbl">Satisfaction</div></div>
            </div>
          </div>

          {/* Mockup */}
          <div className="hero-right">
            <div className="chat-mockup">
              <div className="cm-header">
                <div className="cm-avatar">A</div>
                <div>
                  <div className="cm-title">ACN Bank AI</div>
                  <div className="cm-status"><span className="cm-dot" />Online · Responding now</div>
                </div>
              </div>
              <div className="cm-body">
                <div className="cm-scene" key={sceneIdx}>
                  <div className="cm-user">{scene.user}</div>
                  <div className="cm-bot-bubble">{scene.bot}</div>
                  {scene.receipt && (
                    <div className="cm-receipt">
                      <div className="cm-receipt-icon">{scene.receipt.icon}</div>
                      <div>
                        <div className="cm-receipt-title">{scene.receipt.title}</div>
                        <div className="cm-receipt-sub">{scene.receipt.sub}</div>
                      </div>
                    </div>
                  )}
                  {scene.cards && (
                    <div className="cm-cards-row">
                      {scene.cards.map((c) => (
                        <div key={c.label} className={`cm-mini-card ${c.color}`}>
                          <div className="cm-mini-label">{c.label}</div>
                          <div className="cm-mini-val">{c.val}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="cm-footer">
                <div className="cm-input-mock">Ask me anything...</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Products ── */}
      <section className="products">
        <div className="section-label">What the agent handles</div>
        <div className="product-grid">
          <div className="product-card">
            <div className="product-icon">🎁</div>
            <h3>Apply for products</h3>
            <p>Open a chequing or savings account, apply for a credit card or loan — guided step by step with no paperwork.</p>
            <button className="card-cta" onClick={() => openChat('I want to apply for a product')}>Get started →</button>
          </div>
          <div className="product-card">
            <div className="product-icon">🏦</div>
            <h3>Daily banking</h3>
            <p>Transfer money, pay bills, check your card status, and manage beneficiaries — all through a single conversation.</p>
            <button className="card-cta" onClick={() => openChat('I want to do my daily banking')}>Get started →</button>
          </div>
          <div className="product-card">
            <div className="product-icon">📊</div>
            <h3>Know your finances</h3>
            <p>Check balances, review recent transactions, track spending patterns, and view your credit score — instantly.</p>
            <button className="card-cta" onClick={() => openChat('I want to know my finances')}>Get started →</button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer>
        <span>© 2026 ACN Bank · Agentic banking powered by Accenture × Google GECX</span>
        <span>Chat with us ↘</span>
      </footer>

      {/* ── FAB ── */}
      <div className="acn-fab-wrapper">
        <div className={`acn-tooltip${showTooltip ? ' show' : ''}`}>
          <div className="acn-tooltip-title">Hi there! 👋</div>
          <div className="acn-tooltip-text">Transfer money, check balances, apply for products — all in seconds.</div>
          <button className="acn-tooltip-btn" onClick={() => openChat()}>Start a conversation →</button>
          <button className="acn-tooltip-dismiss" onClick={dismissTooltip}>Maybe later</button>
          <div className="tooltip-arrow" />
        </div>
        <div className="acn-fab" onClick={() => openChat()}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
          {showBadge && <div className="acn-fab-badge">1</div>}
        </div>
      </div>

      {/* ── Chat window ── */}
      <ChatWindow
        isOpen={chatOpen}
        onClose={closeChat}
        onReset={() => {}}
        intent={chatIntent}
      />
    </>
  );
}
