'use client';

import { cn } from '@/lib/utils';
import { IconType } from 'react-icons';

export interface IndicatorTabOption {
  id: string;
  label: string;
  icon: IconType;
}

interface IndicatorTabsProps {
  tabs: IndicatorTabOption[];
  selected: string;
  onSelect: (id: string) => void;
}

export default function IndicatorTabs({ tabs, selected, onSelect }: IndicatorTabsProps) {
  return (
    <div className="flex flex-col gap-2">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onSelect(id)}
          className={cn(
            'flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-2 text-sm border-b-4 md:border-b-0 md:border-l-4 rounded-b-md md:rounded-l-md',
            selected === id ? 'bg-white border-primary font-semibold' : 'bg-gray-100 border-transparent'
          )}
        >
          <Icon size={16} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
