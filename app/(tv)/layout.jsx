export default function TVLayout({ children }) {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      background: '#F0F5FA',
      color: '#0F2C59',
      fontFamily: "'Plus Jakarta Sans', var(--font-jakarta), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      display: 'flex',
      flexDirection: 'column'
    }}>
      {children}
    </div>
  );
}
