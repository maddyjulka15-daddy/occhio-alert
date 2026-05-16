// Only stations VERIFIED to return real-time data from ViaggiaTreno's /partenze endpoint.
// To add more: test the station code at
// http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno/partenze/{CODE}/{TIMESTAMP}
// If it returns trains, add here. If empty array, skip.
export const STATIONS = {
  'milano-centrale': { name: 'Milano Centrale', code: 'S01700' },
  'pavia': { name: 'Pavia', code: 'S01632' },
};

export const STATION_LIST = Object.entries(STATIONS).map(([slug, s]) => ({ slug, ...s }));
