'use client';

import { cn } from '@/lib/utils';

export interface TabOption {
  id: string;
  label: string;
}

interface ChartTabsProps {
  tabs: TabOption[];
  selected: string;
  onSelect: (id: string) => void;
}

export default function ChartTabs({ tabs, selected, onSelect }: ChartTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 border-b mb-4">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onSelect(tab.id)}
          className={cn(
            'px-3 py-1 text-sm rounded-t-md border',
            selected === tab.id
              ? 'bg-white border-b-0 font-semibold'
              : 'bg-gray-100'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}