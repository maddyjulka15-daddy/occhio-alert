export const metadata = {
  title: 'Ticket Check Pavia',
  description: 'Segnalazioni community sui controllori della linea Milano–Pavia.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="google" content="notranslate" />
      </head>
      <body style={{
        margin: 0,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        background: '#0a0a0a',
        color: '#f5f5f5',
        minHeight: '100vh',
      }}>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 16px 80px' }}>
          {children}
        </div>
        <footer style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          padding: '8px 16px',
          background: '#0a0a0a',
          borderTop: '1px solid #222',
          fontSize: 11,
          color: '#888',
          textAlign: 'center',
        }}>
          Segnalazioni della community. Acquista sempre un biglietto valido. Non siamo affiliati a Trenord.
        </footer>
      </body>
    </html>
  );
}
