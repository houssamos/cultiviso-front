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
            'flex items-center gap-2 px-3 py-2 border-l-4 rounded-l-md text-sm',
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
