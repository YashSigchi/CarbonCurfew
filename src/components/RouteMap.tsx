// import React from 'react';
// import { motion } from 'framer-motion';
// import { Map, Navigation, Info } from 'lucide-react';
// import { Route, SearchParams } from '../types';

// interface RouteMapProps {
//   routes: Route[];
//   selectedRouteId: string | null;
//   searchParams: SearchParams | null;
// }

// const RouteMap: React.FC<RouteMapProps> = ({ 
//   routes, 
//   selectedRouteId, 
//   searchParams 
// }) => {
//   const selectedRoute = routes.find(r => r.id === selectedRouteId);

//   return (
//     <motion.div
//       initial={{ opacity: 0, x: 20 }}
//       animate={{ opacity: 1, x: 0 }}
//       className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
//     >
//       <div className="p-4 border-b border-slate-200">
//         <div className="flex items-center justify-between">
//           <h3 className="font-semibold text-slate-800 flex items-center">
//             <Map className="w-5 h-5 mr-2 text-emerald-600" />
//             Route Map
//           </h3>
//           {selectedRoute && (
//             <div className="flex items-center space-x-2">
//               <Navigation className="w-4 h-4 text-slate-500" />
//               <span className="text-sm text-slate-600">
//                 {selectedRoute.duration}m • ${selectedRoute.cost}
//               </span>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="h-64 md:h-80 bg-gradient-to-br from-emerald-50 to-blue-50 relative overflow-hidden">
//         {/* Mock map visualization */}
//         <div className="absolute inset-0 flex items-center justify-center">
//           <div className="text-center">
//             <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Map className="w-8 h-8 text-emerald-600" />
//             </div>
//             {selectedRoute ? (
//               <div>
//                 <p className="text-lg font-semibold text-slate-700 mb-2">
//                   Route Preview
//                 </p>
//                 <p className="text-sm text-slate-500 max-w-sm">
//                   Interactive map would show the selected route with transit lines, 
//                   stops, and walking segments.
//                 </p>
//               </div>
//             ) : (
//               <div>
//                 <p className="text-lg font-semibold text-slate-700 mb-2">
//                   Select a Route
//                 </p>
//                 <p className="text-sm text-slate-500">
//                   Click on a route card to view it on the map
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Mock route paths */}
//         {selectedRoute && (
//           <motion.div
//             initial={{ pathLength: 0 }}
//             animate={{ pathLength: 1 }}
//             transition={{ duration: 1.5 }}
//             className="absolute inset-0"
//           >
//             <svg className="w-full h-full">
//               <defs>
//                 <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
//                   <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
//                   <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.8" />
//                 </linearGradient>
//               </defs>
//               <path
//                 d="M 20 80 Q 120 40 220 60 T 380 80"
//                 stroke="url(#routeGradient)"
//                 strokeWidth="4"
//                 fill="none"
//                 strokeLinecap="round"
//                 className="animate-pulse"
//               />
//             </svg>
//           </motion.div>
//         )}
//       </div>

//       {selectedRoute && (
//         <div className="p-4">
//           <div className="flex items-start space-x-2">
//             <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
//             <div className="text-sm text-slate-600">
//               <p className="font-medium mb-1">Route Details</p>
//               <p>
//                 This {selectedRoute.duration}-minute journey includes {selectedRoute.transfers} transfer{selectedRoute.transfers !== 1 ? 's' : ''} 
//                 and produces {selectedRoute.co2Emissions.toFixed(1)}kg of CO₂ emissions.
//               </p>
//             </div>
//           </div>
//         </div>
//       )}
//     </motion.div>
//   );
// };

// export default RouteMap;











import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Map, Navigation, Info, AlertCircle } from 'lucide-react';
import { Route, SearchParams } from '../types';

interface RouteMapProps {
  routes: Route[];
  selectedRouteId: string | null;
  searchParams: SearchParams | null;
}

declare global {
  interface Window {
    mapboxgl: any;
  }
}

