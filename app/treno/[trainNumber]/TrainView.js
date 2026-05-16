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

  const loadCount = useCallback(async () => {
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count: c } = await supabase
      .from('reports')
      .select('*', { count: 'exact', head: true })
      .eq('train_number', trainNumber)
      .gte('created_at', since);
    setCount(c || 0);
  }, [trainNumber]);

  useEffect(() => {
    loadCount();
    const channel = supabase
      .channel(`train-${trainNumber}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reports', filter: `train_number=eq.${trainNumber}` }, () => loadCount())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [trainNumber, loadCount]);

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
      <p style={{ color: '#aaa', margin: '0 0 24px' }}>Segnala se vedi un controllore a bordo.</p>

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
    </main>
  );
}
