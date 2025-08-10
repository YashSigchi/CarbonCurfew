// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { Search, MapPin, Clock, Zap, DollarSign, Leaf } from 'lucide-react';
// import { SearchParams } from '../types';
// import PlaceAutocomplete from './PlaceAutocomplete';

// interface SearchFormProps {
//   onSearch: (params: SearchParams) => void;
//   loading: boolean;
// }

// const SearchForm: React.FC<SearchFormProps> = ({ onSearch, loading }) => {
//   const [origin, setOrigin] = useState('');
//   const [destination, setDestination] = useState('');
//   const [priority, setPriority] = useState<SearchParams['priority']>('balanced');
//   const [departureTime, setDepartureTime] = useState('now');

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (origin && destination) {
//       onSearch({
//         origin,
//         destination,
//         priority,
//         departureTime: departureTime === 'now' ? undefined : departureTime
//       });
//     }
//   };

//   const priorityOptions = [
//     { value: 'fastest', label: 'Fastest', icon: Zap, color: 'text-blue-600' },
//     { value: 'cheapest', label: 'Cheapest', icon: DollarSign, color: 'text-green-600' },
//     { value: 'eco', label: 'Eco-Friendly', icon: Leaf, color: 'text-emerald-600' },
//     { value: 'balanced', label: 'Balanced', icon: Clock, color: 'text-slate-600' }
//   ];

//   return (
//     <motion.div
//       initial={{ opacity: 0, x: -20 }}
//       animate={{ opacity: 1, x: 0 }}
//       className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
//     >
//       <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
//         <Search className="w-5 h-5 mr-2 text-emerald-600" />
//         Plan Your Route
//       </h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-slate-700 mb-2">
//             <MapPin className="w-4 h-4 inline mr-1" />
//             From
//           </label>
//           <PlaceAutocomplete
//             value={origin}
//             onChange={setOrigin}
//             placeholder="Enter starting location"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-slate-700 mb-2">
//             <MapPin className="w-4 h-4 inline mr-1" />
//             To
//           </label>
//           <PlaceAutocomplete
//             value={destination}
//             onChange={setDestination}
//             placeholder="Enter destination"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-slate-700 mb-2">
//             Priority
//           </label>
//           <div className="grid grid-cols-2 gap-2">
//             {priorityOptions.map((option) => {
//               const IconComponent = option.icon;
//               return (
//                 <button
//                   key={option.value}
//                   type="button"
//                   onClick={() => setPriority(option.value as SearchParams['priority'])}
//                   className={`p-3 rounded-lg border-2 transition-all text-left ${
//                     priority === option.value
//                       ? 'border-emerald-600 bg-emerald-50'
//                       : 'border-slate-200 hover:border-slate-300'
//                   }`}
//                 >
//                   <IconComponent className={`w-4 h-4 mb-1 ${option.color}`} />
//                   <div className="text-sm font-medium text-slate-800">
//                     {option.label}
//                   </div>
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-slate-700 mb-2">
//             Departure Time
//           </label>
//           <select
//             value={departureTime}
//             onChange={(e) => setDepartureTime(e.target.value)}
//             className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//           >
//             <option value="now">Leave Now</option>
//             <option value="15min">In 15 minutes</option>
//             <option value="30min">In 30 minutes</option>
//             <option value="1hour">In 1 hour</option>
//             <option value="custom">Custom Time</option>
//           </select>
//         </div>

//         <motion.button
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           type="submit"
//           disabled={!origin || !destination || loading}
//           className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//         >
//           {loading ? 'Finding Routes...' : 'Find Routes'}
//         </motion.button>
//       </form>
//     </motion.div>
//   );
// };

// export default SearchForm;









import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Clock, Zap, DollarSign, Leaf } from 'lucide-react';
import { SearchParams, Place } from '../types';
import PlaceAutocomplete from './PlaceAutocomplete';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  loading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, loading }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [originPlace, setOriginPlace] = useState<Place | null>(null);
  const [destinationPlace, setDestinationPlace] = useState<Place | null>(null);
  const [priority, setPriority] = useState<SearchParams['priority']>('balanced');
  const [departureTime, setDepartureTime] = useState('now');

  const handleOriginChange = (value: string, place?: Place) => {
    setOrigin(value);
    if (place) {
      setOriginPlace(place);
    }
  };

  const handleDestinationChange = (value: string, place?: Place) => {
    setDestination(value);
    if (place) {
      setDestinationPlace(place);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (origin && destination && originPlace && destinationPlace) {
      onSearch({
        origin,
        destination,
        originCoords: [originPlace.lon, originPlace.lat],
        destinationCoords: [destinationPlace.lon, destinationPlace.lat],
        priority,
        departureTime: departureTime === 'now' ? undefined : departureTime
      });
    } else {
      alert('Please select valid locations from the dropdown suggestions');
    }
  };

  const priorityOptions = [
    { value: 'fastest', label: 'Fastest', icon: Zap, color: 'text-blue-600' },
    { value: 'cheapest', label: 'Cheapest', icon: DollarSign, color: 'text-green-600' },
    { value: 'eco', label: 'Eco-Friendly', icon: Leaf, color: 'text-emerald-600' },
    { value: 'balanced', label: 'Balanced', icon: Clock, color: 'text-slate-600' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
    >
      <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
        <Search className="w-5 h-5 mr-2 text-emerald-600" />
        Plan Your Route
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            From
          </label>
          <PlaceAutocomplete
            value={origin}
            onChange={handleOriginChange}
            placeholder="Enter starting location"
          />
          {origin && !originPlace && (
            <p className="text-xs text-amber-600 mt-1">Please select a location from the suggestions</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            To
          </label>
          <PlaceAutocomplete
            value={destination}
            onChange={handleDestinationChange}
            placeholder="Enter destination"
          />
          {destination && !destinationPlace && (
            <p className="text-xs text-amber-600 mt-1">Please select a location from the suggestions</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Priority
          </label>
          <div className="grid grid-cols-2 gap-2">
            {priorityOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPriority(option.value as SearchParams['priority'])}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    priority === option.value
                      ? 'border-emerald-600 bg-emerald-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <IconComponent className={`w-4 h-4 mb-1 ${option.color}`} />
                  <div className="text-sm font-medium text-slate-800">
                    {option.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Departure Time
          </label>
          <select
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="now">Leave Now</option>
            <option value="15min">In 15 minutes</option>
            <option value="30min">In 30 minutes</option>
            <option value="1hour">In 1 hour</option>
            <option value="custom">Custom Time</option>
          </select>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={!origin || !destination || !originPlace || !destinationPlace || loading}
          className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Finding Routes...' : 'Find Routes'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default SearchForm;