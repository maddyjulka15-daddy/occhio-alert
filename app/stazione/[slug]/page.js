import { STATIONS } from '@/lib/stations';
import StationView from './StationView';
import { notFound } from 'next/navigation';

const MILAN_ALL = {
  name: 'Milan (all stations)',
  multi: [
    { code: 'S01700', label: 'Centrale' },
    { code: 'S01645', label: 'P.Garibaldi' },
    { code: 'S01820', label: 'Rogoredo' },
    { code: 'S01066', label: 'Cadorna' },
    { code: 'S01642', label: 'Bovisa' },
  ],
};

export default async function StationPage({ params }) {
  const { slug } = await params;
  if (slug === 'milano-all') {
    return <StationView slug={slug} station={MILAN_ALL} />;
  }
  const station = STATIONS[slug];
  if (!station) notFound();
  return <StationView slug={slug} station={station} />;
}
