import React from 'react';
import { motion } from 'framer-motion';
import { Bus, Train, MapPin } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  const transitIcons = [Bus, Train, MapPin];

  return (
    <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200">
      <div className="flex justify-center space-x-4 mb-6">
        {transitIcons.map((Icon, index) => (
          <motion.div
            key={index}
            animate={{
              y: [0, -10, 0],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.2
            }}
            className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center"
          >
            <Icon className="w-6 h-6 text-emerald-600" />
          </motion.div>
        ))}
      </div>
      
      <motion.h3
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-xl font-semibold text-slate-700 mb-2"
      >
        Finding the best routes...
      </motion.h3>
      
      <p className="text-slate-500">
        Analyzing transit options and calculating carbon footprints
      </p>
      
      <div className="mt-6 flex justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full"
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;