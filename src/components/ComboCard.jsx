import { useRef, useEffect } from 'react';

function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export default function ComboCard({ heading, actions, onSelect }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, []);

  return (
    <div className="acn-combo-card" ref={ref}>
      <div className="acn-combo-text">{heading}</div>
      <div className="acn-combo-tiles">
        {actions.map((action, i) => (
          <button
            key={i}
            className="acn-tile"
            onClick={() => onSelect(action)}
          >
            <span className="acn-tile-title">{action.content || ''}</span>
            {action.description && (
              <span className="acn-tile-desc">{action.description}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
