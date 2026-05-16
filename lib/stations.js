export const STATIONS = {
  'milano-centrale': { name: 'Milano Centrale', code: 'S01700' },
  'milano-pgaribaldi': { name: 'Milano P.Garibaldi', code: 'S01645' },
  'pavia': { name: 'Pavia', code: 'S01632' },
};

export const STATION_LIST = Object.entries(STATIONS).map(([slug, s]) => ({ slug, ...s }));
