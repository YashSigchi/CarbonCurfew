// // // API utility functions for SmartRoute

// // const API_BASE_URL = 'https://api.smartroute.com/v1';

// // // Mapbox API configuration
// // export const MAPBOX_CONFIG = {
// //   accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
// //   baseUrl: 'https://api.mapbox.com',
// // };

// // // Geoapify API configuration
// // export const GEOAPIFY_CONFIG = {
// //   apiKey: import.meta.env.VITE_GEOAPIFY_API_KEY,
// //   baseUrl: 'https://api.geoapify.com/v1',
// // };

// // // Transitland API configuration
// // export const TRANSITLAND_CONFIG = {
// //   apiKey: import.meta.env.VITE_TRANSITLAND_API_KEY,
// //   baseUrl: 'https://transit.land/api/v2',
// // };

// // // Carbon Interface API configuration
// // export const CARBON_INTERFACE_CONFIG = {
// //   apiKey: import.meta.env.VITE_CARBON_INTERFACE_API_KEY,
// //   baseUrl: 'https://www.carboninterface.com/api/v1',
// // };

// // // Geocoding function using Geoapify
// // export async function geocodePlace(query: string) {
// //   try {
// //     const response = await fetch(
// //       `${GEOAPIFY_CONFIG.baseUrl}/geocode/search?text=${encodeURIComponent(query)}&apiKey=${GEOAPIFY_CONFIG.apiKey}`
// //     );
    
// //     if (!response.ok) {
// //       throw new Error('Geocoding request failed');
// //     }
    
// //     const data = await response.json();
// //     return data.features;
// //   } catch (error) {
// //     console.error('Geocoding error:', error);
// //     return [];
// //   }
// // }

// // // Get transit directions using Mapbox
// // export async function getTransitDirections(origin: [number, number], destination: [number, number]) {
// //   try {
// //     const response = await fetch(
// //       `${MAPBOX_CONFIG.baseUrl}/directions/v5/mapbox/transit/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?access_token=${MAPBOX_CONFIG.accessToken}`
// //     );
    
// //     if (!response.ok) {
// //       throw new Error('Transit directions request failed');
// //     }
    
// //     const data = await response.json();
// //     return data.routes;
// //   } catch (error) {
// //     console.error('Transit directions error:', error);
// //     return [];
// //   }
// // }

// // // Get transit data from Transitland
// // export async function getTransitData(lat: number, lon: number, radius = 1000) {
// //   try {
// //     const response = await fetch(
// //       `${TRANSITLAND_CONFIG.baseUrl}/stops?lat=${lat}&lon=${lon}&radius=${radius}&apikey=${TRANSITLAND_CONFIG.apiKey}`
// //     );
    
// //     if (!response.ok) {
// //       throw new Error('Transitland request failed');
// //     }
    
// //     const data = await response.json();
// //     return data.stops;
// //   } catch (error) {
// //     console.error('Transitland error:', error);
// //     return [];
// //   }
// // }

