import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Route, SearchParams } from '../types';
import RouteCard from './RouteCard';
import RouteMap from './RouteMap';
import { SlidersHorizontal } from 'lucide-react';

interface RouteResultsProps {
  routes: Route[];
  searchParams: SearchParams | null;
}

const RouteResults: React.FC<RouteResultsProps> = ({ routes, searchParams }) => {
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const sortedRoutes = [...routes].sort((a, b) => {
    if (!searchParams) return 0;
    
    switch (searchParams.priority) {
      case 'fastest':
        return a.duration - b.duration;
      case 'cheapest':
        return a.cost - b.cost;
      case 'eco':
        return a.co2Emissions - b.co2Emissions;
      default:
        // Balanced scoring
        const scoreA = (a.duration * 0.4) + (a.cost * 0.3) + (a.co2Emissions * 0.3);
        const scoreB = (b.duration * 0.4) + (b.cost * 0.3) + (b.co2Emissions * 0.3);
        return scoreA - scoreB;
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800">
          Route Options ({routes.length})
        </h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters</span>
        </button>
      </div>

      {searchParams && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
          <p className="text-sm text-emerald-800">
            Routes optimized for: <span className="font-medium capitalize">{searchParams.priority}</span> priority
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="space-y-3">
          {sortedRoutes.map((route, index) => (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <RouteCard
                route={route}
                isSelected={selectedRoute === route.id}
                onClick={() => setSelectedRoute(route.id)}
                rank={index + 1}
                priority={searchParams?.priority || 'balanced'}
              />
            </motion.div>
          ))}
        </div>

        <div className="xl:sticky xl:top-20">
          <RouteMap
            routes={sortedRoutes}
            selectedRouteId={selectedRoute}
            searchParams={searchParams}
          />
        </div>
      </div>
    </div>
  );
};

export default RouteResults;