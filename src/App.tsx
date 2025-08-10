// // App.tsx - Fixed version
// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import Header from './components/Header';
// import SearchForm from './components/SearchForm';
// import RouteResults from './components/RouteResults';
// import Sidebar from './components/Sidebar';
// import LoadingSpinner from './components/LoadingSpinner';
// import { Route, SearchParams } from './types';
// import { getTransitDirections, calculateCarbonEmissions } from './utils/api';

// function App() {
//   const [routes, setRoutes] = useState<Route[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const handleSearch = async (params: SearchParams) => {
//     setLoading(true);
//     setError(null);
//     setSearchParams(params);
    
//     try {
//       // Check if we have coordinates
//       if (!params.originCoords || !params.destinationCoords) {
//         throw new Error('Invalid location coordinates');
//       }

//       // Get transit directions from Mapbox
//       const directions = await getTransitDirections(
//         params.originCoords,
//         params.destinationCoords
//       );

//       if (!directions || directions.length === 0) {
//         // Fallback to mock data if API fails
//         console.warn('API returned no routes, using mock data');
//         const mockRoutes = await generateMockRoutes(params);
//         setRoutes(mockRoutes);
//         return;
//       }

//       // Process real API data
//       const processedRoutes: Route[] = await Promise.all(
//         directions.slice(0, 3).map(async (route: any, index: number) => {
//           const duration = Math.round(route.duration / 60); // Convert to minutes
//           const distance = route.distance / 1000; // Convert to km
          
//           // Calculate emissions based on transport modes
//           let co2Emissions = 0;
//           const modes: string[] = [];
//           const steps: any[] = [];

//           route.legs?.forEach((leg: any, legIndex: number) => {
//             if (leg.mode) {
//               modes.push(leg.mode);
//               steps.push({
//                 mode: leg.mode,
//                 duration: Math.round(leg.duration / 60),
//                 description: leg.maneuver?.instruction || `${leg.mode} journey`
//               });
//             }
//           });

//           // Calculate carbon emissions based on actual distance and modes
//           try {
//             co2Emissions = await calculateCarbonEmissions(distance, modes[0] || 'bus');
//           } catch {
//             co2Emissions = distance * 0.1; // Fallback calculation
//           }

//           return {
//             id: `route-${index + 1}`,
//             duration,
//             cost: calculateDynamicCost(distance, modes),
//             co2Emissions,
//             transfers: Math.max(0, modes.length - 1),
//             modes,
//             steps,
//             geometry: route.geometry // Include geometry for map display
//           };
//         })
//       );

//       setRoutes(processedRoutes);

//     } catch (error) {
//       console.error('Error fetching routes:', error);
//       setError('Failed to fetch routes. Using sample data.');
      
//       // Generate mock routes as fallback
//       const mockRoutes = await generateMockRoutes(params);
//       setRoutes(mockRoutes);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const generateMockRoutes = async (params: SearchParams): Promise<Route[]> => {
//     if (!params.originCoords || !params.destinationCoords) {
//       throw new Error('Missing coordinates for route generation');
//     }

//     // Calculate actual distance between points
//     const distance = calculateDistance(params.originCoords, params.destinationCoords);
    
//     // Add time-of-day factors
//     const currentHour = new Date().getHours();
//     const isRushHour = (currentHour >= 7 && currentHour <= 9) || (currentHour >= 17 && currentHour <= 19);
//     const rushHourMultiplier = isRushHour ? 1.4 : 1.0;
//     const costMultiplier = isRushHour ? 1.1 : 1.0;
    
//     // Generate realistic base times based on distance
//     const walkingTime = Math.round(distance * 12); // ~12 min per km walking
//     const drivingTime = Math.round(distance * 3 * rushHourMultiplier); // ~3 min per km driving
    
//     // Add some randomness to make each search unique
//     const routeVariation = Math.random() * 0.3 + 0.85; // 0.85 to 1.15 multiplier
    
