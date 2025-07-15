import { Chart } from 'https://cdn.jsdelivr.net/npm/chart.js@4.5.0/dist/chart.umd.min.js';

// HISTORY LINE
export function drawHistory(ctx,data,labels){
  return new Chart(ctx,{
    type:'line',
    data:{labels,
      datasets:[{label:'kg CO₂/day',data,fill:true}]
    },
    options:{plugins:{legend:{display:false}}}
  });
}

// BREAKDOWN DOUGHNUT
export function drawBreakdown(ctx,vals){
  return new Chart(ctx,{
    type:'doughnut',
    data:{
      labels:['Transport','Energy','Food','Others'],
      datasets:[{data:vals}]
    },
    options:{responsive:true,cutout:'60%'}
  });
}
