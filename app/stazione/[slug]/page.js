import { STATIONS } from '@/lib/stations';
import StationView from './StationView';
import { notFound } from 'next/navigation';

export default async function StationPage({ params }) {
  const { slug } = await params;
  const station = STATIONS[slug];
  if (!station) notFound();
  return <StationView slug={slug} station={station} />;
}
