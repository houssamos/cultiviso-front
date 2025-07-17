'use client';

import CarteLegend from '@/components/pages/carte/CarteLegend';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef, useState } from 'react';
import { API_BASE } from '@/lib/api';

const COLOR_SCALE = ['#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#005824'];

function computeThresholds(values: number[], steps: number = 6): number[] {
  const max = Math.max(...values);
  const tick = Math.ceil(max / steps);
  return Array.from({ length: steps - 1 }, (_, i) => tick * (i + 1));
}

export default function CartePreview() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [thresholds, setThresholds] = useState<number[]>([]);

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

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const url = `${API_BASE}/v1/stats/regions?year=2023&cultureId=BL`;

    fetch(url, {
      headers: { 'X-api-key': `${API_KEY}` },
    })
      .then(res => res.json())
      .then((geojson) => {
        if (!geojson || geojson.type !== 'FeatureCollection' || !geojson.features?.length) return;

        const values = geojson.features
          .map((f: any) => f.properties.surfaceHa)
          .filter((v: any) => typeof v === 'number' && !isNaN(v));

        const thresholds = computeThresholds(values);
        const fillColorStep: any[] = ['step', ['get', 'surfaceHa'], COLOR_SCALE[0]];
        thresholds.forEach((t, i) => fillColorStep.push(t, COLOR_SCALE[i + 1]));

        setThresholds(thresholds);

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
  }, []);

  return (
    <div className="relative w-full h-64">
      <div ref={mapContainer} className="w-full h-full" />
      {thresholds.length > 0 && (
        <CarteLegend thresholds={thresholds} colors={COLOR_SCALE} indicator="surfaceHa" />
      )}
    </div>
  );
}
