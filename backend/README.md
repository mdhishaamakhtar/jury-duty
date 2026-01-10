# Jury Duty Backend

The serverless core of the Jury Duty data labeling engine.

## Overview

Built on Supabase Edge Functions, this backend serves as the engine's processing layer, handling intelligent work distribution and secure label submission.

## Core Components

- **Edge Functions**: Deno-based serverless functions for `get_next_datapoint` and `label_data`
- **PostgreSQL**: Robust data storage with custom labeling logic
- **Auth**: Secure user management via Supabase Auth

## Deployment

1. **Initialize Supabase**:
   ```sh
   npx supabase start
   ```

2. **Push Database Schema**:
   ```sh
   npx supabase db push
   ```

3. **Deploy Functions**:
   ```sh
   npx supabase functions deploy
   ```