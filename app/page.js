'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { STATION_LIST } from '@/lib/stations';

const MILAN_SLUGS = new Set(['milano-centrale', 'milano-pgaribaldi', 'milano-rogoredo', 'milano-cadorna', 'milano-bovisa']);

export default function Home() {
  const router = useRouter();
  const [from, setFrom] = useState('milano-centrale');
  const [to, setTo] = useState('pavia');

  function search(e) {
    e.preventDefault();
    if (from === to) return;
    router.push(`/cerca?from=${from}&to=${to}`);
  }

  function swap() {
    setFrom(to);
    setTo(from);
  }

  const milanStations = STATION_LIST.filter(s => MILAN_SLUGS.has(s.slug));
  const otherStations = STATION_LIST.filter(s => !MILAN_SLUGS.has(s.slug));

  return (
    <main>
      <h1 style={{ fontSize: 30, margin: '0 0 4px' }}>Occhio</h1>
      <p style={{ color: '#aaa', margin: '0 0 20px', fontSize: 14 }}>
        Pick a station to see live departures and inspector alerts.
      </p>

      <Link
        href="/stazione/milano-all"
        style={{
          display: 'block', padding: 18, background: '#1a2942',
          border: '1px solid #3b82f6', borderRadius: 12, marginBottom: 12,
          textDecoration: 'none', color: '#fff',
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 2 }}>
          🏙️ Milan (all stations)
        </div>
        <div style={{ fontSize: 12, color: '#aaa' }}>
          Combined departures from Centrale, Garibaldi, Rogoredo, Cadorna, Bovisa
        </div>
      </Link>

      <div style={{ display: 'grid', gap: 8, marginBottom: 24 }}>
        {otherStations.map(s => (
          <Link
            key={s.slug}
            href={`/stazione/${s.slug}`}
            style={{
              padding: '14px 16px', background: '#1a1a1a',
              borderRadius: 10, textDecoration: 'none', color: '#fff',
              border: '1px solid #2a2a2a', fontSize: 15, fontWeight: 600,
            }}
          >
            {s.name}
          </Link>
        ))}
        {milanStations.map(s => (
          <Link
            key={s.slug}
            href={`/stazione/${s.slug}`}
            style={{
              padding: '12px 16px', background: '#141414',
              borderRadius: 10, textDecoration: 'none', color: '#ccc',
              border: '1px solid #232323', fontSize: 14,
            }}
          >
            {s.name}
          </Link>
        ))}
      </div>

      <details style={{ background: '#1a1a1a', padding: 12, borderRadius: 10, border: '1px solid #2a2a2a' }}>
        <summary style={{ cursor: 'pointer', color: '#aaa', fontSize: 13 }}>
          Or search a route →
        </summary>
        <form onSubmit={search} style={{ marginTop: 14 }}>
          <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>FROM</label>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            style={{
              width: '100%', padding: 12, fontSize: 16, marginBottom: 12,
              background: '#0a0a0a', color: '#fff', border: '1px solid #333', borderRadius: 8,
            }}
          >
            {STATION_LIST.map(s => <option key={s.slug} value={s.slug}>{s.name}</option>)}
          </select>

          <button
            type="button"
            onClick={swap}
            style={{
              display: 'block', margin: '0 auto 12px', padding: '6px 14px',
              background: '#2a2a2a', color: '#aaa', border: 'none', borderRadius: 6,
              cursor: 'pointer', fontSize: 13,
            }}
          >↑↓ Swap</button>

          <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>TO</label>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            style={{
              width: '100%', padding: 12, fontSize: 16, marginBottom: 16,
              background: '#0a0a0a', color: '#fff', border: '1px solid #333', borderRadius: 8,
            }}
          >
            {STATION_LIST.map(s => <option key={s.slug} value={s.slug}>{s.name}</option>)}
          </select>

          <button
            type="submit"
            style={{
              width: '100%', padding: 14, fontSize: 16, fontWeight: 700,
              background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8,
              cursor: 'pointer',
            }}
          >🔍 Search trains</button>
        </form>
      </details>
    </main>
  );
}
