# Mixer - Multi-Platform Streaming Dashboard

A unified streaming dashboard that aggregates streamers across Twitch, Kick, and YouTube. Follow people, not platforms.

## Features

- **Unified Discovery**: Search and follow streamers across multiple platforms from one place
- **Live Status**: Real-time status updates for followed streamers with auto-refresh
- **Platform Embeds**: Watch streams directly in the app with embedded players
- **Local-First**: No account required - your follows are stored in your browser
- **Dark Mode**: Beautiful dark theme with system preference detection

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand (persisted to localStorage)
- **Data Fetching**: TanStack Query v5
- **Package Manager**: Bun

## Getting Started

### Prerequisites

1. **Get Twitch API Credentials**:
   - Go to [Twitch Dev Console](https://dev.twitch.tv/console)
   - Create a new application
   - Copy your Client ID and Client Secret

2. **Get YouTube API Key**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Create a new API key
   - Enable the YouTube Data API v3

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd mixer

# Install dependencies
bun install

# Copy environment template
cp .env.local.example .env.local

# Edit .env.local and add your API credentials
```

### Environment Variables

Edit `.env.local` with your credentials:

```env
TWITCH_CLIENT_ID=your_twitch_client_id
TWITCH_CLIENT_SECRET=your_twitch_client_secret
YOUTUBE_API_KEY=your_youtube_api_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Running the App

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Usage

1. **Search for streamers** using the search page or discover new ones on the home page
2. **Click Follow** to add streamers to your library
3. **See live status** on the home page - live followed streamers appear at the top
4. **Click on any card** to watch the stream in the embedded player
5. **Check your Library** to see all followed streamers (live and offline)

## Project Structure

```
mixer/
├── app/                      # Next.js App Router
│   ├── (dashboard)/         # Dashboard route group
│   │   ├── page.tsx         # Home/Discovery
│   │   └── library/         # Followed streamers
│   ├── watch/               # Watch pages with embeds
│   ├── search/              # Search page
│   ├── api/                 # API route proxies
│   └── globals.css          # Global styles with theme
├── components/              # React components
│   ├── platform-embeds/     # Video player embeds
│   ├── streamer-card.tsx    # Streamer display card
│   ├── platform-badge.tsx   # Platform indicator
│   ├── live-indicator.tsx   # Live status with animation
│   └── follow-button.tsx    # Follow/unfollow toggle
├── lib/
│   ├── api/                 # Platform API clients
│   ├── store.ts             # Zustand global state
│   ├── hooks/               # Custom React hooks
│   └── utils.ts             # Utility functions
└── types/                   # TypeScript type definitions
```

## API Implementation

| Platform | API Used | Notes |
|----------|----------|-------|
| Twitch | Official Helix API | Requires app credentials |
| YouTube | YouTube Data API v3 | Requires API key |
| Kick | Unofficial API | No authentication required |

## Future Improvements

See [design document](./docs/plans/2026-01-02-mixer-design.md) for planned features including:
- Real-time WebSocket updates
- OAuth authentication (optional login)
- More platforms (Trovo, Facebook Gaming)
- Unified chat overlay
- Browser push notifications
- Category browsing and filtering
- Algorithm-based recommendations

## License

MIT
