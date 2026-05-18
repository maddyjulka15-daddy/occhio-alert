// Pavia urban + suburban bus lines (Autoguidovie).
// Source: https://pavia.autoguidovie.it/it/l/linee-pavia/index

const URBAN_SCHEDULE_INDEX = 'https://pavia.autoguidovie.it/it/l/urbano-pavia/index';
const SUBURBAN_SCHEDULE_INDEX = 'https://pavia.autoguidovie.it/it/l/extraurbano-pavia/index';

// Colours approximated from Autoguidovie's official Pavia urban map legend.
// Bright/saturated hues chosen for visibility over dark map tiles.
export const BUS_LINES = [
  { id: '1',  type: 'urban',    color: '#2563eb', name: 'Cava Manara ↔ San Genesio',          terminusA: 'Cava Manara',         terminusB: 'San Genesio',         scheduleUrl: URBAN_SCHEDULE_INDEX },
  { id: '2',  type: 'urban',    color: '#22c55e', name: 'Garibaldi → Policlinico (circular)', terminusA: 'Garibaldi',           terminusB: 'Policlinico',         circular: true, scheduleUrl: URBAN_SCHEDULE_INDEX },
  { id: '3',  type: 'urban',    color: '#ef4444', name: 'Montebolone ↔ Colombarone',          terminusA: 'Montebolone',         terminusB: 'Colombarone',         scheduleUrl: URBAN_SCHEDULE_INDEX },
  { id: '4',  type: 'urban',    color: '#f97316', name: 'Vallone Maestà ↔ Torre d\'Isola',    terminusA: 'Vallone Maestà',      terminusB: 'Torre d\'Isola',      scheduleUrl: URBAN_SCHEDULE_INDEX },
  { id: '5',  type: 'urban',    color: '#84cc16', name: 'Stazione → Policlinico (circular)',  terminusA: 'Stazione FS',         terminusB: 'Policlinico',         circular: true, scheduleUrl: URBAN_SCHEDULE_INDEX },
  { id: '6',  type: 'urban',    color: '#eab308', name: 'Cassinetto ↔ Cascina Pelizza',       terminusA: 'Cassinetto',          terminusB: 'Cascina Pelizza',     scheduleUrl: URBAN_SCHEDULE_INDEX },
  { id: '7',  type: 'urban',    color: '#06b6d4', name: 'Maugeri Mondino ↔ Cura Carpignano',  terminusA: 'Maugeri Mondino',     terminusB: 'Cura Carpignano',     scheduleUrl: URBAN_SCHEDULE_INDEX },
  { id: '9',  type: 'urban',    color: '#c026d3', name: 'Policlinico San Matteo (internal)',  terminusA: 'Policlinico',         terminusB: 'Policlinico',         circular: true, scheduleUrl: URBAN_SCHEDULE_INDEX },
  { id: '10', type: 'urban',    color: '#14b8a6', name: 'Collegio Borromeo ↔ Cà della Terra', terminusA: 'Collegio Borromeo',   terminusB: 'Cà della Terra',      scheduleUrl: URBAN_SCHEDULE_INDEX },
  { id: '21', type: 'suburban', color: '#fb923c', name: 'Stazione ↔ Mezzana Corti',           terminusA: 'Stazione FS',         terminusB: 'Mezzana Corti',       scheduleUrl: SUBURBAN_SCHEDULE_INDEX },
  { id: '22', type: 'suburban', color: '#b45309', name: 'Stazione ↔ Travacò ↔ Boschi',        terminusA: 'Stazione FS',         terminusB: 'Boschi',              scheduleUrl: SUBURBAN_SCHEDULE_INDEX },
  { id: '23', type: 'suburban', color: '#facc15', name: 'Stazione ↔ San Genesio',             terminusA: 'Stazione FS',         terminusB: 'San Genesio',         scheduleUrl: SUBURBAN_SCHEDULE_INDEX },
  { id: '24', type: 'suburban', color: '#b91c1c', name: 'Montebolone ↔ Linarolo',             terminusA: 'Montebolone',         terminusB: 'Linarolo',            scheduleUrl: SUBURBAN_SCHEDULE_INDEX },
  { id: '25', type: 'suburban', color: '#737373', name: 'Montebolone ↔ Valle Salimbene',      terminusA: 'Montebolone',         terminusB: 'Valle Salimbene',     scheduleUrl: SUBURBAN_SCHEDULE_INDEX },
];

export function getBusLine(id) {
  return BUS_LINES.find(l => l.id === id) || null;
}