//     // Generate 3-4 different route options with realistic variations
//     const routes: Route[] = [];

//     // Helper functions for more realistic route descriptions
//     const getLocationName = (fullAddress: string) => {
//       return fullAddress.split(',')[0] || fullAddress;
//     };

//     const getBusRoute = () => {
//       const routes = ['Bus 42', 'Bus 15', 'Bus 67', 'Bus 28', 'Bus 91', 'Local Bus', 'Express Bus'];
//       return routes[Math.floor(Math.random() * routes.length)];
//     };

//     const getMetroLine = () => {
//       const lines = ['Blue Line', 'Red Line', 'Green Line', 'Orange Line', 'Purple Line', 'Metro'];
//       return lines[Math.floor(Math.random() * lines.length)];
//     };
    
//     // Route 1: Direct bus/metro route (fastest)
//     if (distance > 2) {
//       const directTime = Math.max(15, Math.round((drivingTime * 1.5 + Math.random() * 10) * routeVariation));
//       routes.push({
//         id: '1',
//         duration: directTime,
//         cost: calculateDynamicCost(distance, ['bus', 'metro']) * costMultiplier,
//         co2Emissions: (distance * 0.08 + Math.random() * 0.2) * routeVariation,
//         transfers: distance > 5 ? 1 : 0,
//         modes: distance > 5 ? ['walk', 'bus', 'metro', 'walk'] : ['walk', 'bus', 'walk'],
//         steps: [
//           { mode: 'walk', duration: Math.round((Math.random() * 5 + 3) * routeVariation), description: `Walk from ${getLocationName(params.origin)}` },
//           { mode: 'bus', duration: Math.round(directTime * 0.4), description: `${getBusRoute()} toward ${getLocationName(params.destination)}` },
//           ...(distance > 5 ? [{ mode: 'metro', duration: Math.round(directTime * 0.4), description: `${getMetroLine()} to ${getLocationName(params.destination)} area` }] : []),
//           { mode: 'walk', duration: Math.round((Math.random() * 4 + 2) * routeVariation), description: `Walk to ${getLocationName(params.destination)}` }
//         ]
//       });
//     }

//     // Route 2: Multi-transfer route (cheaper but slower)
//     const multiTransferTime = Math.round((drivingTime * 1.8 + Math.random() * 15) * routeVariation);
//     routes.push({
//       id: '2',
//       duration: multiTransferTime,
//       cost: (calculateDynamicCost(distance, ['bus', 'bus']) * 0.85 * costMultiplier), // Cheaper
//       co2Emissions: (distance * 0.06 + Math.random() * 0.15) * routeVariation,
//       transfers: Math.min(3, Math.max(1, Math.round(distance / 3))),
//       modes: ['walk', 'bus', 'bus', 'walk'],
//       steps: [
//         { mode: 'walk', duration: Math.round((Math.random() * 6 + 4) * routeVariation), description: `Walk from ${getLocationName(params.origin)}` },
//         { mode: 'bus', duration: Math.round(multiTransferTime * 0.35), description: `${getBusRoute()} to transfer hub` },
//         { mode: 'bus', duration: Math.round(multiTransferTime * 0.45), description: `${getBusRoute()} to ${getLocationName(params.destination)} area` },
//         { mode: 'walk', duration: Math.round((Math.random() * 5 + 3) * routeVariation), description: `Walk to ${getLocationName(params.destination)}` }
//       ]
//     });

//     // Route 3: Express/premium option (faster but expensive)
//     if (distance > 3) {
//       const expressTime = Math.max(12, Math.round((drivingTime * 0.7 + Math.random() * 8) * routeVariation));
//       routes.push({
//         id: '3',
//         duration: expressTime,
//         cost: (calculateDynamicCost(distance, ['express']) * 1.8 * costMultiplier),
//         co2Emissions: (distance * 0.12 + Math.random() * 0.3) * routeVariation,
//         transfers: 0,
//         modes: ['walk', 'express', 'walk'],
//         steps: [
//           { mode: 'walk', duration: Math.round((Math.random() * 4 + 2) * routeVariation), description: `Walk to express station near ${getLocationName(params.origin)}` },
//           { mode: 'express', duration: Math.round(expressTime * 0.8), description: `Express service to ${getLocationName(params.destination)}` },
//           { mode: 'walk', duration: Math.round((Math.random() * 3 + 2) * routeVariation), description: `Walk to ${getLocationName(params.destination)}` }
//         ]
//       });
//     }

