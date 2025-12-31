## Poké Pilot

A simple full‑stack Pokémon team builder built with Next.js (TypeScript), PostgreSQL, and the PokeAPI.

This project is intentionally minimal right now. The goal is to prove core functionality (API calls, database writes, basic auth) before adding features.

## Tech Stack

Frontend: Next.js (App Router) + React + TypeScript

Backend: Next.js API routes

Database: PostgreSQL

External API: PokeAPI (read‑only)

## Current Features

Fetch Pokémon data from PokeAPI

Display Pokémon sprites

User signup (hashed passwords)

User login (credential verification)

PostgreSQL schema for users, teams, and team Pokémon

No sessions or persistent auth yet — login is currently stateless by design.

## Setup
1. Install dependencies
npm install

2. Environment variables

Create a .env.local file:

DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE

3. Database

Ensure PostgreSQL is running and the following tables exist:

users
teams
team_pokemon

## Running the app

npm run dev

Visit:

http://localhost:3000/