const RouteMap: React.FC<RouteMapProps> = ({ 
  routes, 
  selectedRouteId, 
  searchParams 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const selectedRoute = routes.find(r => r.id === selectedRouteId);
  const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  useEffect(() => {
    // Load Mapbox GL JS if not already loaded
    if (!window.mapboxgl && mapboxToken) {
      const script = document.createElement('script');
      script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
      script.onload = initializeMap;
      document.head.appendChild(script);

      const link = document.createElement('link');
      link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    } else if (window.mapboxgl && mapboxToken) {
      initializeMap();
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken]);

  useEffect(() => {
    if (map.current && searchParams?.originCoords && searchParams?.destinationCoords) {
      updateMapData();
    }
  }, [selectedRoute, searchParams]);

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    window.mapboxgl.accessToken = mapboxToken;
    
    map.current = new window.mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-74.006, 40.7128], // Default to NYC
      zoom: 10
    });

    map.current.addControl(new window.mapboxgl.NavigationControl());
  };

  const updateMapData = () => {
    if (!map.current || !searchParams?.originCoords || !searchParams?.destinationCoords) return;

    // Clear existing markers and routes
    const existingMarkers = document.querySelectorAll('.mapboxgl-marker');
    existingMarkers.forEach(marker => marker.remove());

    // Add origin marker
    new window.mapboxgl.Marker({ color: '#10B981' })
      .setLngLat(searchParams.originCoords)
      .setPopup(new window.mapboxgl.Popup().setHTML(`<strong>Origin:</strong> ${searchParams.origin}`))
      .addTo(map.current);

    // Add destination marker
    new window.mapboxgl.Marker({ color: '#EF4444' })
      .setLngLat(searchParams.destinationCoords)
      .setPopup(new window.mapboxgl.Popup().setHTML(`<strong>Destination:</strong> ${searchParams.destination}`))
      .addTo(map.current);

    // Fit map to show both points
    const bounds = new window.mapboxgl.LngLatBounds()
      .extend(searchParams.originCoords)
      .extend(searchParams.destinationCoords);
    
    map.current.fitBounds(bounds, { padding: 50 });

    // If a route is selected, try to show route geometry
    if (selectedRoute && selectedRoute.geometry) {
      // Add route line if geometry exists
      if (map.current.getSource('route')) {
        map.current.removeLayer('route');
        map.current.removeSource('route');
      }

      map.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: selectedRoute.geometry
        }
      });

      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#10B981',
          'line-width': 4
        }
      });
    }
  };

  if (!mapboxToken) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
      >
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-800 flex items-center">
            <Map className="w-5 h-5 mr-2 text-emerald-600" />
            Route Map
          </h3>
        </div>
        <div className="h-64 md:h-80 bg-red-50 flex items-center justify-center">
          <div className="text-center p-6">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h4 className="font-medium text-red-800 mb-2">Map Unavailable</h4>
            <p className="text-red-600 text-sm">
              Mapbox API key is missing. Add VITE_MAPBOX_ACCESS_TOKEN to your .env file.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
    >
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 flex items-center">
            <Map className="w-5 h-5 mr-2 text-emerald-600" />
            Route Map
          </h3>
          {selectedRoute && (
            <div className="flex items-center space-x-2">
              <Navigation className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-600">
                {selectedRoute.duration}m • ₹{selectedRoute.cost}
              </span>
            </div>
          )}
        </div>
      </div>

      <div 
        ref={mapContainer}
        className="h-64 md:h-80 bg-gradient-to-br from-emerald-50 to-blue-50"
        style={{ minHeight: '320px' }}
      />

      {selectedRoute && (
        <div className="p-4">
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-slate-600">
              <p className="font-medium mb-1">Route Details</p>
              <p>
                This {selectedRoute.duration}-minute journey includes {selectedRoute.transfers} transfer{selectedRoute.transfers !== 1 ? 's' : ''} 
                and produces {selectedRoute.co2Emissions.toFixed(1)}kg of CO₂ emissions.
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default RouteMap;