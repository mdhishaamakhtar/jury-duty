<p align="center">
  <img src="./frontend/static/favicon.svg" alt="Jury Duty Logo" width="95" height="90">
</p>

# Jury Duty

A scalable data labeling platform enabling rapid multi-contributor dataset annotation with comprehensive data collection for statistical analysis

## Overview

Jury Duty is a streamlined data annotation platform that enables organizations and researchers to upload datasets and orchestrate simultaneous labeling by multiple contributors. Built on Supabase's powerful infrastructure, the platform focuses on efficient data collection and storage, providing researchers with the structured data needed to perform inter-rater reliability (IRR) analysis, bias detection, and statistical validation.

The project demonstrates expertise in:
- **Supabase Integration**: Full-stack leveraging of Supabase Auth, Database, and Edge Functions
- **Intelligent SQL Work Distribution**: Custom PostgreSQL functions for optimal task assignment
- **Scalable Architecture**: Serverless edge functions enabling automatic scaling
- **Real-time Data Collection**: Structured storage enabling downstream statistical analysis
- **Multi-user Coordination**: Conflict-free simultaneous annotation workflows
- **Modern Web Development**: SvelteKit 5 with TypeScript for responsive interfaces

## Core Features

### ✅ Efficient Data Collection
- **Multi-contributor Labeling**: Enable simultaneous annotation by multiple users
- **Intelligent Work Distribution**: SQL-optimized assignment prevents conflicts and balances workload
- **Progress Tracking**: Real-time monitoring of annotation completion across contributors
- **Structured Data Storage**: All annotations stored with timestamps, user IDs, and metadata for analysis

### ✅ Supabase-Powered Infrastructure
- **Authentication**: Secure Google OAuth integration through Supabase Auth
- **Database**: PostgreSQL with custom functions for intelligent content assignment
- **Edge Functions**: Serverless Deno-based APIs for global scalability
- **Real-time Features**: Built-in subscriptions and live data updates
- **Easy Deployment**: Single-command deployment with Supabase CLI

### ✅ Research-Ready Data Output
- **Complete Annotation Records**: User ID, content ID, labels, and timestamps for every decision
- **IRR Analysis Ready**: Data structure enables Cohen's kappa, Fleiss' kappa calculations
- **Statistical Analysis**: Query-friendly format for bias detection and quality metrics
- **Export Capabilities**: Direct database access for analysis tools and ML pipelines

### ✅ Modern User Experience
- **Responsive Design**: Mobile-first interface works across all devices  
- **Keyboard Shortcuts**: Power-user features for rapid annotation (1, T, ←, 2, F, →)
- **Real-time Feedback**: Immediate UI updates with optimistic rendering
- **Error Handling**: Comprehensive error states with user-friendly messaging

## Impact & Research Value

### 🎯 **Accelerated Data Collection**
Jury Duty solves the critical bottleneck of dataset annotation by enabling parallel labeling:
- **Distributed Annotation**: Multiple contributors work simultaneously without conflicts
- **Reduced Timeline**: Complete annotation projects in days instead of weeks
- **Scalable Architecture**: Handle projects from dozens to thousands of contributors

### 🔬 **Statistical Analysis Foundation**  
The platform provides researchers with structured data for rigorous analysis:
- **IRR Calculations**: Data format enables Cohen's Kappa, Fleiss' Kappa, and agreement metrics
- **Bias Detection**: Query annotation patterns to identify systematic biases
- **Quality Control**: Analyze contributor consistency and outlier detection
- **Consensus Building**: Use multiple labels per item for robust ground truth

### 🌍 **Accessible Research Infrastructure**
Built on Supabase's managed services, Jury Duty democratizes access to annotation infrastructure:
- **No DevOps Required**: Deploy and scale without managing servers
- **Cost Effective**: Pay-per-use model scales with project needs
- **Global Distribution**: Edge functions provide low-latency access worldwide
- **Academic Friendly**: Free tier supports small research projects

## Core Technologies

