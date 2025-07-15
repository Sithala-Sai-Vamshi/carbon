/* Factors are kg CO₂ e / unit  (approxIPCC‑AR6) */
export const factors = {
  transport : { car: 0.18, bus: 0.09, flight: 0.25 }, // /km
  electricity: 0.6/30,   // kWh/month → kg/day
  water:      0.0003,    // per litre
  diet:       { veg: 2.1, mixed: 3.6, highMeat: 5.4 }, // kg/day
  waste:      2.5,       // kg CO₂ per kg waste
  home:       0.0005,    // kg CO₂ per m² per day
  appliances: 15         // kg per appliance per year
};

export function calcEmission(act){
  /* `act` = {transportMode,val,electricity,water,diet,waste,homeSize,appliances,trips}*/
  const t = (act.val || 0) * factors.transport[act.transportMode];
  const e = (act.electricity || 0) * factors.electricity;
  const w = (act.water || 0) * factors.water;
  const f = factors.diet[act.diet] + (act.waste||0)*factors.waste/7;
  const h = (act.homeSize||0)*factors.home;
  const a = (act.appliances||0)*factors.appliances/365;
  const tr = (act.trips||0) * 300; // rough flight average each way
  return +(t+e+w+f+h+a+tr).toFixed(2); // daily kg
}
