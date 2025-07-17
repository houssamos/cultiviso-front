// components/pages/carte/CarteComponent.tsx
'use client';

import FooterNav from '@/components/layout/FooterNav';
import CarteLegend from '@/components/pages/carte/CarteLegend';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef, useState } from 'react';
import bbox from '@turf/bbox';
import booleanOverlap from '@turf/boolean-overlap';
import * as turf from '@turf/helpers';
import { API_BASE } from '@/lib/api';


interface Culture {
  id: string;
  name: string;
  code: string;
}

const COLOR_SCALE = ['#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#005824'];

type Indicator = 'surfaceHa' | 'yieldQxHa' | 'productionT';

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

function getUnit(indicator: string) {
  switch (indicator) {
    case 'surfaceHa': return 'ha';
    case 'yieldQxHa': return 'q/ha';
    case 'productionT': return 'q';
    default: return '';
  }
}

function formatLabel(indicator: string) {
  switch (indicator) {
    case 'surfaceHa': return 'Surface';
    case 'yieldQxHa': return 'Rendement';
    case 'productionT': return 'Production';
    default: return indicator;
  }
}

function buildPopupHTML(name: string, value: number | undefined, indicator: Indicator) {
  const formatted = typeof value === 'number' && !isNaN(value)
    ? value.toLocaleString('fr-FR')
    : 'N/A';
  return `<strong>${name}</strong><br/>${formatLabel(indicator)} : ${formatted} ${getUnit(indicator)}`;
}


export default function CarteComponent() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  const [cultures, setCultures] = useState<Culture[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [selectedCulture, setSelectedCulture] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [selectedIndicator, setSelectedIndicator] = useState<Indicator>('surfaceHa');
  const [thresholds, setThresholds] = useState<number[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [hoverInfo, setHoverInfo] = useState<{ regionName: string, surfaceHa: number, yieldQxHa: number, productionT: number } | null>(null);

  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

  useEffect(() => {
    fetch(`${API_BASE}/v1/cultures`, {
      headers: { 'X-api-key': `${API_KEY}` },
    }).then(res => res.json()).then(setCultures);

    fetch(`${API_BASE}/v1/cultures/years`, {
      headers: { 'X-api-key': `${API_KEY}` },
    }).then(res => res.json()).then(setYears);
  }, []);

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
    if (!selectedYear || !selectedCulture || !mapRef.current) return;

    const map = mapRef.current;
    const url = `${API_BASE}/v1/stats/regions?year=${selectedYear}&cultureId=${selectedCulture}`;

    fetch(url, {
      headers: { 'X-api-key': `${API_KEY}` },
    })
      .then(res => res.json())
      .then((geojson) => {
        if (!geojson || geojson.type !== 'FeatureCollection' || !geojson.features?.length) {
          console.warn("GeoJSON vide ou invalide", geojson);
          return;
        }

        const values = geojson.features
          .map((f: any) => f.properties[selectedIndicator])
          .filter((v: any) => typeof v === 'number' && !isNaN(v));

        const thresholds = computeThresholds(values);
        const fillColorStep = generateStepExpression(selectedIndicator, thresholds, COLOR_SCALE);

        setThresholds(thresholds);
        setColors(COLOR_SCALE);

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

        map.on('mousemove', 'choropleth', (e) => {
          const feature = e.features?.[0];
          if (!feature) return;

          const props = feature.properties;
          setHoverInfo({
            regionName: props.regionName,
            surfaceHa: props.surfaceHa,
            yieldQxHa: props.yieldQxHa,
            productionT: props.productionT
          });

          if (map.getLayer('hover-outline')) map.removeLayer('hover-outline');
          if (map.getSource('hover')) map.removeSource('hover');

          map.addSource('hover', {
            type: 'geojson',
            data: feature
          });

          map.addLayer({
            id: 'hover-outline',
            type: 'line',
            source: 'hover',
            paint: {
              'line-color': '#000',
              'line-width': 3,
              'line-opacity': 0.6
            }
          });
        });

        map.on('mouseleave', 'choropleth', () => {
          setHoverInfo(null);
          if (map.getLayer('hover-outline')) map.removeLayer('hover-outline');
          if (map.getSource('hover')) map.removeSource('hover');
        });
      });
  }, [selectedYear, selectedCulture, selectedIndicator]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 bg-white z-10 shadow flex flex-col sm:flex-row gap-2 justify-center items-center">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="border px-2 py-1 rounded"
          aria-label="Filtrer par année"
        >
          <option value="">Année</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>

        <select
          value={selectedCulture}
          onChange={(e) => setSelectedCulture(e.target.value)}
          className="border px-2 py-1 rounded max-w-[80vw]"
          aria-label="Filtrer par culture"
        >
          <option value="">Culture</option>
          {cultures.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <select
          value={selectedIndicator}
          onChange={(e) => setSelectedIndicator(e.target.value as Indicator)}
          className="border px-2 py-1 rounded"
          aria-label="Filtrer par indicateur"
        >
          <option value="surfaceHa">Surface</option>
          <option value="yieldQxHa">Rendement</option>
          <option value="productionT">Production</option>
        </select>
      </div>

      <div ref={mapContainer} className="flex-1 relative">
        {hoverInfo && (
          <div className="absolute top-4 right-4 bg-white shadow p-4 rounded text-sm z-20 min-w-[200px]">
            <h4 className="font-semibold mb-2">{hoverInfo.regionName}</h4>
             <p className={selectedIndicator === 'surfaceHa' ? 'font-bold text-neutral-700' : ''}>🌱 Surface : {hoverInfo.surfaceHa.toLocaleString()} ha</p>
              <p className={selectedIndicator === 'yieldQxHa' ? 'font-bold text-neutral-700' : ''}>📈 Rendement : {hoverInfo.yieldQxHa.toLocaleString()} q/ha</p>
              <p className={selectedIndicator === 'productionT' ? 'font-bold text-neutral-700' : ''}>🏭 Production : {hoverInfo.productionT.toLocaleString()} q</p>
          </div>
        )}
      </div>

      {thresholds.length > 0 && (
        <CarteLegend thresholds={thresholds} colors={colors} indicator={selectedIndicator} />
      )}
      <FooterNav />
    </div>
  );
}