//     // Route 4: Eco-friendly option (bike + transit)
//     if (distance < 8) {
//       const ecoTime = Math.round((drivingTime * 1.1 + Math.random() * 12) * routeVariation);
//       routes.push({
//         id: '4',
//         duration: ecoTime,
//         cost: (calculateDynamicCost(distance, ['bike', 'metro']) * 0.7 * costMultiplier),
//         co2Emissions: (distance * 0.02 + Math.random() * 0.05) * routeVariation, // Very low emissions
//         transfers: 1,
//         modes: ['bike', 'metro', 'walk'],
//         steps: [
//           { mode: 'bike', duration: Math.round(ecoTime * 0.4), description: `Bike from ${getLocationName(params.origin)} to ${getMetroLine().toLowerCase()} station` },
//           { mode: 'metro', duration: Math.round(ecoTime * 0.5), description: `${getMetroLine()} to ${getLocationName(params.destination)} area` },
//           { mode: 'walk', duration: Math.round((Math.random() * 4 + 2) * routeVariation), description: `Walk to ${getLocationName(params.destination)}` }
//         ]
//       });
//     }

//     // Route 5: Walking + short transit for very short distances
//     if (distance < 3) {
//       const shortTime = Math.max(8, Math.round((walkingTime * 0.6 + Math.random() * 8) * routeVariation));
//       routes.push({
//         id: '5',
//         duration: shortTime,
//         cost: (calculateDynamicCost(distance, ['bus']) * 0.6 * costMultiplier),
//         co2Emissions: (distance * 0.04 + Math.random() * 0.1) * routeVariation,
//         transfers: 0,
//         modes: ['walk', 'bus', 'walk'],
//         steps: [
//           { mode: 'walk', duration: Math.round((Math.random() * 3 + 2) * routeVariation), description: `Walk from ${getLocationName(params.origin)}` },
//           { mode: 'bus', duration: Math.round(shortTime * 0.7), description: `${getBusRoute()} direct to ${getLocationName(params.destination)}` },
//           { mode: 'walk', duration: Math.round((Math.random() * 2 + 1) * routeVariation), description: `Short walk to ${getLocationName(params.destination)}` }
//         ]
//       });
//     }

//     // Apply departure time adjustments
//     if (params.departureTime && params.departureTime !== 'now') {
//       routes.forEach(route => {
//         switch (params.departureTime) {
//           case '15min':
//           case '30min':
//             // Slight improvement due to better timing
//             route.duration = Math.round(route.duration * 0.95);
//             break;
//           case '1hour':
//             // Better timing, avoid rush hour
//             route.duration = Math.round(route.duration * 0.85);
//             route.cost = Math.round(route.cost * 0.9 * 100) / 100;
//             break;
//         }
//       });
//     }

//     // Adjust routes based on priority with more dramatic differences
//     const adjustedRoutes = routes.map(route => ({
//       ...route,
//       // Add priority-based adjustments with more variation
//       duration: params.priority === 'fastest' ? 
//         Math.round(route.duration * (0.8 + Math.random() * 0.15)) : 
//         route.duration,
//       cost: params.priority === 'cheapest' ? 
//         Math.round(route.cost * (0.7 + Math.random() * 0.15) * 100) / 100 : 
//         route.cost,
//       co2Emissions: params.priority === 'eco' ? 
//         route.co2Emissions * (0.5 + Math.random() * 0.2) : 
//         route.co2Emissions
//     }));

