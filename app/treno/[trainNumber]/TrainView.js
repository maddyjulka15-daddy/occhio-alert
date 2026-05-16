'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { alertLevel } from '@/lib/level';

function getDeviceId() {
  if (typeof window === 'undefined') return null;
  let id = localStorage.getItem('device_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('device_id', id);
  }
  return id;
}

const COOLDOWN_MS = 15 * 60 * 1000;

export default function TrainView({ trainNumber }) {
  const [count, setCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [stops, setStops] = useState([]);
  const [info, setInfo] = useState(null);
  const [stopsLoading, setStopsLoading] = useState(true);

  const loadCount = useCallback(async () => {
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count: c } = await supabase
      .from('reports')
      .select('*', { count: 'exact', head: true })
      .eq('train_number', trainNumber)
      .gte('created_at', since);
    setCount(c || 0);
  }, [trainNumber]);

  const loadStops = useCallback(async () => {
    try {
      const res = await fetch(`/api/train-stops?trainNumber=${trainNumber}`, { cache: 'no-store' });
      const data = await res.json();
      setStops(data.stops || []);
      setInfo(data.info || null);
    } catch {
      setStops([]);
    } finally {
      setStopsLoading(false);
    }
  }, [trainNumber]);

  useEffect(() => {
    loadCount();
    loadStops();
    const channel = supabase
      .channel(`train-${trainNumber}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reports', filter: `train_number=eq.${trainNumber}` }, () => loadCount())
      .subscribe();
    const t = setInterval(loadStops, 120000);
    return () => { supabase.removeChannel(channel); clearInterval(t); };
  }, [trainNumber, loadCount, loadStops]);

  async function submit() {
    setSubmitting(true);
    setMessage(null);
    const deviceId = getDeviceId();
    const key = `last_report_${trainNumber}`;
    const last = parseInt(localStorage.getItem(key) || '0', 10);
    if (Date.now() - last < COOLDOWN_MS) {
      const mins = Math.ceil((COOLDOWN_MS - (Date.now() - last)) / 60000);
      setMessage(`Hai già segnalato. Riprova tra ${mins} min.`);
      setSubmitting(false);
      return;
    }
    const { error } = await supabase
      .from('reports')
      .insert({ train_number: trainNumber, device_id: deviceId });
    if (error) {
      setMessage('Errore. Riprova.');
    } else {
      localStorage.setItem(key, String(Date.now()));
      setMessage('Segnalazione inviata. Grazie!');
      loadCount();
    }
    setSubmitting(false);
  }

  const lvl = alertLevel(count);

  return (
    <main>
      <Link href="/" style={{ color: '#888', textDecoration: 'none' }}>← Home</Link>
      <h1 style={{ fontSize: 32, margin: '12px 0 4px' }}>Treno {trainNumber}</h1>
      {info && (
        <p style={{ color: '#aaa', margin: '0 0 4px', fontSize: 14 }}>
          {info.origin} → {info.destination}
          {info.category && <span style={{
            marginLeft: 8, padding: '2px 6px', background: '#2a2a2a',
            borderRadius: 4, fontSize: 11, color: '#aaa',
          }}>{info.category}</span>}
        </p>
      )}
      {info && info.delay !== 0 && (
        <p style={{ color: info.delay > 0 ? '#fb923c' : '#4ade80', margin: '4px 0', fontSize: 13 }}>
          {info.delay > 0 ? `In ritardo di ${info.delay}′` : `In anticipo di ${-info.delay}′`}
          {info.lastLocation && <span style={{ color: '#888' }}> · Ultimo rilevamento: {info.lastLocation}</span>}
        </p>
      )}
      <p style={{ color: '#aaa', margin: '12px 0 20px', fontSize: 14 }}>Segnala se vedi un controllore a bordo.</p>

      <div style={{
        padding: 20, background: '#1a1a1a', borderRadius: 12, marginBottom: 20, textAlign: 'center',
      }}>
        <div style={{ fontSize: 13, color: '#888' }}>Livello allerta (ultima ora)</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: lvl.color, marginTop: 4 }}>
          {lvl.emoji} {lvl.label}
        </div>
        <div style={{ color: '#888', fontSize: 13, marginTop: 4 }}>
          {count} segnalazion{count === 1 ? 'e' : 'i'}
        </div>
      </div>

      <button
        onClick={submit}
        disabled={submitting}
        style={{
          width: '100%', padding: '20px', fontSize: 18, fontWeight: 700,
          background: '#dc2626', color: '#fff', border: 'none', borderRadius: 12,
          cursor: 'pointer', opacity: submitting ? 0.6 : 1,
        }}
      >
        🚨 Controllore a bordo
      </button>

      {message && (
        <p style={{ marginTop: 16, padding: 12, background: '#1a1a1a', borderRadius: 8, color: '#aaa', textAlign: 'center' }}>
          {message}
        </p>
      )}

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>Fermate del treno</h2>
      {stopsLoading && <div style={{ color: '#888', padding: 12 }}>Caricamento fermate…</div>}
      {!stopsLoading && stops.length === 0 && (
        <div style={{ color: '#888', padding: 12, fontSize: 13 }}>
          Fermate non disponibili per questo treno.
        </div>
      )}
      <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {stops.map((s, i) => {
          const time = s.actualDeparture || s.scheduledDeparture || s.actualArrival || s.scheduledArrival || '';
          const delayed = s.actualDeparture && s.scheduledDeparture && s.actualDeparture !== s.scheduledDeparture;
          return (
            <li key={i} style={{
              padding: '12px 14px', background: '#1a1a1a', borderRadius: 8,
              marginBottom: 6, border: '1px solid #2a2a2a',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                {s.platform && <div style={{ color: '#666', fontSize: 11 }}>Bin. {s.platform}</div>}
              </div>
              <div style={{ fontSize: 14, color: delayed ? '#fb923c' : '#aaa', fontWeight: 500 }}>
                {time}
                {delayed && s.scheduledDeparture && <span style={{ color: '#666', textDecoration: 'line-through', marginLeft: 6, fontSize: 11 }}>{s.scheduledDeparture}</span>}
              </div>
            </li>
          );
        })}
      </ol>
    </main>
  );
}
