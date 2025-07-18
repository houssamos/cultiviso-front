import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
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

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
      center: [2.2137, 46.2276],
      zoom: 5,
      attributionControl: false,
    });

    const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

    async function fetchAndRender() {
      try {
        const yearsRes = await fetch(`${API_BASE}/v1/cultures/years`, {
          headers: { 'X-api-key': `${API_KEY}` },
        });
        const years: number[] = await yearsRes.json();
        const maxYear = Math.max(...years);

        const culturesRes = await fetch(`${API_BASE}/v1/cultures`, {
          headers: { 'X-api-key': `${API_KEY}` },
        });
        const cultures: Culture[] = await culturesRes.json();
        const culture = cultures.find(c => c.name === 'total Blé tendre');
        if (!culture) return;
        const cultureId = culture.id;

        const url = `${API_BASE}/v1/stats/regions?year=${maxYear}&cultureId=${cultureId}`;
        const geoRes = await fetch(url, { headers: { 'X-api-key': `${API_KEY}` } });
        const geojson = await geoRes.json();

        if (!geojson || geojson.type !== 'FeatureCollection' || !geojson.features?.length) {
          console.warn('GeoJSON vide ou invalide', geojson);
          return;
        }

        const values = geojson.features
          .map((f: any) => f.properties['surfaceHa'])
          .filter((v: any) => typeof v === 'number' && !isNaN(v));

        const thresholds = computeThresholds(values);
        const fillColorStep = generateStepExpression('surfaceHa', thresholds, COLOR_SCALE);

        const map = mapRef.current!;
        if (map.getLayer('choropleth')) map.removeLayer('choropleth');
        if (map.getSource('stats')) map.removeSource('stats');

        map.addSource('stats', { type: 'geojson', data: geojson });

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
      } catch (err) {
        console.error(err);
      }
    }

    fetchAndRender();
  }, []);

  return <div ref={mapContainer} className="w-full h-full" />;
}

