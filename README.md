# SmartRoute: Eco-Aware Public Transit Planner

A modern web application that helps college students discover and compare optimal public transit routes based on real-time data, multi-modal planning, and carbon emission estimates.

## Features

- **Dynamic Route Search**: Origin & destination input with smart autocomplete
- **Multi-Modal Planning**: Integrates bus, metro, train, and walking segments
- **Route Comparison**: Compare up to 3 routes by time, cost, and CO₂ emissions
- **Smart Filtering**: Prioritize routes by fastest, cheapest, eco-friendly, or balanced criteria
- **Carbon Tracking**: Weekly CO₂ savings dashboard and community leaderboard
- **Responsive Design**: Optimized for both mobile and desktop usage

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Ready for Netlify/Vercel

## API Integration

This app integrates with several APIs for comprehensive transit planning:

- **Mapbox Directions & Geocoding**: Multi-modal routing and map visualization
- **Transitland API**: Real-time transit schedules and GTFS data
- **Geoapify Places API**: Address autocomplete and geocoding
- **Carbon Interface API**: Carbon emission calculations

## Getting Started

### Prerequisites

You'll need API keys from the following services:

1. **Mapbox** - [Sign up here](https://account.mapbox.com/auth/signin/)
2. **Geoapify** - [Sign up here](https://myprojects.geoapify.com/)
3. **Transitland** - [Get API access](https://www.transit.land/api/v2/)
4. **Carbon Interface** - [Sign up here](https://www.carboninterface.com/)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment file:
   ```bash
   cp .env.example .env
   ```
4. Add your API keys to `.env` (see API Setup section below)
5. Start the development server:
   ```bash
   npm run dev
   ```

## API Setup Guide

### 1. Mapbox API Key

1. Go to [Mapbox Account](https://account.mapbox.com/auth/signin/)
2. Sign up or log in to your account
3. Navigate to "Access Tokens" in your account dashboard
4. Copy your default public token OR create a new token
5. Add to `.env`: `VITE_MAPBOX_ACCESS_TOKEN=pk.your_token_here`

### 2. Geoapify API Key

1. Visit [Geoapify Projects](https://myprojects.geoapify.com/)
2. Create an account or sign in
3. Create a new project
4. Go to "API Keys" and copy your key
5. Add to `.env`: `VITE_GEOAPIFY_API_KEY=your_key_here`

### 3. Transitland API Key

1. Go to [Transitland API](https://www.transit.land/api/v2/)
2. Sign up for an account
3. Navigate to your dashboard and generate an API key
4. Add to `.env`: `VITE_TRANSITLAND_API_KEY=your_key_here`

### 4. Carbon Interface API Key

1. Visit [Carbon Interface](https://www.carboninterface.com/)
2. Create an account
3. Go to your dashboard and generate an API key
4. Add to `.env`: `VITE_CARBON_INTERFACE_API_KEY=your_key_here`

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # App header with navigation
│   ├── SearchForm.tsx  # Route search form
│   ├── RouteResults.tsx # Route comparison display
│   ├── RouteCard.tsx   # Individual route card
│   ├── RouteMap.tsx    # Map visualization
│   ├── Sidebar.tsx     # CO₂ tracking sidebar
│   └── ...
├── types/              # TypeScript type definitions
├── utils/              # API utilities and helpers
└── App.tsx            # Main app component
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details