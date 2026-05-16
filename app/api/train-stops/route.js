function formatTs(date) {
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const d = days[date.getUTCDay()];
  const mo = months[date.getUTCMonth()];
  const dd = String(date.getUTCDate()).padStart(2,'0');
  const yyyy = date.getUTCFullYear();
  const hh = String(date.getUTCHours()).padStart(2,'0');
  const mm = String(date.getUTCMinutes()).padStart(2,'0');
  const ss = String(date.getUTCSeconds()).padStart(2,'0');
  return `${d} ${mo} ${dd} ${yyyy} ${hh}:${mm}:${ss} GMT+0000`;
}

async function findOriginCode(trainNumber) {
  // ViaggiaTreno needs the origin station code to fetch the train's full route.
  // Use the autocomplete endpoint to find it.
  const url = `http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno/cercaNumeroTrenoTrenoAutocomplete/${trainNumber}`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const text = await res.text();
    if (!text) return null;
    // Returns lines like: "2614 - MILANO CENTRALE|2614-S01700-1747416000000"
    const line = text.split('\n')[0];
    const match = line.match(/(\d+)-(S\d+)-(\d+)/);
    if (!match) return null;
    return { originCode: match[2], departureTs: match[3] };
  } catch {
    return null;
  }
}

async function fetchStops(trainNumber, originCode, departureTs) {
  const url = `http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno/tratteCanvas/${originCode}/${trainNumber}/${departureTs}`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const text = await res.text();
    if (!text || text.trim() === '') return null;
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function fetchTrainInfo(trainNumber, originCode, departureTs) {
  const url = `http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno/andamentoTreno/${originCode}/${trainNumber}/${departureTs}`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const text = await res.text();
    if (!text || text.trim() === '') return null;
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function GET(req) {
  const url = new URL(req.url);
  const trainNumber = url.searchParams.get('trainNumber');
  if (!trainNumber) {
    return Response.json({ error: 'Missing trainNumber' }, { status: 400 });
  }

  const origin = await findOriginCode(trainNumber);
  if (!origin) {
    return Response.json({ stops: [], info: null, error: 'Train not found' });
  }

  const info = await fetchTrainInfo(trainNumber, origin.originCode, origin.departureTs);
  const fermate = info?.fermate || [];
  const stops = fermate.map(f => ({
    name: f.stazione || '',
    scheduledArrival: f.arrivo_teorico ? new Date(f.arrivo_teorico).toLocaleTimeString('it-IT').slice(0,5) : null,
    actualArrival: f.arrivoReale ? new Date(f.arrivoReale).toLocaleTimeString('it-IT').slice(0,5) : null,
    scheduledDeparture: f.partenza_teorica ? new Date(f.partenza_teorica).toLocaleTimeString('it-IT').slice(0,5) : null,
    actualDeparture: f.partenzaReale ? new Date(f.partenzaReale).toLocaleTimeString('it-IT').slice(0,5) : null,
    platform: f.binarioProgrammatoArrivoDescrizione || f.binarioProgrammatoPartenzaDescrizione || '',
    type: f.tipoFermata || '',
  }));

  return Response.json({
    stops,
    info: info ? {
      origin: info.origine || '',
      destination: info.destinazione || '',
      category: info.categoria || '',
      delay: typeof info.ritardo === 'number' ? info.ritardo : 0,
      lastUpdate: info.oraUltimoRilevamento || null,
      lastLocation: info.stazioneUltimoRilevamento || '',
    } : null,
  });
}
