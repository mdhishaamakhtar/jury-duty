# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a SvelteKit frontend application for a content labeling platform. The app allows multiple users to view content and label it by choosing between two options. It uses:
- SvelteKit 2.x with Svelte 5 for the framework
- TypeScript for type safety
- Tailwind CSS v4 with DaisyUI for styling (mobile-first approach)
- Supabase for authentication, data storage, and edge function invocation
- Vite for build tooling

## App Purpose

Users can:
- Sign in with Google OAuth through Supabase Auth
- View content that needs to be labeled
- Choose between two labeling options for each piece of content
- Submit their labeling choices, which are stored in Supabase
- The app supports multiple users labeling the same content

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run check

# Type checking with watch mode
npm run check:watch

# Code formatting
npm run format

# Linting (includes prettier check + eslint)
npm run lint
```

## Project Structure

- `src/routes/` - SvelteKit file-based routing
  - `+layout.svelte` - Root layout component with global CSS import
  - `+page.svelte` - Home page component
- `src/lib/` - Shared utilities and components (import via `$lib` alias)
- `src/app.css` - Global CSS with Tailwind imports
- `static/` - Static assets

## Key Configuration Files

- `svelte.config.js` - SvelteKit configuration with auto adapter
- `vite.config.ts` - Vite configuration with Tailwind and SvelteKit plugins
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint configuration with Svelte support

## Development Notes

- Uses Svelte 5 syntax (`$props()`, `{@render children()}`)
- Tailwind CSS v4 with DaisyUI component library for UI components
- Mobile-first design approach - start with mobile styles and scale up
- Supabase client configured for authentication and edge functions
- TypeScript is configured and enforced
- Prettier and ESLint are configured for code quality

## Design Guidelines

- Follow mobile-first responsive design principles
- Use DaisyUI components for consistent UI elements
- Leverage Tailwind's responsive breakpoints (`sm:`, `md:`, `lg:`, `xl:`)
- Ensure all interfaces work well on mobile devices first

## Supabase Integration

- Supabase client library (@supabase/supabase-js) is installed
- Use for user authentication and session management
- Store content to be labeled and user labeling responses
- Invoke edge functions for server-side operations
- Configure environment variables for Supabase URL and anon key

## Data Flow

1. **Content Management**: Content items are stored in Supabase (text, images, or other media)
2. **User Labels**: When users make labeling choices, responses are stored in Supabase with:
   - User ID (from auth)
   - Content ID
   - Label choice (option A or B)
   - Timestamp
3. **Multi-user Support**: Multiple users can label the same content for consensus/validation

## Database Schema Considerations

Typical tables needed:
- `content` - stores items to be labeled
- `labels` - stores user labeling responses
- `users` - managed by Supabase Auth
- Consider indexes on user_id and content_id for performance