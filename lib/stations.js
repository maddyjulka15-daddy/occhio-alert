export const STATIONS = {
  'milano-centrale': { name: 'Milano Centrale', code: 'S01700' },
  'pavia': { name: 'Pavia', code: 'S01632' },
};

export const STATION_LIST = Object.entries(STATIONS).map(([slug, s]) => ({ slug, ...s }));