### Frontend Stack
[![SvelteKit](https://img.shields.io/badge/SvelteKit-5.0-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)](https://kit.svelte.dev/) [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/) [![DaisyUI](https://img.shields.io/badge/DaisyUI-5.0-5A0EF8?style=for-the-badge&logo=daisyui&logoColor=white)](https://daisyui.com/)

### Backend & Infrastructure  
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/) [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/) [![Deno](https://img.shields.io/badge/Deno-000000?style=for-the-badge&logo=deno&logoColor=white)](https://deno.land/) [![Edge Functions](https://img.shields.io/badge/Edge_Functions-Serverless-FF6B6B?style=for-the-badge&logo=vercel&logoColor=white)](https://supabase.com/docs/guides/functions)

### Development Tools
[![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/) [![ESLint](https://img.shields.io/badge/ESLint-9.0-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/) [![Prettier](https://img.shields.io/badge/Prettier-3.4-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)](https://prettier.io/)

### Authentication & Security
[![OAuth2](https://img.shields.io/badge/OAuth2-Google-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://developers.google.com/identity/protocols/oauth2) [![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/) [![RLS](https://img.shields.io/badge/Row_Level_Security-PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://supabase.com/docs/guides/auth/row-level-security)

## Project Metrics

[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](./LICENSE) [![Documentation](https://img.shields.io/badge/API-Documentation-green?style=for-the-badge&logo=gitbook&logoColor=white)](./API_DOCUMENTATION.md) [![TypeScript](https://img.shields.io/badge/Type_Safe-100%25-success?style=for-the-badge&logo=typescript)](./frontend/tsconfig.json)

## Architecture Overview

### Supabase-Powered Backend
Jury Duty leverages Supabase's managed infrastructure for scalable data collection:

- **PostgreSQL Database**: Stores content and user annotations with custom assignment functions
- **Edge Functions**: Two Deno-based serverless functions handle content assignment and label submission
- **Authentication**: Google OAuth2 integration via Supabase Auth
- **Global Distribution**: Automatic scaling across Supabase's edge network

### Intelligent Work Distribution  
The core innovation is a custom PostgreSQL function that intelligently assigns content to users:
- Returns existing "started" content to prevent multiple assignments per user
- Load balances by prioritizing content with fewer completed labels  
- Prevents race conditions using `FOR UPDATE SKIP LOCKED` database locking
- Enforces unique constraints ensuring one active assignment per user

### Research-Ready Data Output
All annotations are stored with complete metadata enabling downstream analysis:
- User IDs, content IDs, labels, and timestamps for every decision
- Structured format ready for IRR calculations (Cohen's Kappa, Fleiss' Kappa etc.)
- Direct SQL access for custom analysis queries
- Export capabilities for integration with R, Python, and other analysis tools

## Quick Start

### Prerequisites  
- Node.js 18+ and npm
- Supabase account (free tier available)
- Google OAuth2 credentials

### Setup Instructions
```bash
# Clone and setup frontend
git clone <repository-url>
cd jury-duty/frontend
npm install
cp .env.example .env.local  # Add your Supabase credentials

# Setup Supabase backend
cd ../backend
npx supabase start
npx supabase db push
npx supabase functions deploy

# Start development
cd ../frontend  
npm run dev
```

### Deploy to Production
```bash
# Frontend deployment (Vercel, Netlify, etc.)
npm run build

# Backend deployment  
npx supabase db push --environment production
npx supabase functions deploy --environment production
```

The platform will be available at your deployment URL with backend functions running on Supabase's global edge network.

## API Documentation

Complete backend API documentation with request/response schemas and authentication flows is available in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

### Key Endpoints
- `POST /functions/v1/get_next_datapoint` - Intelligent content assignment with user authentication
- `POST /functions/v1/label_data` - Secure label submission with validation and state management  
- Authentication handled seamlessly via Supabase Auth with Google OAuth2

## Contributors
- **Md Hishaam Akhtar** - Backend Architecture & Supabase Integration - [GitHub](https://github.com/mdhishaamakhtar) | [LinkedIn](https://www.linkedin.com/in/mdhishaamakhtar/)
- **Pranav Raghav** - Frontend Development & User Experience - [GitHub](#) | [LinkedIn](#)

<p align="center">
    <strong>Streamlining Data Collection for Research Excellence</strong><br>
    Built with ❤️ for the global research community
</p>