//     console.log(`Generated ${adjustedRoutes.length} dynamic routes for ${distance.toFixed(2)}km trip from "${params.origin}" to "${params.destination}"`);
//     console.log('Route details:', adjustedRoutes.map(r => ({ 
//       id: r.id, 
//       duration: r.duration, 
//       cost: r.cost, 
//       co2: r.co2Emissions.toFixed(2),
//       modes: r.modes 
//     })));

//     return adjustedRoutes;
//   };

//   const calculateDynamicCost = (distance: number, modes: string[]): number => {
//     let baseCost = 2.50; // Base transit fare
    
//     // Distance-based pricing with more variation
//     if (distance > 15) baseCost += 3.50;
//     else if (distance > 10) baseCost += 2.50;
//     else if (distance > 5) baseCost += 1.50;
//     else if (distance > 2) baseCost += 0.75;
//     else baseCost += 0.25;
    
//     // Mode-based pricing with regional variations
//     modes.forEach(mode => {
//       switch (mode) {
//         case 'metro': baseCost += 1.25 + (Math.random() * 0.5); break;
//         case 'express': baseCost += 3.50 + (Math.random() * 1.0); break;
//         case 'bike': baseCost += 0.50 + (Math.random() * 0.25); break; // Bike share fee
//         case 'bus': baseCost += 0.75 + (Math.random() * 0.3); break;
//         case 'walk': baseCost += 0; break;
//       }
//     });
    
//     // Add small random variation to make each search unique
//     baseCost += (Math.random() - 0.5) * 0.5;
    
//     return Math.max(0.50, Math.round(baseCost * 100) / 100);
//   };

//   const calculateDistance = (coord1: [number, number], coord2: [number, number]): number => {
//     const R = 6371; // Earth's radius in km
//     const dLat = (coord2[1] - coord1[1]) * Math.PI / 180;
//     const dLon = (coord2[0] - coord1[0]) * Math.PI / 180;
    
//     const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
//       Math.cos(coord1[1] * Math.PI / 180) * Math.cos(coord2[1] * Math.PI / 180) *
//       Math.sin(dLon/2) * Math.sin(dLon/2);
    
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//     return R * c;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
//       <Header onMenuClick={() => setSidebarOpen(true)} />
      
//       <main className="container mx-auto px-4 py-6 max-w-6xl">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="text-center mb-8"
//         >
//           <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
//             Smart<span className="text-emerald-600">Route</span>
//           </h1>
//           <p className="text-lg text-slate-600 max-w-2xl mx-auto">
//             Find the perfect transit route that balances speed, cost, and environmental impact. 
//             Make every journey count toward a greener future.
//           </p>
//         </motion.div>

//         {error && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6"
//           >
//             <p className="text-amber-800 text-sm">{error}</p>
//           </motion.div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-1">
//             <SearchForm onSearch={handleSearch} loading={loading} />
            
//             {/* API Status Indicator */}
//             <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//               <h4 className="text-sm font-medium text-blue-800 mb-2">API Status</h4>
//               <div className="space-y-1">
//                 <div className="flex items-center text-xs">
//                   <div className={`w-2 h-2 rounded-full mr-2 ${
//                     import.meta.env.VITE_GEOAPIFY_API_KEY ? 'bg-green-500' : 'bg-red-500'
//                   }`}></div>
//                   Geoapify (Places): {import.meta.env.VITE_GEOAPIFY_API_KEY ? 'Connected' : 'Missing API Key'}
//                 </div>
//                 <div className="flex items-center text-xs">
//                   <div className={`w-2 h-2 rounded-full mr-2 ${
//                     import.meta.env.VITE_MAPBOX_ACCESS_TOKEN ? 'bg-green-500' : 'bg-red-500'
//                   }`}></div>
//                   Mapbox (Routes): {import.meta.env.VITE_MAPBOX_ACCESS_TOKEN ? 'Connected' : 'Missing API Key'}
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           <div className="lg:col-span-2">
//             {loading ? (
//               <LoadingSpinner />
//             ) : routes.length > 0 ? (
//               <RouteResults routes={routes} searchParams={searchParams} />
//             ) : (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200"
//               >
//                 <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <span className="text-2xl">🚌</span>
//                 </div>
//                 <h3 className="text-xl font-semibold text-slate-700 mb-2">
//                   Ready to find your route?
//                 </h3>
//                 <p className="text-slate-500 mb-4">
//                   Enter your origin and destination to discover eco-friendly transit options.
//                 </p>
//                 {!import.meta.env.VITE_GEOAPIFY_API_KEY && (
//                   <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
//                     <p className="text-red-800 text-sm">
//                       ⚠️ API keys not configured. Add your API keys to the .env file to enable real location search.
//                     </p>
//                   </div>
//                 )}
//               </motion.div>
//             )}
//           </div>
//         </div>
//       </main>

