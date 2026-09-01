'use client';

import { TopologyId } from '@/lib/types';
import { TOPOLOGIES } from '@/lib/constants';

interface TopologySelectorProps {
  selectedTopology: TopologyId | null;
  onSelect: (topology: TopologyId) => void;
}

export const TopologySelector: React.FC<TopologySelectorProps> = ({
  selectedTopology,
  onSelect,
}) => {
  const topologies = [TOPOLOGIES.TOPO_1, TOPOLOGIES.TOPO_2];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        📊 Pilih Topologi Jaringan
      </h2>

      <div className="space-y-3">
        {topologies.map((topo) => (
          <label
            key={topo.id}
            className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedTopology === topo.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 bg-white dark:bg-gray-900'
            }`}
          >
            <input
              type="radio"
              name="topology"
              value={topo.id}
              checked={selectedTopology === topo.id}
              onChange={() => onSelect(topo.id as TopologyId)}
              className="mt-1 w-4 h-4 cursor-pointer"
            />
            <div className="ml-3 flex-1">
              <div className="font-semibold text-gray-900 dark:text-white">
                {topo.name}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {topo.description}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                Segments: {topo.segments.map((s) => s.name).join(' → ')}
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};
