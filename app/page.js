import Link from 'next/link';
import { STATION_LIST } from '@/lib/stations';

export default function Home() {
  return (
    <main>
      <h1 style={{ fontSize: 32, margin: '0 0 8px' }}>Ticket Check Pavia</h1>
      <p style={{ color: '#aaa', margin: '0 0 24px' }}>
        Segnalazioni community sui controllori. Linea Milano–Pavia.
      </p>
      <h2 style={{ fontSize: 14, textTransform: 'uppercase', color: '#888', letterSpacing: 1 }}>
        Scegli una stazione
      </h2>
      <div style={{ display: 'grid', gap: 12 }}>
        {STATION_LIST.map((s) => (
          <Link
            key={s.slug}
            href={`/stazione/${s.slug}`}
            style={{
              display: 'block',
              padding: '20px',
              background: '#1a1a1a',
              borderRadius: 12,
              textDecoration: 'none',
              color: '#fff',
              border: '1px solid #2a2a2a',
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 600 }}>{s.name}</div>
            <div style={{ color: '#888', fontSize: 13, marginTop: 4 }}>
              Vedi prossime partenze →
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