//       <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
//     </div>
//   );
// }

// export default App;










// App.tsx - Fixed version with Rupee currency
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import RouteResults from './components/RouteResults';
import Sidebar from './components/Sidebar';
import LoadingSpinner from './components/LoadingSpinner';
import { Route, SearchParams } from './types';
import { getTransitDirections, calculateCarbonEmissions } from './utils/api';

function App() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (params: SearchParams) => {
    setLoading(true);
    setError(null);
    setSearchParams(params);
    
    try {
      // Check if we have coordinates
      if (!params.originCoords || !params.destinationCoords) {
        throw new Error('Invalid location coordinates');
      }

      // Get transit directions from Mapbox
      const directions = await getTransitDirections(
        params.originCoords,
        params.destinationCoords
      );

      if (!directions || directions.length === 0) {
        // Fallback to mock data if API fails
        console.warn('API returned no routes, using mock data');
        const mockRoutes = await generateMockRoutes(params);
        setRoutes(mockRoutes);
        return;
      }

      // Process real API data
      const processedRoutes: Route[] = await Promise.all(
        directions.slice(0, 3).map(async (route: any, index: number) => {
          const duration = Math.round(route.duration / 60); // Convert to minutes
          const distance = route.distance / 1000; // Convert to km
          
          // Calculate emissions based on transport modes
          let co2Emissions = 0;
          const modes: string[] = [];
          const steps: any[] = [];

          route.legs?.forEach((leg: any, legIndex: number) => {
            if (leg.mode) {
              modes.push(leg.mode);
              steps.push({
                mode: leg.mode,
                duration: Math.round(leg.duration / 60),
                description: leg.maneuver?.instruction || `${leg.mode} journey`
              });
            }
          });

          // Calculate carbon emissions based on actual distance and modes
          try {
            co2Emissions = await calculateCarbonEmissions(distance, modes[0] || 'bus');
          } catch {
            co2Emissions = distance * 0.1; // Fallback calculation
          }

          return {
            id: `route-${index + 1}`,
            duration,
            cost: calculateDynamicCost(distance, modes),
            co2Emissions,
            transfers: Math.max(0, modes.length - 1),
            modes,
            steps,
            geometry: route.geometry // Include geometry for map display
          };
        })
      );

      setRoutes(processedRoutes);

    } catch (error) {
      console.error('Error fetching routes:', error);
      setError('Failed to fetch routes. Using sample data.');
      
      // Generate mock routes as fallback
      const mockRoutes = await generateMockRoutes(params);
      setRoutes(mockRoutes);
    } finally {
      setLoading(false);
    }
  };

  const generateMockRoutes = async (params: SearchParams): Promise<Route[]> => {
    if (!params.originCoords || !params.destinationCoords) {
      throw new Error('Missing coordinates for route generation');
    }

    // Calculate actual distance between points
    const distance = calculateDistance(params.originCoords, params.destinationCoords);
    
    // Add time-of-day factors
    const currentHour = new Date().getHours();
    const isRushHour = (currentHour >= 7 && currentHour <= 9) || (currentHour >= 17 && currentHour <= 19);
    const rushHourMultiplier = isRushHour ? 1.4 : 1.0;
    const costMultiplier = isRushHour ? 1.1 : 1.0;
    
    // Generate realistic base times based on distance
    const walkingTime = Math.round(distance * 12); // ~12 min per km walking
    const drivingTime = Math.round(distance * 3 * rushHourMultiplier); // ~3 min per km driving
    
    // Add some randomness to make each search unique
    const routeVariation = Math.random() * 0.3 + 0.85; // 0.85 to 1.15 multiplier
    
    // Generate 3-4 different route options with realistic variations
    const routes: Route[] = [];

    // Helper functions for more realistic route descriptions
    const getLocationName = (fullAddress: string) => {
      return fullAddress.split(',')[0] || fullAddress;
    };

    const getBusRoute = () => {
      const routes = ['Bus 42', 'Bus 15', 'Bus 67', 'Bus 28', 'Bus 91', 'Local Bus', 'Express Bus'];
      return routes[Math.floor(Math.random() * routes.length)];
    };

    const getMetroLine = () => {
      const lines = ['Blue Line', 'Red Line', 'Green Line', 'Orange Line', 'Purple Line', 'Metro'];
      return lines[Math.floor(Math.random() * lines.length)];
    };
    
    // Route 1: Direct bus/metro route (fastest)
    if (distance > 2) {
      const directTime = Math.max(15, Math.round((drivingTime * 1.5 + Math.random() * 10) * routeVariation));
      routes.push({
        id: '1',
        duration: directTime,
        cost: calculateDynamicCost(distance, ['bus', 'metro']) * costMultiplier,
        co2Emissions: (distance * 0.08 + Math.random() * 0.2) * routeVariation,
        transfers: distance > 5 ? 1 : 0,
        modes: distance > 5 ? ['walk', 'bus', 'metro', 'walk'] : ['walk', 'bus', 'walk'],
        steps: [
          { mode: 'walk', duration: Math.round((Math.random() * 5 + 3) * routeVariation), description: `Walk from ${getLocationName(params.origin)}` },
          { mode: 'bus', duration: Math.round(directTime * 0.4), description: `${getBusRoute()} toward ${getLocationName(params.destination)}` },
          ...(distance > 5 ? [{ mode: 'metro', duration: Math.round(directTime * 0.4), description: `${getMetroLine()} to ${getLocationName(params.destination)} area` }] : []),
          { mode: 'walk', duration: Math.round((Math.random() * 4 + 2) * routeVariation), description: `Walk to ${getLocationName(params.destination)}` }
        ]
      });
    }

    // Route 2: Multi-transfer route (cheaper but slower)
    const multiTransferTime = Math.round((drivingTime * 1.8 + Math.random() * 15) * routeVariation);
    routes.push({
      id: '2',
      duration: multiTransferTime,
      cost: Math.round(calculateDynamicCost(distance, ['bus', 'bus']) * 0.85 * costMultiplier), // Cheaper and rounded
      co2Emissions: (distance * 0.06 + Math.random() * 0.15) * routeVariation,
      transfers: Math.min(3, Math.max(1, Math.round(distance / 3))),
      modes: ['walk', 'bus', 'bus', 'walk'],
      steps: [
        { mode: 'walk', duration: Math.round((Math.random() * 6 + 4) * routeVariation), description: `Walk from ${getLocationName(params.origin)}` },
        { mode: 'bus', duration: Math.round(multiTransferTime * 0.35), description: `${getBusRoute()} to transfer hub` },
        { mode: 'bus', duration: Math.round(multiTransferTime * 0.45), description: `${getBusRoute()} to ${getLocationName(params.destination)} area` },
        { mode: 'walk', duration: Math.round((Math.random() * 5 + 3) * routeVariation), description: `Walk to ${getLocationName(params.destination)}` }
      ]
    });

    // Route 3: Express/premium option (faster but expensive)
    if (distance > 3) {
      const expressTime = Math.max(12, Math.round((drivingTime * 0.7 + Math.random() * 8) * routeVariation));
      routes.push({
        id: '3',
        duration: expressTime,
        cost: Math.round(calculateDynamicCost(distance, ['express']) * 1.8 * costMultiplier),
        co2Emissions: (distance * 0.12 + Math.random() * 0.3) * routeVariation,
        transfers: 0,
        modes: ['walk', 'express', 'walk'],
        steps: [
          { mode: 'walk', duration: Math.round((Math.random() * 4 + 2) * routeVariation), description: `Walk to express station near ${getLocationName(params.origin)}` },
          { mode: 'express', duration: Math.round(expressTime * 0.8), description: `Express service to ${getLocationName(params.destination)}` },
          { mode: 'walk', duration: Math.round((Math.random() * 3 + 2) * routeVariation), description: `Walk to ${getLocationName(params.destination)}` }
        ]
      });
    }

    // Route 4: Eco-friendly option (bike + transit)
    if (distance < 8) {
      const ecoTime = Math.round((drivingTime * 1.1 + Math.random() * 12) * routeVariation);
      routes.push({
        id: '4',
        duration: ecoTime,
        cost: Math.round(calculateDynamicCost(distance, ['bike', 'metro']) * 0.7 * costMultiplier),
        co2Emissions: (distance * 0.02 + Math.random() * 0.05) * routeVariation, // Very low emissions
        transfers: 1,
        modes: ['bike', 'metro', 'walk'],
        steps: [
          { mode: 'bike', duration: Math.round(ecoTime * 0.4), description: `Bike from ${getLocationName(params.origin)} to ${getMetroLine().toLowerCase()} station` },
          { mode: 'metro', duration: Math.round(ecoTime * 0.5), description: `${getMetroLine()} to ${getLocationName(params.destination)} area` },
          { mode: 'walk', duration: Math.round((Math.random() * 4 + 2) * routeVariation), description: `Walk to ${getLocationName(params.destination)}` }
        ]
      });
    }

    // Route 5: Walking + short transit for very short distances
    if (distance < 3) {
      const shortTime = Math.max(8, Math.round((walkingTime * 0.6 + Math.random() * 8) * routeVariation));
      routes.push({
        id: '5',
        duration: shortTime,
        cost: Math.round(calculateDynamicCost(distance, ['bus']) * 0.6 * costMultiplier),
        co2Emissions: (distance * 0.04 + Math.random() * 0.1) * routeVariation,
        transfers: 0,
        modes: ['walk', 'bus', 'walk'],
        steps: [
          { mode: 'walk', duration: Math.round((Math.random() * 3 + 2) * routeVariation), description: `Walk from ${getLocationName(params.origin)}` },
          { mode: 'bus', duration: Math.round(shortTime * 0.7), description: `${getBusRoute()} direct to ${getLocationName(params.destination)}` },
          { mode: 'walk', duration: Math.round((Math.random() * 2 + 1) * routeVariation), description: `Short walk to ${getLocationName(params.destination)}` }
        ]
      });
    }

    // Apply departure time adjustments
    if (params.departureTime && params.departureTime !== 'now') {
      routes.forEach(route => {
        switch (params.departureTime) {
          case '15min':
          case '30min':
            // Slight improvement due to better timing
            route.duration = Math.round(route.duration * 0.95);
            break;
          case '1hour':
            // Better timing, avoid rush hour
            route.duration = Math.round(route.duration * 0.85);
            route.cost = Math.round(route.cost * 0.9);
            break;
        }
      });
    }

    // Adjust routes based on priority with more dramatic differences
    const adjustedRoutes = routes.map(route => ({
      ...route,
      // Add priority-based adjustments with more variation
      duration: params.priority === 'fastest' ? 
        Math.round(route.duration * (0.8 + Math.random() * 0.15)) : 
        route.duration,
      cost: params.priority === 'cheapest' ? 
        Math.round(route.cost * (0.7 + Math.random() * 0.15)) : 
        route.cost,
      co2Emissions: params.priority === 'eco' ? 
        route.co2Emissions * (0.5 + Math.random() * 0.2) : 
        route.co2Emissions
    }));

    console.log(`Generated ${adjustedRoutes.length} dynamic routes for ${distance.toFixed(2)}km trip from "${params.origin}" to "${params.destination}"`);
    console.log('Route details:', adjustedRoutes.map(r => ({ 
      id: r.id, 
      duration: r.duration, 
      cost: r.cost, 
      co2: r.co2Emissions.toFixed(2),
      modes: r.modes 
    })));

    return adjustedRoutes;
  };

  const calculateDynamicCost = (distance: number, modes: string[]): number => {
    let baseCost = 15; // Base transit fare in rupees (converted from $2.50)
    
    // Distance-based pricing with more variation (converted to rupees)
    if (distance > 15) baseCost += 210; // ~$3.50 -> ₹210
    else if (distance > 10) baseCost += 150; // ~$2.50 -> ₹150
    else if (distance > 5) baseCost += 90; // ~$1.50 -> ₹90
    else if (distance > 2) baseCost += 45; // ~$0.75 -> ₹45
    else baseCost += 15; // ~$0.25 -> ₹15
    
    // Mode-based pricing with regional variations (converted to rupees)
    modes.forEach(mode => {
      switch (mode) {
        case 'metro': baseCost += 75 + Math.round(Math.random() * 30); break; // ~$1.25 -> ₹75
        case 'express': baseCost += 210 + Math.round(Math.random() * 60); break; // ~$3.50 -> ₹210
        case 'bike': baseCost += 30 + Math.round(Math.random() * 15); break; // ~$0.50 -> ₹30 (Bike share fee)
        case 'bus': baseCost += 45 + Math.round(Math.random() * 18); break; // ~$0.75 -> ₹45
        case 'walk': baseCost += 0; break;
      }
    });
    
    // Add small random variation to make each search unique (in rupees)
    baseCost += Math.round((Math.random() - 0.5) * 30);
    
    return Math.max(5, Math.round(baseCost)); // Minimum ₹5, rounded to whole number
  };

  const calculateDistance = (coord1: [number, number], coord2: [number, number]): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (coord2[1] - coord1[1]) * Math.PI / 180;
    const dLon = (coord2[0] - coord1[0]) * Math.PI / 180;
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(coord1[1] * Math.PI / 180) * Math.cos(coord2[1] * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Smart<span className="text-emerald-600">Route</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Find the perfect transit route that balances speed, cost, and environmental impact. 
            Make every journey count toward a greener future.
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6"
          >
            <p className="text-amber-800 text-sm">{error}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <SearchForm onSearch={handleSearch} loading={loading} />
            
            {/* API Status Indicator */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-2">API Status</h4>
              <div className="space-y-1">
                <div className="flex items-center text-xs">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    import.meta.env.VITE_GEOAPIFY_API_KEY ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  Geoapify (Places): {import.meta.env.VITE_GEOAPIFY_API_KEY ? 'Connected' : 'Missing API Key'}
                </div>
                <div className="flex items-center text-xs">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    import.meta.env.VITE_MAPBOX_ACCESS_TOKEN ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  Mapbox (Routes): {import.meta.env.VITE_MAPBOX_ACCESS_TOKEN ? 'Connected' : 'Missing API Key'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            {loading ? (
              <LoadingSpinner />
            ) : routes.length > 0 ? (
              <RouteResults routes={routes} searchParams={searchParams} />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚌</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">
                  Ready to find your route?
                </h3>
                <p className="text-slate-500 mb-4">
                  Enter your origin and destination to discover eco-friendly transit options.
                </p>
                {!import.meta.env.VITE_GEOAPIFY_API_KEY && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                    <p className="text-red-800 text-sm">
                      ⚠️ API keys not configured. Add your API keys to the .env file to enable real location search.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
}

export default App;