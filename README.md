# Tengo Stream - Tender Management Application

A React-based tender management application that allows users to browse, filter, and make decisions on public tenders. The application features an infinite scroll interface for browsing tenders and a pipeline system for managing selected tenders.

## Features

- **Stream View**: Browse tenders with infinite scroll functionality
- **Decision Making**: Accept ("À analyser") or reject ("Rejeter") tenders
- **Pipeline Management**: View and manage tenders marked for analysis
- **Tender Details**: Detailed view of individual tenders
- **Real-time Counters**: Dynamic counters showing remaining tenders
- **Responsive Design**: Mobile-friendly interface using Mantine UI components

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Library**: Mantine (components, hooks, notifications)
- **Styling**: Tailwind CSS
- **Notifications**: react-hot-toast
- **Backend**: Express.js (mock server)
- **Icons**: Tabler Icons

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd tengo-stream
npm install
```

2. **Start the mock backend server**
```bash
cd backend-mock
node server.js
```
The backend will run on `http://localhost:3000`

3. **Start the frontend development server**
```bash
npm run dev
```
The frontend will run on `http://localhost:5173`

## Project Structure

```
tengo-stream/
├── backend-mock/           # Mock Express.js server
│   ├── database.js         # In-memory database
│   └── server.js           # Server implementation
├── src/
│   ├── features/           # Feature-based architecture
│   │   ├── streams/       # Stream browsing feature
│   │   └── pipeline/      # Pipeline management feature
│   ├── shared/            # Shared components
│   └── main.tsx           # Application entry point
└── public/                # Static assets
```

## API Endpoints

The mock backend provides the following endpoints:

- `POST /tenders/search` - Search and paginate tenders
- `POST /interactions/decisionStatus` - Record user decisions on tenders
- `GET /tenders/pipeline` - Get tenders marked for analysis
- `GET /tenders/:id` - Get detailed information about a specific tender

## Usage

1. **Browse Tenders**: The main stream view displays tenders with infinite scroll
2. **Make Decisions**: Click "À analyser" to add to pipeline or "Rejeter" to reject
3. **View Pipeline**: Switch to the Pipeline tab to see selected tenders
4. **View Details**: Click the arrow icon on any tender card to see full details
5. **Refresh**: Use the refresh button to reload data

## Development

The application follows a feature-based architecture with clean separation of concerns:

- **Components**: UI components using Mantine
- **Hooks**: Custom React hooks for data management
- **Services**: API service layer
- **Types**: TypeScript interfaces and types

## Contributing

1. Follow the existing code structure and patterns
2. Use TypeScript for type safety
3. Follow the established naming conventions
4. Test your changes thoroughly

## License

This project is part of a technical assessment for Tengo.