// // // Calculate carbon emissions using Carbon Interface API
// // export async function calculateCarbonEmissions(distance: number, transportType: string) {
// //   try {
// //     const response = await fetch(
// //       `${CARBON_INTERFACE_CONFIG.baseUrl}/estimates`,
// //       {
// //         method: 'POST',
// //         headers: {
// //           'Authorization': `Bearer ${CARBON_INTERFACE_CONFIG.apiKey}`,
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({
// //           type: 'vehicle',
// //           distance_unit: 'km',
// //           distance_value: distance,
// //           vehicle_model_id: transportType === 'bus' ? 'bus-transit' : 'train-electric',
// //         }),
// //       }
// //     );
    
// //     if (!response.ok) {
// //       throw new Error('Carbon calculation request failed');
// //     }
    
// //     const data = await response.json();
// //     return data.data.attributes.carbon_kg;
// //   } catch (error) {
// //     console.error('Carbon calculation error:', error);
// //     return 0;
// //   }
// // }

// // // Placeholder function for route optimization
// // export function optimizeRoutes(routes: any[], priority: string) {
// //   return routes.sort((a, b) => {
// //     switch (priority) {
// //       case 'fastest':
// //         return a.duration - b.duration;
// //       case 'cheapest':
// //         return a.cost - b.cost;
// //       case 'eco':
// //         return a.co2Emissions - b.co2Emissions;
// //       default:
// //         // Balanced scoring algorithm
// //         const scoreA = (a.duration * 0.4) + (a.cost * 0.3) + (a.co2Emissions * 0.3);
// //         const scoreB = (b.duration * 0.4) + (b.cost * 0.3) + (b.co2Emissions * 0.3);
// //         return scoreA - scoreB;
// //     }
// //   });
// // }











// // API utility functions for SmartRoute

// const API_BASE_URL = 'https://api.smartroute.com/v1';

// // Mapbox API configuration
// export const MAPBOX_CONFIG = {
//   accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
//   baseUrl: 'https://api.mapbox.com',
// };

// // Geoapify API configuration
// export const GEOAPIFY_CONFIG = {
//   apiKey: import.meta.env.VITE_GEOAPIFY_API_KEY,
//   baseUrl: 'https://api.geoapify.com/v1',
// };

// // Transitland API configuration
// export const TRANSITLAND_CONFIG = {
//   apiKey: import.meta.env.VITE_TRANSITLAND_API_KEY,
//   baseUrl: 'https://transit.land/api/v2',
// };

// // Carbon Interface API configuration
// export const CARBON_INTERFACE_CONFIG = {
//   apiKey: import.meta.env.VITE_CARBON_INTERFACE_API_KEY,
//   baseUrl: 'https://www.carboninterface.com/api/v1',
// };

// // Check if API keys are configured
// export const checkAPIKeys = () => {
//   const keys = {
//     mapbox: !!MAPBOX_CONFIG.accessToken,
//     geoapify: !!GEOAPIFY_CONFIG.apiKey,
//     transitland: !!TRANSITLAND_CONFIG.apiKey,
//     carbonInterface: !!CARBON_INTERFACE_CONFIG.apiKey
//   };
  
//   console.log('API Keys Status:', keys);
//   return keys;
// };

// // Geocoding function using Geoapify
// export async function geocodePlace(query: string) {
//   if (!GEOAPIFY_CONFIG.apiKey) {
//     console.warn('Geoapify API key not configured');
//     return [];
//   }

//   try {
//     const response = await fetch(
//       `${GEOAPIFY_CONFIG.baseUrl}/geocode/autocomplete?text=${encodeURIComponent(query)}&limit=5&apiKey=${GEOAPIFY_CONFIG.apiKey}`
//     );
    
//     if (!response.ok) {
//       throw new Error(`Geocoding request failed: ${response.status} ${response.statusText}`);
//     }
    
//     const data = await response.json();
//     return data.features || [];
//   } catch (error) {
//     console.error('Geocoding error:', error);
//     return [];
//   }
// }

// // Get transit directions using Mapbox
// export async function getTransitDirections(origin: [number, number], destination: [number, number]) {
//   if (!MAPBOX_CONFIG.accessToken) {
//     console.warn('Mapbox access token not configured');
//     return [];
//   }

//   try {
//     const response = await fetch(
//       `${MAPBOX_CONFIG.baseUrl}/directions/v5/mapbox/transit/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?access_token=${MAPBOX_CONFIG.accessToken}&overview=full&geometries=geojson`
//     );
    
//     if (!response.ok) {
//       if (response.status === 422) {
//         console.warn('No transit routes found for this area');
//         return [];
//       }
//       throw new Error(`Transit directions request failed: ${response.status} ${response.statusText}`);
//     }
    
//     const data = await response.json();
//     return data.routes || [];
//   } catch (error) {
//     console.error('Transit directions error:', error);
//     return [];
//   }
// }

// // Alternative: Get driving directions as fallback
// export async function getDrivingDirections(origin: [number, number], destination: [number, number]) {
//   if (!MAPBOX_CONFIG.accessToken) {
//     return [];
//   }

//   try {
//     const response = await fetch(
//       `${MAPBOX_CONFIG.baseUrl}/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?access_token=${MAPBOX_CONFIG.accessToken}&overview=full&geometries=geojson`
//     );
    
//     if (!response.ok) {
//       throw new Error(`Driving directions request failed: ${response.status}`);
//     }
    
//     const data = await response.json();
//     return data.routes || [];
//   } catch (error) {
//     console.error('Driving directions error:', error);
//     return [];
//   }
// }

// // Get transit data from Transitland
// export async function getTransitData(lat: number, lon: number, radius = 1000) {
//   if (!TRANSITLAND_CONFIG.apiKey) {
//     console.warn('Transitland API key not configured');
//     return [];
//   }

//   try {
//     const response = await fetch(
//       `${TRANSITLAND_CONFIG.baseUrl}/stops?lat=${lat}&lon=${lon}&radius=${radius}&apikey=${TRANSITLAND_CONFIG.apiKey}`
//     );
    
//     if (!response.ok) {
//       throw new Error(`Transitland request failed: ${response.status}`);
//     }
    
//     const data = await response.json();
//     return data.stops || [];
//   } catch (error) {
//     console.error('Transitland error:', error);
//     return [];
//   }
// }

// // Calculate carbon emissions using Carbon Interface API
// export async function calculateCarbonEmissions(distance: number, transportType: string) {
//   if (!CARBON_INTERFACE_CONFIG.apiKey) {
//     // Fallback calculation if no API key
//     const emissionFactors: { [key: string]: number } = {
//       bus: 0.089, // kg CO2 per km
//       metro: 0.041,
//       train: 0.041,
//       walk: 0,
//       bicycle: 0,
//       express: 0.06
//     };
    
//     return (emissionFactors[transportType] || 0.089) * distance;
//   }

//   try {
//     const vehicleModelMap: { [key: string]: string } = {
//       bus: 'bus-city',
//       metro: 'train-electric',
//       train: 'train-electric',
//       express: 'bus-express'
//     };

//     const response = await fetch(
//       `${CARBON_INTERFACE_CONFIG.baseUrl}/estimates`,
//       {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${CARBON_INTERFACE_CONFIG.apiKey}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           type: 'vehicle',
//           distance_unit: 'km',
//           distance_value: distance,
//           vehicle_model_id: vehicleModelMap[transportType] || 'bus-city',
//         }),
//       }
//     );
    
//     if (!response.ok) {
//       throw new Error(`Carbon calculation request failed: ${response.status}`);
//     }
    
//     const data = await response.json();
//     return data.data.attributes.carbon_kg;
//   } catch (error) {
//     console.error('Carbon calculation error:', error);
//     // Fallback calculation
//     return distance * 0.089;
//   }
// }

// // Enhanced route optimization with multiple factors
// export function optimizeRoutes(routes: any[], priority: string) {
//   return routes.sort((a, b) => {
//     switch (priority) {
//       case 'fastest':
//         return a.duration - b.duration;
//       case 'cheapest':
//         return a.cost - b.cost;
//       case 'eco':
//         return a.co2Emissions - b.co2Emissions;
//       default:
//         // Balanced scoring algorithm with normalized values
//         const normalizedA = {
//           duration: a.duration / 60, // Normalize to hours
//           cost: a.cost / 10, // Normalize cost
//           emissions: a.co2Emissions
//         };
//         const normalizedB = {
//           duration: b.duration / 60,
//           cost: b.cost / 10,
//           emissions: b.co2Emissions
//         };
        
//         const scoreA = (normalizedA.duration * 0.4) + (normalizedA.cost * 0.3) + (normalizedA.emissions * 0.3);
//         const scoreB = (normalizedB.duration * 0.4) + (normalizedB.cost * 0.3) + (normalizedB.emissions * 0.3);
//         return scoreA - scoreB;
//     }
//   });
// }

// // Utility function to calculate distance between two points
// export function calculateDistance(coord1: [number, number], coord2: [number, number]): number {
//   const R = 6371; // Earth's radius in km
//   const dLat = (coord2[1] - coord1[1]) * Math.PI / 180;
//   const dLon = (coord2[0] - coord1[0]) * Math.PI / 180;
  
//   const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
//     Math.cos(coord1[1] * Math.PI / 180) * Math.cos(coord2[1] * Math.PI / 180) *
//     Math.sin(dLon/2) * Math.sin(dLon/2);
  
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//   return R * c;
// }

// // Test API connectivity
// export async function testAPIConnectivity() {
//   const results = {
//     geoapify: false,
//     mapbox: false,
//     transitland: false,
//     carbonInterface: false
//   };

//   // Test Geoapify
//   if (GEOAPIFY_CONFIG.apiKey) {
//     try {
//       const response = await fetch(
//         `${GEOAPIFY_CONFIG.baseUrl}/geocode/search?text=New York&limit=1&apiKey=${GEOAPIFY_CONFIG.apiKey}`
//       );
//       results.geoapify = response.ok;
//     } catch (error) {
//       console.error('Geoapify test failed:', error);
//     }
//   }

//   // Test Mapbox
//   if (MAPBOX_CONFIG.accessToken) {
//     try {
//       const response = await fetch(
//         `${MAPBOX_CONFIG.baseUrl}/geocoding/v5/mapbox.places/test.json?access_token=${MAPBOX_CONFIG.accessToken}&limit=1`
//       );
//       results.mapbox = response.ok;
//     } catch (error) {
//       console.error('Mapbox test failed:', error);
//     }
//   }

//   console.log('API Connectivity Test Results:', results);
//   return results;
// }





// API utility functions for SmartRoute

const API_BASE_URL = 'https://api.smartroute.com/v1';

// Mapbox API configuration
export const MAPBOX_CONFIG = {
  accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
  baseUrl: 'https://api.mapbox.com',
};

// Geoapify API configuration
export const GEOAPIFY_CONFIG = {
  apiKey: import.meta.env.VITE_GEOAPIFY_API_KEY,
  baseUrl: 'https://api.geoapify.com/v1',
};

// Transitland API configuration
export const TRANSITLAND_CONFIG = {
  apiKey: import.meta.env.VITE_TRANSITLAND_API_KEY,
  baseUrl: 'https://transit.land/api/v2',
};

// Carbon Interface API configuration
export const CARBON_INTERFACE_CONFIG = {
  apiKey: import.meta.env.VITE_CARBON_INTERFACE_API_KEY,
  baseUrl: 'https://www.carboninterface.com/api/v1',
};

// Check if API keys are configured
export const checkAPIKeys = () => {
  const keys = {
    mapbox: !!MAPBOX_CONFIG.accessToken,
    geoapify: !!GEOAPIFY_CONFIG.apiKey,
    transitland: !!TRANSITLAND_CONFIG.apiKey,
    carbonInterface: !!CARBON_INTERFACE_CONFIG.apiKey
  };
  
  console.log('API Keys Status:', keys);
  return keys;
};

// Geocoding function using Geoapify
export async function geocodePlace(query: string) {
  if (!GEOAPIFY_CONFIG.apiKey) {
    console.warn('Geoapify API key not configured');
    return [];
  }

  try {
    const response = await fetch(
      `${GEOAPIFY_CONFIG.baseUrl}/geocode/autocomplete?text=${encodeURIComponent(query)}&limit=5&apiKey=${GEOAPIFY_CONFIG.apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`Geocoding request failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.features || [];
  } catch (error) {
    console.error('Geocoding error:', error);
    return [];
  }
}

// Get transit directions using Mapbox
export async function getTransitDirections(origin: [number, number], destination: [number, number]) {
  if (!MAPBOX_CONFIG.accessToken) {
    console.warn('Mapbox access token not configured');
    return [];
  }

  try {
    const response = await fetch(
      `${MAPBOX_CONFIG.baseUrl}/directions/v5/mapbox/transit/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?access_token=${MAPBOX_CONFIG.accessToken}&overview=full&geometries=geojson`
    );
    
    if (!response.ok) {
      if (response.status === 422) {
        console.warn('No transit routes found for this area');
        return [];
      }
      throw new Error(`Transit directions request failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.routes || [];
  } catch (error) {
    console.error('Transit directions error:', error);
    return [];
  }
}

// Alternative: Get driving directions as fallback
export async function getDrivingDirections(origin: [number, number], destination: [number, number]) {
  if (!MAPBOX_CONFIG.accessToken) {
    return [];
  }

  try {
    const response = await fetch(
      `${MAPBOX_CONFIG.baseUrl}/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?access_token=${MAPBOX_CONFIG.accessToken}&overview=full&geometries=geojson`
    );
    
    if (!response.ok) {
      throw new Error(`Driving directions request failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data.routes || [];
  } catch (error) {
    console.error('Driving directions error:', error);
    return [];
  }
}

// Get transit data from Transitland
export async function getTransitData(lat: number, lon: number, radius = 1000) {
  if (!TRANSITLAND_CONFIG.apiKey) {
    console.warn('Transitland API key not configured');
    return [];
  }

  try {
    const response = await fetch(
      `${TRANSITLAND_CONFIG.baseUrl}/stops?lat=${lat}&lon=${lon}&radius=${radius}&apikey=${TRANSITLAND_CONFIG.apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`Transitland request failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data.stops || [];
  } catch (error) {
    console.error('Transitland error:', error);
    return [];
  }
}

// Calculate carbon emissions using Carbon Interface API
export async function calculateCarbonEmissions(distance: number, transportType: string) {
  if (!CARBON_INTERFACE_CONFIG.apiKey) {
    // Fallback calculation if no API key
    const emissionFactors: { [key: string]: number } = {
      bus: 0.089, // kg CO2 per km
      metro: 0.041,
      train: 0.041,
      walk: 0,
      bicycle: 0,
      express: 0.06
    };
    
    return (emissionFactors[transportType] || 0.089) * distance;
  }

  try {
    const vehicleModelMap: { [key: string]: string } = {
      bus: 'bus-city',
      metro: 'train-electric',
      train: 'train-electric',
      express: 'bus-express'
    };

    const response = await fetch(
      `${CARBON_INTERFACE_CONFIG.baseUrl}/estimates`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CARBON_INTERFACE_CONFIG.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'vehicle',
          distance_unit: 'km',
          distance_value: distance,
          vehicle_model_id: vehicleModelMap[transportType] || 'bus-city',
        }),
      }
    );
    
    if (!response.ok) {
      throw new Error(`Carbon calculation request failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data.attributes.carbon_kg;
  } catch (error) {
    console.error('Carbon calculation error:', error);
    // Fallback calculation
    return distance * 0.089;
  }
}

// Enhanced route optimization with dynamic scoring
export function optimizeRoutes(routes: any[], priority: string, distance: number) {
  return routes.sort((a, b) => {
    switch (priority) {
      case 'fastest':
        return a.duration - b.duration;
      case 'cheapest':
        return a.cost - b.cost;
      case 'eco':
        return a.co2Emissions - b.co2Emissions;
      default:
        // Dynamic balanced scoring based on trip distance
        const distanceWeight = distance > 10 ? 0.5 : 0.4; // Prioritize time for long trips
        const costWeight = distance < 5 ? 0.4 : 0.3; // Cost matters more for short trips
        const ecoWeight = distance > 15 ? 0.2 : 0.3; // Eco matters more for medium trips
        
        // Normalize values for comparison
        const maxDuration = Math.max(...routes.map(r => r.duration));
        const maxCost = Math.max(...routes.map(r => r.cost));
        const maxEmissions = Math.max(...routes.map(r => r.co2Emissions));
        
        const scoreA = (a.duration / maxDuration) * distanceWeight + 
                      (a.cost / maxCost) * costWeight + 
                      (a.co2Emissions / maxEmissions) * ecoWeight;
        const scoreB = (b.duration / maxDuration) * distanceWeight + 
                      (b.cost / maxCost) * costWeight + 
                      (b.co2Emissions / maxEmissions) * ecoWeight;
        
        return scoreA - scoreB;
    }
  });
}

// Generate realistic route variations based on real factors
export function generateRouteVariations(baseRoute: any, params: any) {
  const variations = [baseRoute];
  const distance = calculateDistance(params.originCoords, params.destinationCoords);
  
  // Generate express variant if distance > 5km
  if (distance > 5) {
    variations.push({
      ...baseRoute,
      id: baseRoute.id + '_express',
      duration: Math.round(baseRoute.duration * 0.75),
      cost: baseRoute.cost * 1.6,
      co2Emissions: baseRoute.co2Emissions * 1.2,
      transfers: Math.max(0, baseRoute.transfers - 1),
      modes: ['walk', 'express', 'walk'],
      steps: [
        { mode: 'walk', duration: 3, description: `Walk to express station` },
        { mode: 'express', duration: Math.round(baseRoute.duration * 0.65), description: 'Express service' },
        { mode: 'walk', duration: 2, description: `Walk to destination` }
      ]
    });
  }
  
  // Generate eco-friendly variant
  variations.push({
    ...baseRoute,
    id: baseRoute.id + '_eco',
    duration: Math.round(baseRoute.duration * 1.15),
    cost: baseRoute.cost * 0.85,
    co2Emissions: baseRoute.co2Emissions * 0.4,
    transfers: baseRoute.transfers + 1,
    modes: ['walk', 'bike', 'metro', 'walk'],
    steps: [
      { mode: 'walk', duration: 2, description: `Walk to bike station` },
      { mode: 'bike', duration: Math.round(baseRoute.duration * 0.3), description: 'Bike share to metro' },
      { mode: 'metro', duration: Math.round(baseRoute.duration * 0.6), description: 'Metro connection' },
      { mode: 'walk', duration: 3, description: `Walk to destination` }
    ]
  });
  
  return variations;
}

// Utility function to calculate distance between two points
export function calculateDistance(coord1: [number, number], coord2: [number, number]): number {
  const R = 6371; // Earth's radius in km
  const dLat = (coord2[1] - coord1[1]) * Math.PI / 180;
  const dLon = (coord2[0] - coord1[0]) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1[1] * Math.PI / 180) * Math.cos(coord2[1] * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Test API connectivity
export async function testAPIConnectivity() {
  const results = {
    geoapify: false,
    mapbox: false,
    transitland: false,
    carbonInterface: false
  };

  // Test Geoapify
  if (GEOAPIFY_CONFIG.apiKey) {
    try {
      const response = await fetch(
        `${GEOAPIFY_CONFIG.baseUrl}/geocode/search?text=New York&limit=1&apiKey=${GEOAPIFY_CONFIG.apiKey}`
      );
      results.geoapify = response.ok;
    } catch (error) {
      console.error('Geoapify test failed:', error);
    }
  }

  // Test Mapbox
  if (MAPBOX_CONFIG.accessToken) {
    try {
      const response = await fetch(
        `${MAPBOX_CONFIG.baseUrl}/geocoding/v5/mapbox.places/test.json?access_token=${MAPBOX_CONFIG.accessToken}&limit=1`
      );
      results.mapbox = response.ok;
    } catch (error) {
      console.error('Mapbox test failed:', error);
    }
  }

  console.log('API Connectivity Test Results:', results);
  return results;
}