'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadarController,
  RadialLinearScale,
  Tooltip,
  Legend,
  BubbleDataPoint,
  Filler,
  BubbleController
} from 'chart.js';
import { Line, Bar, Pie, Doughnut, Radar, PolarArea, Scatter, Bubble } from 'react-chartjs-2';
import { API_BASE, API_KEY } from '@/lib/api';
import ChartTabs, { TabOption } from '@/components/pages/stats/ChartTabs';
import IndicatorTabs, { IndicatorTabOption } from '@/components/pages/stats/IndicatorTabs';
import { FiLayers, FiTrendingUp, FiPackage } from 'react-icons/fi';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  RadarController,
  BubbleController,
  Tooltip,
  Legend,
  Filler
);

interface Culture {
  id: string;
  name: string;
  code: string
}

interface Region {
  id: string;
  name: string;
  code: string
}

interface StatItem {
  id: string;
  year: number;
  region?: Region;
  regionName?: string;
  culture: Culture;
  surfaceHa: number;
  yieldQxHa: number;
  productionT: number;
}

export default function StatsPage() {
  const [cultures, setCultures] = useState<Culture[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>();
  const [selectedCulture, setSelectedCulture] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [stats, setStats] = useState<StatItem[]>([]);
  const [selectedChart, setSelectedChart] = useState<string>('line');
  const [selectedIndicator, setSelectedIndicator] = useState<'surfaceHa' | 'yieldQxHa' | 'productionT'>('surfaceHa');

  useEffect(() => {
    fetch(`${API_BASE}/v1/cultures`, {
      headers: { 'X-api-key': API_KEY || '' }
    })
      .then((res) => res.json())
      .then(setCultures)
      .catch(console.error);

    fetch(`${API_BASE}/v1/cultures/years`, {
      headers: { 'X-api-key': API_KEY || '' }
    })
      .then((res) => res.json())
      .then(setYears)
      .catch(console.error);
    
    fetch(`${API_BASE}/v1/regions`, {
      headers: { 'X-api-key': API_KEY || '' }
    })
      .then((res) => res.json())
      .then(setRegions)
      .catch(console.error);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedYear) params.append('year', String(selectedYear));
    if (selectedCulture) params.append('cultureId', selectedCulture);
    if (selectedRegion) params.append('regionId', selectedRegion);
    params.append('page', '1');
    params.append('limit', '10000');

    fetch(`${API_BASE}/v1/stats?${params.toString()}`, {
      headers: { 'X-api-key': API_KEY || '' }
    })
      .then(res => res.json())
      .then(data => {
        const items = Array.isArray(data) ? data : data.items ?? data.data ?? [];
        setStats(items);
      })
      .catch(console.error);
  }, [selectedYear, selectedCulture, selectedRegion /*, granularity*/]);

  const yearMap = stats.reduce<Record<number, StatItem[]>>((acc, item) => {
    if (!acc[item.year]) acc[item.year] = [];
    acc[item.year].push(item);
    return acc;
  }, {});
  const yearLabels = Object.keys(yearMap).sort();
  const yields = yearLabels.map(y => {
    const arr = yearMap[Number(y)];
    const avg = arr.reduce((s, it) => s + it.yieldQxHa, 0) / (arr.length || 1);
    return Number(avg.toFixed(2));
  });
  const surfaces = yearLabels.map(yearLabel =>
    yearMap[Number(yearLabel)].reduce((s, it) => s + it.surfaceHa, 0)
  );
  const productionsByYear = yearLabels.map(yearLabel =>
    yearMap[Number(yearLabel)].reduce((s, it) => s + it.productionT, 0)
  );

  const regionMap = stats.reduce<Record<string, {surface: number; yieldSum: number; yieldCount: number; production: number}>>((acc, item) => {
    const key = item.region.name || item.region.id || item.regionName || 'N/A';
    if (!acc[key]) acc[key] = { surface: 0, yieldSum: 0, yieldCount: 0, production: 0 };
    acc[key].surface += item.surfaceHa;
    acc[key].yieldSum += item.yieldQxHa;
    acc[key].yieldCount += 1;
    acc[key].production += item.productionT;
    return acc;
  }, {});
  const regionLabels = Object.keys(regionMap);
  const surfacesRegion = regionLabels.map(r => regionMap[r].surface);
  const yieldsRegion = regionLabels.map(r => Number((regionMap[r].yieldSum / regionMap[r].yieldCount).toFixed(2)));
  const productionsRegion = regionLabels.map(r => regionMap[r].production);

  const colors = ['#ff6384', '#36a2eb', '#ffcd56', '#4bc0c0', '#9966ff', '#ff9f40'];

  const indicatorLabel = selectedIndicator === 'surfaceHa'
    ? 'Surface (ha)'
    : selectedIndicator === 'yieldQxHa'
      ? 'Rendement (q/ha)'
      : 'Production (q)';

  const yearValues = selectedIndicator === 'surfaceHa'
    ? surfaces
    : selectedIndicator === 'yieldQxHa'
      ? yields
      : productionsByYear;

  const regionValues = selectedIndicator === 'surfaceHa'
    ? surfacesRegion
    : selectedIndicator === 'yieldQxHa'
      ? yieldsRegion
      : productionsRegion;

  const lineData = {
    labels: yearLabels,
    datasets: [{
      label: indicatorLabel,
      data: yearValues,
      borderColor: 'rgb(75,192,192)',
      backgroundColor: 'rgba(75,192,192,0.2)'
    }]
  };

  const barData = {
    labels: yearLabels,
    datasets: [{
      label: indicatorLabel,
      data: yearValues,
      backgroundColor: 'rgba(53,162,235,0.5)'
    }]
  };

  const pieData = {
    labels: regionLabels,
    datasets: [{
      data: regionValues,
      backgroundColor: colors.slice(0, regionLabels.length)
    }]
  };
  const doughnutData = pieData;
  const radarData = lineData;
  const polarData = pieData;
  const scatterData = {
    datasets: [{
      label: 'Surface vs Rendement',
      data: stats.map(it => ({ x: it.surfaceHa, y: it.yieldQxHa })),
      backgroundColor: 'rgb(255,99,132)'
    }]
  };

  // Bubble chart data
  const minR = 4;
  const maxR = 30;
  const prodList = stats.map(it => it.productionT).filter(v => typeof v === 'number' && !isNaN(v));
  const minProd = Math.min(...prodList);
  const maxProd = Math.max(...prodList);
  const bubblePoints = stats.map(it => {
    let r = minR;
    if (typeof it.productionT === 'number' && !isNaN(it.productionT)) {
      if (maxProd > minProd) {
        r = minR + (maxR - minR) * ((it.productionT - minProd) / (maxProd - minProd));
      }
    }
    return { x: it.surfaceHa, y: it.yieldQxHa, r: Number(r.toFixed(2)) } as BubbleDataPoint;
  });
  
  const bubbleData = {
  datasets: [{
    label: 'Production',
    data: bubblePoints,
    backgroundColor: 'rgba(53,162,235,0.5)'
  }]
};

  const chartTabs: TabOption[] = [
    { id: 'line', label: 'Ligne' },
    { id: 'bar', label: 'Barres' },
    { id: 'pie', label: 'Secteurs' },
    { id: 'doughnut', label: 'Donut' },
    { id: 'radar', label: 'Radar' },
    { id: 'polar', label: 'Polar' },
    { id: 'scatter', label: 'Nuage' },
    { id: 'bubble', label: 'Bulles' },
    { id: 'barh', label: 'Barres H' },
  ];

  const indicatorTabs: IndicatorTabOption[] = [
    { id: 'surfaceHa', label: 'Surface', icon: FiLayers },
    { id: 'yieldQxHa', label: 'Rendement', icon: FiTrendingUp },
    { id: 'productionT', label: 'Production', icon: FiPackage },
  ];

  return (
    <div className="p-4 space-y-8">
      <div className="flex flex-wrap gap-4">
        <select
          value={selectedYear ?? ''}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="border px-2 py-1 rounded"
          aria-label="Filtrer par année"
        >
          <option value="">Année</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <select
          value={selectedCulture}
          onChange={(e) => setSelectedCulture(e.target.value)}
          className="border px-2 py-1 rounded max-w-[80vw]"
          aria-label="Filtrer par culture"
        >
          <option value="">Culture</option>
          {cultures.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="border px-2 py-1 rounded"
          aria-label="Filtrer par région"
        >
          <option value="">Région</option>
          {regions.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <IndicatorTabs
          tabs={indicatorTabs}
          selected={selectedIndicator}
          onSelect={(id) => setSelectedIndicator(id as 'surfaceHa' | 'yieldQxHa' | 'productionT')}
        />
        <div className="flex-1">
          <ChartTabs tabs={chartTabs} selected={selectedChart} onSelect={setSelectedChart} />
          <div className="w-full max-w-3xl">
            {selectedChart === 'line' && <Line data={lineData} />}
            {selectedChart === 'bar' && <Bar data={barData} />}
            {selectedChart === 'pie' && <Pie data={pieData} />}
            {selectedChart === 'doughnut' && <Doughnut data={doughnutData} />}
            {selectedChart === 'radar' && <Radar data={radarData} />}
            {selectedChart === 'polar' && <PolarArea data={polarData} />}
            {selectedChart === 'scatter' && <Scatter data={scatterData} />}
            {selectedChart === 'bubble' && <Bubble data={bubbleData} />}
            {selectedChart === 'barh' && <Bar data={barData} options={{ indexAxis: 'y' as const }} />}
          </div>
        </div>
      </div>
    </div>
  );
}