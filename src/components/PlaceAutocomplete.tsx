// import React, { useState, useRef, useEffect } from 'react';
// import { MapPin, Search } from 'lucide-react';
// import { Place } from '../types';

// interface PlaceAutocompleteProps {
//   value: string;
//   onChange: (value: string) => void;
//   placeholder: string;
// }

// const PlaceAutocomplete: React.FC<PlaceAutocompleteProps> = ({
//   value,
//   onChange,
//   placeholder
// }) => {
//   const [suggestions, setSuggestions] = useState<Place[]>([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const inputRef = useRef<HTMLInputElement>(null);
//   const timeoutRef = useRef<NodeJS.Timeout>();

//   const fetchSuggestions = async (query: string) => {
//     if (query.length < 3) {
//       setSuggestions([]);
//       return;
//     }

//     setLoading(true);
    
//     try {
//       // Mock suggestions for demo - in production, use Geoapify API
//       const mockSuggestions: Place[] = [
//         {
//           display_name: `${query} - University Campus`,
//           lat: 40.7128,
//           lon: -74.0060,
//           place_id: '1'
//         },
//         {
//           display_name: `${query} - Downtown Station`,
//           lat: 40.7589,
//           lon: -73.9851,
//           place_id: '2'
//         },
//         {
//           display_name: `${query} - Metro Center`,
//           lat: 40.7505,
//           lon: -73.9934,
//           place_id: '3'
//         }
//       ];
      
//       setSuggestions(mockSuggestions);
//     } catch (error) {
//       console.error('Error fetching suggestions:', error);
//       setSuggestions([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newValue = e.target.value;
//     onChange(newValue);
    
//     if (timeoutRef.current) {
//       clearTimeout(timeoutRef.current);
//     }
    
//     timeoutRef.current = setTimeout(() => {
//       fetchSuggestions(newValue);
//     }, 300);
    
//     setShowSuggestions(true);
//   };

//   const handleSuggestionClick = (suggestion: Place) => {
//     onChange(suggestion.display_name);
//     setSuggestions([]);
//     setShowSuggestions(false);
//     inputRef.current?.blur();
//   };

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
//         setShowSuggestions(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   return (
//     <div className="relative">
//       <div className="relative">
//         <input
//           ref={inputRef}
//           type="text"
//           value={value}
//           onChange={handleInputChange}
//           onFocus={() => setShowSuggestions(true)}
//           placeholder={placeholder}
//           className="w-full p-3 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//         />
//         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
//       </div>

//       {showSuggestions && (suggestions.length > 0 || loading) && (
//         <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
//           {loading ? (
//             <div className="p-3 text-center text-slate-500">
//               <div className="animate-spin w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full mx-auto"></div>
//             </div>
//           ) : (
//             suggestions.map((suggestion) => (
//               <button
//                 key={suggestion.place_id}
//                 onClick={() => handleSuggestionClick(suggestion)}
//                 className="w-full p-3 text-left hover:bg-slate-50 flex items-center space-x-2 border-b border-slate-100 last:border-b-0"
//               >
//                 <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
//                 <span className="text-slate-700 truncate">{suggestion.display_name}</span>
//               </button>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default PlaceAutocomplete;







import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MapPin, Search } from 'lucide-react';
import { Place } from '../types';

interface PlaceAutocompleteProps {
  value: string;
  onChange: (value: string, place?: Place) => void;
  placeholder: string;
}

const PlaceAutocomplete: React.FC<PlaceAutocompleteProps> = ({
  value,
  onChange,
  placeholder
}) => {
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    
    try {
      const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
      
      if (!apiKey) {
        console.warn('Geoapify API key not configured, using mock data');
        // Mock data for testing
        const mockSuggestions: Place[] = [
          {
            display_name: `${query} Street, New York, NY, USA`,
            lat: 40.7128 + Math.random() * 0.1,
            lon: -74.0060 + Math.random() * 0.1,
            place_id: `mock_1_${query}`
          },
          {
            display_name: `${query} Avenue, Brooklyn, NY, USA`,
            lat: 40.6782 + Math.random() * 0.1,
            lon: -73.9442 + Math.random() * 0.1,
            place_id: `mock_2_${query}`
          },
          {
            display_name: `${query} Plaza, Manhattan, NY, USA`,
            lat: 40.7589 + Math.random() * 0.1,
            lon: -73.9851 + Math.random() * 0.1,
            place_id: `mock_3_${query}`
          }
        ];
        
        setSuggestions(mockSuggestions);
        setIsOpen(true);
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&limit=5&apiKey=${apiKey}`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding request failed');
      }
      
      const data = await response.json();
      
      const places: Place[] = data.features?.map((feature: any) => ({
        display_name: feature.properties.formatted || feature.properties.name,
        lat: feature.geometry.coordinates[1],
        lon: feature.geometry.coordinates[0],
        place_id: feature.properties.place_id || `${feature.geometry.coordinates[0]}_${feature.geometry.coordinates[1]}`
      })) || [];
      
      setSuggestions(places);
      setIsOpen(places.length > 0);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setHighlightedIndex(-1);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (newValue.trim()) {
      timeoutRef.current = setTimeout(() => {
        fetchSuggestions(newValue);
      }, 300);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  };

  const selectSuggestion = useCallback((suggestion: Place) => {
    console.log('Selecting suggestion:', suggestion);
    onChange(suggestion.display_name, suggestion);
    setSuggestions([]);
    setIsOpen(false);
    setHighlightedIndex(-1);
    
    // Delay blur to prevent issues
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }, 100);
  }, [onChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          selectSuggestion(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setIsOpen(true);
    } else if (value.length >= 2) {
      fetchSuggestions(value);
    }
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full p-3 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
          autoComplete="off"
          spellCheck="false"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>

      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute z-[9999] w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-2xl max-h-60 overflow-y-auto"
          style={{ 
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 9999
          }}
        >
          {loading ? (
            <div className="p-4 text-center text-slate-500">
              <div className="animate-spin w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full mx-auto mb-2"></div>
              <span className="text-xs">Searching locations...</span>
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <div
                key={suggestion.place_id}
                className={`p-3 hover:bg-emerald-50 cursor-pointer flex items-center space-x-3 border-b border-slate-100 last:border-b-0 transition-colors ${
                  index === highlightedIndex ? 'bg-emerald-50' : ''
                }`}
                onClick={() => {
                  console.log('Clicked suggestion:', suggestion);
                  selectSuggestion(suggestion);
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
                onMouseDown={(e) => {
                  // Prevent input blur
                  e.preventDefault();
                }}
              >
                <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-slate-700 text-sm flex-1 truncate">
                  {suggestion.display_name}
                </span>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-slate-500 text-sm">
              No locations found. Try a different search term.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlaceAutocomplete;