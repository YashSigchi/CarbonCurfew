import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Award, 
  TrendingUp, 
  Users, 
  Calendar, 
  Leaf,
  Target,
  BarChart3
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const stats = [
    { label: 'This Week', value: '2.3 kg', icon: Calendar, color: 'text-emerald-600' },
    { label: 'This Month', value: '12.3 kg', icon: TrendingUp, color: 'text-blue-600' },
    { label: 'Total Saved', value: '45.7 kg', icon: Target, color: 'text-purple-600' },
  ];

  const leaderboard = [
    { name: 'Alex Chen', savings: '23.4 kg', rank: 1 },
    { name: 'Sarah Kim', savings: '21.2 kg', rank: 2 },
    { name: 'You', savings: '12.3 kg', rank: 8 },
    { name: 'Mike Johnson', savings: '11.8 kg', rank: 9 },
    { name: 'Lisa Park', savings: '10.5 kg', rank: 10 },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                  <Leaf className="w-6 h-6 mr-2 text-emerald-600" />
                  Your Impact
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* CO2 Savings Stats */}
              <div className="space-y-4 mb-8">
                <h3 className="text-lg font-semibold text-slate-700 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  CO₂ Savings
                </h3>
                <div className="grid gap-3">
                  {stats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-slate-50 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-slate-600">{stat.label}</p>
                            <p className="text-xl font-bold text-slate-800">{stat.value}</p>
                          </div>
                          <IconComponent className={`w-6 h-6 ${stat.color}`} />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Community Leaderboard */}
              <div className="space-y-4 mb-8">
                <h3 className="text-lg font-semibold text-slate-700 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Community Leaderboard
                </h3>
                <div className="space-y-2">
                  {leaderboard.map((user, index) => (
                    <motion.div
                      key={user.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        user.name === 'You' ? 'bg-emerald-50 border border-emerald-200' : 'bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          user.rank <= 3 ? 'bg-yellow-500 text-white' : 'bg-slate-300 text-slate-700'
                        }`}>
                          {user.rank <= 3 ? <Award className="w-3 h-3" /> : user.rank}
                        </div>
                        <span className={`font-medium ${
                          user.name === 'You' ? 'text-emerald-700' : 'text-slate-700'
                        }`}>
                          {user.name}
                        </span>
                      </div>
                      <span className="text-sm text-slate-600">{user.savings}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Achievement Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl p-6 text-white text-center"
              >
                <Award className="w-12 h-12 mx-auto mb-3" />
                <h4 className="text-lg font-bold mb-2">Eco Warrior</h4>
                <p className="text-sm opacity-90">
                  You've saved enough CO₂ to offset a 200-mile car trip!
                </p>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;