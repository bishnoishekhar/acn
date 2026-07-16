export default function AccountCarousel({ payload, onCta }) {
  const accounts = payload?.accounts || payload?.items || [];
  const ctas = payload?.ctas || payload?.actions || [];

  const typeLabel = (id) => {
    if (!id) return 'Account';
    const u = id.toUpperCase();
    if (u.includes('CHQ') || u.includes('CHEQ')) return 'Chequing';
    if (u.includes('SAV')) return 'Savings';
    if (u.includes('TFSA')) return 'TFSA';
    if (u.includes('RRSP')) return 'RRSP';
    if (u.includes('CC') || u.includes('CREDIT')) return 'Credit Card';
    return 'Account';
  };

  const typeColor = (id) => {
    if (!id) return '#7C3AED';
    const u = id.toUpperCase();
    if (u.includes('CHQ') || u.includes('CHEQ')) return '#7C3AED';
    if (u.includes('SAV')) return '#059669';
    if (u.includes('TFSA')) return '#0284C7';
    if (u.includes('RRSP')) return '#D97706';
    if (u.includes('CC') || u.includes('CREDIT')) return '#DC2626';
    return '#7C3AED';
  };

  const fmt = (amount, currency = 'CAD') =>
    `${currency} ${Number(amount).toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const maskAcct = (num) => {
    if (!num) return '';
    const s = String(num);
    return '****' + s.slice(-4);
  };

  return (
    <div style={{
      background: '#fff',
      borderRadius: '16px',
      border: '1px solid #EBEBEB',
      overflow: 'hidden',
      marginBottom: '4px',
      boxShadow: '0 2px 12px rgba(124,58,237,0.08)',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px 10px',
        borderBottom: '1px solid #F3F3F3',
      }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#1A1A1A' }}>Your Accounts</div>
        <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>Tap an account to view transactions.</div>
      </div>

      {/* Account cards — horizontal scroll */}
      <div style={{
        display: 'flex',
        gap: '10px',
        padding: '12px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch',
      }}>
        {accounts.map((acct, i) => {
          const id = acct.account_id || acct.id || '';
          const color = typeColor(id);
          const label = acct.account_type || typeLabel(id);
          const balance = acct.balance ?? acct.current_balance ?? acct.amount ?? 0;
          const currency = acct.currency || 'CAD';
          const limit = acct.daily_limit;
          const status = acct.status || 'Active';
          const acctNum = maskAcct(acct.account_number || id);

          return (
            <div key={i} style={{
              minWidth: '160px',
              background: '#FAFAFA',
              borderRadius: '12px',
              border: `1.5px solid ${color}22`,
              padding: '12px',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'box-shadow 0.15s',
            }}
              onClick={() => onCta && onCta(`view_transactions:${id}`)}
              onMouseEnter={e => e.currentTarget.style.boxShadow = `0 4px 16px ${color}22`}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              {/* Account type + number */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{
                  fontSize: '11px', fontWeight: 700, color, background: `${color}15`,
                  padding: '2px 7px', borderRadius: '20px',
                }}>{label}</span>
                <span style={{ fontSize: '10px', color: '#AAA' }}>{acctNum}</span>
              </div>

              {/* Balance */}
              <div style={{ fontSize: '11px', color: '#888', marginBottom: '2px' }}>Balance</div>
              <div style={{ fontSize: '17px', fontWeight: 800, color: '#1A1A1A', letterSpacing: '-0.5px' }}>
                {fmt(balance, currency)}
              </div>

              {/* Daily limit */}
              {limit && (
                <div style={{ fontSize: '10px', color: '#AAA', marginTop: '6px' }}>
                  Daily limit: {fmt(limit, currency)}
                </div>
              )}

              {/* Status pill */}
              <div style={{ marginTop: '8px' }}>
                <span style={{
                  fontSize: '10px', fontWeight: 600,
                  color: status.toLowerCase() === 'active' ? '#059669' : '#DC2626',
                  background: status.toLowerCase() === 'active' ? '#ECFDF5' : '#FEF2F2',
                  padding: '2px 8px', borderRadius: '20px',
                }}>{status}</span>
              </div>

              {/* View transactions link */}
              <div style={{
                marginTop: '10px',
                padding: '6px 0 0',
                borderTop: '1px solid #EBEBEB',
                fontSize: '11px', fontWeight: 600, color,
                textAlign: 'center', cursor: 'pointer',
              }}>
                View transactions →
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA buttons if any */}
      {ctas.length > 0 && (
        <div style={{ padding: '0 12px 12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {ctas.map((cta, i) => (
            <button key={i}
              onClick={() => onCta && onCta(cta.value || cta.utterance || cta.content)}
              style={{
                flex: 1, minWidth: '120px',
                padding: '9px 12px',
                background: i === 0 ? '#7C3AED' : '#F3F3F3',
                color: i === 0 ? '#fff' : '#1A1A1A',
                border: 'none', borderRadius: '10px',
                fontSize: '12px', fontWeight: 600, cursor: 'pointer',
              }}
            >
              {cta.label || cta.content || cta.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
