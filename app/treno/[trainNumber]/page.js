import TrainView from './TrainView';

export default async function TrainPage({ params }) {
  const { trainNumber } = await params;
  return <TrainView trainNumber={trainNumber} />;
}
