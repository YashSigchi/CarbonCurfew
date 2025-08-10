import React from 'react';
import { motion } from 'framer-motion';
import { Clock, DollarSign, Leaf, ArrowRight, Medal } from 'lucide-react';
import { Route } from '../types';
import TransitModeIcon from './TransitModeIcon';

interface RouteCardProps {
  route: Route;
  isSelected: boolean;
  onClick: () => void;
  rank: number;
  priority: string;
}

const RouteCard: React.FC<RouteCardProps> = ({ 
  route, 
  isSelected, 
  onClick, 
  rank,
  priority 
}) => {
  const getCO2Color = (emissions: number) => {
    if (emissions <= 0.5) return 'text-emerald-600 bg-emerald-100';
    if (emissions <= 1.0) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-yellow-500 text-white';
      case 2: return 'bg-slate-400 text-white';
      case 3: return 'bg-amber-600 text-white';
      default: return 'bg-slate-300 text-slate-700';
    }
  };

  const getPriorityHighlight = () => {
    switch (priority) {
      case 'fastest': return route.duration;
      case 'cheapest': return route.cost;
      case 'eco': return route.co2Emissions;
      default: return null;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`bg-white rounded-xl p-4 cursor-pointer transition-all border-2 ${
        isSelected 
          ? 'border-emerald-500 shadow-lg' 
          : 'border-slate-200 hover:border-slate-300 shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getRankColor(rank)}`}>
            {rank <= 3 ? <Medal className="w-3 h-3" /> : rank}
          </div>
          <div className="flex items-center space-x-1">
            {route.modes.map((mode, index) => (
              <React.Fragment key={index}>
                {index > 0 && <ArrowRight className="w-3 h-3 text-slate-400" />}
                <TransitModeIcon mode={mode} size="sm" />
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getCO2Color(route.co2Emissions)}`}>
          {route.co2Emissions.toFixed(1)}kg CO₂
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-3">
        <div className={`text-center ${priority === 'fastest' ? 'bg-blue-50 rounded-lg p-2' : ''}`}>
          <Clock className="w-4 h-4 text-slate-600 mx-auto mb-1" />
          <div className="text-lg font-semibold text-slate-800">{route.duration}m</div>
          <div className="text-xs text-slate-500">Duration</div>
        </div>
        
        <div className={`text-center ${priority === 'cheapest' ? 'bg-green-50 rounded-lg p-2' : ''}`}>
          <div className="w-4 h-4 text-slate-600 mx-auto mb-1" >₹</div>
          <div className="text-lg font-semibold text-slate-800">₹{route.cost}</div>
          <div className="text-xs text-slate-500">Cost</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-semibold text-slate-800">{route.transfers}</div>
          <div className="text-xs text-slate-500">Transfers</div>
        </div>
      </div>

      <div className="space-y-2">
        {route.steps.map((step, index) => (
          <div key={index} className="flex items-center space-x-2 text-sm">
            <TransitModeIcon mode={step.mode} size="xs" />
            <span className="text-slate-600 flex-1">{step.description}</span>
            <span className="text-slate-500 text-xs">{step.duration}m</span>
          </div>
        ))}
      </div>

      {isSelected && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 pt-3 border-t border-slate-200"
        >
          <p className="text-xs text-slate-500">
            This route saves approximately {(1.5 - route.co2Emissions).toFixed(1)}kg CO₂ 
            compared to driving alone.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RouteCard;