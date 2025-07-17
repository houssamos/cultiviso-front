'use client';

import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef, useState } from 'react';
import { API_BASE } from '@/lib/api';

interface Culture {
  id: string;
  name: string;
  code: string;
}

const COLOR_SCALE = ['#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#005824'];

function computeThresholds(values: number[], steps: number = 6): number[] {
  const max = Math.max(...values);
  const tick = Math.ceil(max / steps);
  return Array.from({ length: steps - 1 }, (_, i) => tick * (i + 1));
}

function generateStepExpression(indicator: string, thresholds: number[], colors: string[]) {
  const step: any[] = ['step', ['get', indicator], colors[0]];
  thresholds.forEach((t, i) => step.push(t, colors[i + 1]));
  return step;
}

export default function CartePreview() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [cultureId, setCultureId] = useState<string>('');
  const [year, setYear] = useState<number | null>(null);

  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
      center: [2.2137, 46.2276],
      zoom: 5,
    });
  }, []);

  // Fetch cultures and available years
  useEffect(() => {
    const headers = { 'X-api-key': `${API_KEY}` };
    Promise.all([
      fetch(`${API_BASE}/v1/cultures`, { headers }).then(res => res.json()),
      fetch(`${API_BASE}/v1/cultures/years`, { headers }).then(res => res.json())
    ]).then(([cultures, years]: [Culture[], number[]]) => {
      const ble = cultures.find(c =>
        c.name.toLowerCase() === 'blé tendre' ||
        c.code.toLowerCase() === 'blé tendre' ||
        c.code.toLowerCase() === 'ble tendre' ||
        c.code.toLowerCase().includes('ble') && c.name.toLowerCase().includes('tendre')
      );
      if (ble) setCultureId(ble.id);
      if (years?.length) setYear(Math.max(...years));
    });
  }, []);

  // Fetch stats and draw layer
  useEffect(() => {
    if (!mapRef.current || !cultureId || !year) return;

    const map = mapRef.current;
    const url = `${API_BASE}/v1/stats/regions?year=${year}&cultureId=${cultureId}`;
    const headers = { 'X-api-key': `${API_KEY}` };

    fetch(url, { headers })
      .then(res => res.json())
      .then((geojson) => {
        if (!geojson || geojson.type !== 'FeatureCollection' || !geojson.features?.length) {
          console.warn('GeoJSON vide ou invalide', geojson);
          return;
        }

        const values = geojson.features
          .map((f: any) => f.properties['surfaceHa'])
          .filter((v: any) => typeof v === 'number' && !isNaN(v));

        const thresholds = computeThresholds(values);
        const fillColorStep = generateStepExpression('surfaceHa', thresholds, COLOR_SCALE);

        if (map.getLayer('choropleth')) map.removeLayer('choropleth');
        if (map.getSource('stats')) map.removeSource('stats');

        map.addSource('stats', {
          type: 'geojson',
          data: geojson,
        });

        map.addLayer({
          id: 'choropleth',
          type: 'fill',
          source: 'stats',
          paint: {
            'fill-color': fillColorStep,
            'fill-opacity': 0.75,
            'fill-outline-color': '#ffffff',
          },
        });
      });
  }, [cultureId, year]);

  return <div ref={mapContainer} className="w-full h-full" />;
}

