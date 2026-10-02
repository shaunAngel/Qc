import type { ConsumptionPoint } from '@/types';

// 30-day fleet fuel consumption series (Jan 01 – Jan 30)
// consumption: realistic daily total with natural variation around 350 t/day
// target: flat reference line at 320 t/day
// forecast: provided for the last 7 days (Jan 24 – Jan 30)
export const consumptionSeries: ConsumptionPoint[] = [
  { date: 'Jan 01', consumption: 348, target: 320 },
  { date: 'Jan 02', consumption: 355, target: 320 },
  { date: 'Jan 03', consumption: 362, target: 320 },
  { date: 'Jan 04', consumption: 340, target: 320 },
  { date: 'Jan 05', consumption: 328, target: 320 },
  { date: 'Jan 06', consumption: 315, target: 320 },
  { date: 'Jan 07', consumption: 330, target: 320 },
  { date: 'Jan 08', consumption: 345, target: 320 },
  { date: 'Jan 09', consumption: 368, target: 320 },
  { date: 'Jan 10', consumption: 380, target: 320 },
  { date: 'Jan 11', consumption: 372, target: 320 },
  { date: 'Jan 12', consumption: 358, target: 320 },
  { date: 'Jan 13', consumption: 342, target: 320 },
  { date: 'Jan 14', consumption: 335, target: 320 },
  { date: 'Jan 15', consumption: 350, target: 320 },
  { date: 'Jan 16', consumption: 365, target: 320 },
  { date: 'Jan 17', consumption: 378, target: 320 },
  { date: 'Jan 18', consumption: 390, target: 320 },
  { date: 'Jan 19', consumption: 382, target: 320 },
  { date: 'Jan 20', consumption: 370, target: 320 },
  { date: 'Jan 21', consumption: 355, target: 320 },
  { date: 'Jan 22', consumption: 340, target: 320 },
  { date: 'Jan 23', consumption: 330, target: 320 },
  // Last 7 days — both actual and forecast values
  { date: 'Jan 24', consumption: 345, target: 320, forecast: 352 },
  { date: 'Jan 25', consumption: 360, target: 320, forecast: 355 },
  { date: 'Jan 26', consumption: 375, target: 320, forecast: 368 },
  { date: 'Jan 27', consumption: 388, target: 320, forecast: 380 },
  { date: 'Jan 28', consumption: 395, target: 320, forecast: 390 },
  { date: 'Jan 29', consumption: 408, target: 320, forecast: 400 },
  { date: 'Jan 30', consumption: 420, target: 320, forecast: 415 },
];
