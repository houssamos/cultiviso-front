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
  Filler
} from 'chart.js';
import { Line, Bar, Pie, Doughnut, Radar, PolarArea, Scatter, Bubble } from 'react-chartjs-2';
import { API_BASE } from '@/lib/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  RadarController,
  Tooltip,
  Legend,
  Filler
);

interface Culture {
  id: string;
  name: string;
}

export default function StatsPage() {
  const [cultures, setCultures] = useState<Culture[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>();
  const [selectedCulture, setSelectedCulture] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [granularity, setGranularity] = useState<string>('region');

  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

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
  }, []);

  // Sample data for demonstration
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  const numbers = labels.map((_, i) => i + 1);

  const baseDataset = {
    label: 'Exemple',
    data: numbers,
    borderColor: 'rgb(75,192,192)',
    backgroundColor: 'rgba(75,192,192,0.2)'
  };

  const lineData = { labels, datasets: [baseDataset] };
  const barData = { labels, datasets: [{ ...baseDataset, backgroundColor: 'rgba(53,162,235,0.5)' }] };
  const pieData = {
    labels: labels.slice(0, 5),
    datasets: [{ data: numbers.slice(0, 5), backgroundColor: ['#ff6384', '#36a2eb', '#ffcd56', '#4bc0c0', '#9966ff'] }]
  };
  const doughnutData = pieData;
  const radarData = lineData;
  const polarData = pieData;
  const scatterData = {
    datasets: [{
      label: 'Scatter',
      data: numbers.map((n) => ({ x: n, y: Math.random() * 10 })),
      backgroundColor: 'rgb(255,99,132)'
    }]
  };
  const bubbleData = {
    datasets: [{
      label: 'Bubble',
      data: numbers.map((n) => ({ x: n, y: Math.random() * 10, r: 5 + Math.random() * 10 })) as BubbleDataPoint[],
      backgroundColor: 'rgba(53,162,235,0.5)'
    }]
  };

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
          className="border px-2 py-1 rounded"
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
          <option value="idf">Île-de-France</option>
          <option value="na">Nouvelle-Aquitaine</option>
        </select>
        <select
          value={granularity}
          onChange={(e) => setGranularity(e.target.value)}
          className="border px-2 py-1 rounded"
          aria-label="Filtrer par granularité"
        >
          <option value="region">Région</option>
          <option value="departement">Département</option>
          <option value="commune">Commune</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <Line data={lineData} />
        <Bar data={barData} />
        <Pie data={pieData} />
        <Doughnut data={doughnutData} />
        <Radar data={radarData} />
        <PolarArea data={polarData} />
        <Scatter data={scatterData} />
        <Bubble data={bubbleData} />
        <Bar data={barData} options={{ indexAxis: 'y' as const }} />
      </div>
    </div>
  );
}