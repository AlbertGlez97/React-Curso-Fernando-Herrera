# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a GIF search application built with React 19, TypeScript, and Vite. It uses the Giphy API to search and display GIFs with a debounced search feature and search history tracking.

## Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (runs TypeScript compiler + Vite build)
- `npm run lint` - Run ESLint on all files
- `npm run preview` - Preview production build locally

## Architecture

### Module Organization

The codebase follows a feature-based folder structure:

```
src/
├── gifs/              # GIF feature module
│   ├── actions/       # Data fetching logic (getGifsByQuery)
│   ├── api/           # Axios instance with Giphy API configuration
│   ├── components/    # GIF-related components (GifList, PreviousSearches)
│   └── interfaces/    # TypeScript interfaces (Gif, GiphyResponse)
├── shared/            # Shared/reusable components
│   └── components/    # Common UI components (SearchBar, CustomHeader)
└── GifsApp.tsx        # Root application component
```

### Key Architectural Patterns

**API Layer**: The Giphy API is configured in `src/gifs/api/giphy.api.ts` using Axios. It automatically includes the API key from environment variables (`VITE_GIPHY_API_KEY`) and sets default parameters.

**Action Pattern**: API calls are abstracted into action functions (e.g., `getGifsByQuery` in `src/gifs/actions/`). These functions:
- Handle the HTTP request
- Transform API responses into simplified application interfaces
- Return typed data using domain-specific interfaces

**Data Flow**: The main `GifsApp.tsx` component manages state for both GIFs and search history. Search queries flow through:
1. SearchBar (with 1-second debounce)
2. GifsApp handler (validation & deduplication)
3. getGifsByQuery action
4. State update & re-render

**Search Features**:
- Debounced search with 1-second delay (in SearchBar component)
- Search history limited to 8 most recent unique terms
- Case-insensitive, trimmed query handling
- Duplicate search prevention

### Environment Variables

The app requires `VITE_GIPHY_API_KEY` in a `.env` file at the root. Vite automatically loads variables prefixed with `VITE_`.

### TypeScript Configuration

The project uses TypeScript 5.9 with a composite project structure:
- `tsconfig.json` - Root configuration with project references
- `tsconfig.app.json` - Application-specific settings
- `tsconfig.node.json` - Node/build tool settings

### Build Tools

- **Vite 7** with SWC plugin for fast builds and HMR
- **ESLint 9** with TypeScript, React Hooks, and React Refresh plugins
- React 19 with StrictMode enabled
