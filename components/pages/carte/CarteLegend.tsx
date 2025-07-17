// 📁 components/pages/carte/CarteLegend.tsx
import React from 'react';

interface CarteLegendProps {
  thresholds: number[];
  colors: string[];
  indicator?: 'surfaceHa' | 'yieldQxHa' | 'productionT';
}

function getIndicatorLabel(indicator: string | undefined): string {
  switch (indicator) {
    case 'yieldQxHa': return 'Rendement (q/ha)';
    case 'productionT': return 'Production (q)';
    case 'surfaceHa':
    default: return 'Surface (ha)';
  }
}

const CarteLegend: React.FC<CarteLegendProps> = ({ thresholds, colors, indicator }) => {
  return (
    <div className="absolute right-2 bottom-20 bg-white shadow p-3 rounded text-sm z-10 w-56">
      <h4 className="font-semibold mb-2">{getIndicatorLabel(indicator)}</h4>
      {thresholds.map((threshold, i) => {
        const from = i === 0 ? 0 : thresholds[i - 1];
        const to = threshold;
        return (
          <div key={i} className="flex items-center gap-2 mb-1">
            <span className="w-4 h-4 rounded-sm" style={{ backgroundColor: colors[i + 1] }} />
            <span>{from.toLocaleString()} - {to.toLocaleString()}</span>
          </div>
        );
      })}
      <div className="flex items-center gap-2">
        <span className="w-4 h-4 rounded-sm" style={{ backgroundColor: colors[colors.length - 1] }} />
        <span>&gt; {thresholds[thresholds.length - 1].toLocaleString()}</span>
      </div>
    </div>
  );
};

export default CarteLegend;
