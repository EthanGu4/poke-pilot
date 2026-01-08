## Poké Pilot

A simple full‑stack Pokémon team builder built with Next.js (TypeScript), PostgreSQL, and the public PokeAPI.

## Tech Stack

* Frontend: Next.js (App Router) + React + TypeScript

* Backend: Next.js API routes

* Database: PostgreSQL

* External API: PokeAPI (read‑only)

## Frontend

* Uses Server Components for data fetching and page rendering

* Uses Client Components only where interactivity is needed (editing, deleting, modals)

* Styled with Tailwind CSS, aiming for a cozy, game-like UI rather than a polished SaaS look

* The frontend talks to internal API routes for team data and the PokéAPI for Pokémon metadata

## Backend

* The backend uses PostgreSQL to store user and team data.

* Why PostgreSQL?

  1. Strong relational guarantees

  2. Easy to model team → Pokémon relationships

  3. Works well with SQL queries for filtering (e.g. completed teams only)

* Queries are written explicitly (no heavy ORM magic), making the data flow easy to reason about.

## Features

* Fetch Pokémon data from PokeAPI

* Display Pokémon sprites

* User signup (hashed passwords)

* User login (credential verification)

* PostgreSQL schema for users, teams, and team Pokémon

* Team Builder feature, allowing users to create and manager their custom teams

JWT auth

## Setup
1. Install dependencies
npm install

2. Environment variables

Create a .env.local file:

DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE

3. Database

Ensure PostgreSQL is running and the following tables exist:

users - authenticated users
teams - team metadata (name, owner, visibility)
team_pokemon - join table mapping Pokémon to teams and slots

## Running the app

npm run dev

Visit:

http://localhost:3000/

## <img src="https://github.com/user-attachments/assets/1d3f7504-51f0-4748-a59a-d7a408da43d6" alt="pokeball-gif" width=30 height=30> Preview

* Home Page
<img width="1919" height="996" alt="image" src="https://github.com/user-attachments/assets/1e7eb115-1708-4601-9a96-7688c8f04f8d" />
<br><br><br>

* Registration
<img width="1919" height="987" alt="image" src="https://github.com/user-attachments/assets/2404d644-4eef-4a80-ac24-bead61ce6e68" />
<br><br><br>

* Dashboard (User vs Guest)
<img width="1919" height="1001" alt="image" src="https://github.com/user-attachments/assets/0bf997c0-23a7-42f3-aa6f-d48b61a18382" />
<br>
<img width="1919" height="998" alt="image" src="https://github.com/user-attachments/assets/9ea75736-e574-41ee-abdd-3ea661ababd8" />
<br><br><br>

* Catalog/Pokédex
<img width="1895" height="994" alt="image" src="https://github.com/user-attachments/assets/51d43814-6a5b-4467-9367-e43170dfd33a" />
<br><br><br>

* Pokémon Interface
<img width="1227" height="980" alt="image" src="https://github.com/user-attachments/assets/e5b85735-9c55-412a-940a-5e3a417d7392" />
<br><br><br>

* Teams
<img width="1898" height="995" alt="image" src="https://github.com/user-attachments/assets/0547a1a2-c828-49fc-b1a5-257adfce9a7e" />
<br>
<img width="1894" height="985" alt="image" src="https://github.com/user-attachments/assets/dcab570f-40c7-42eb-9781-e8852088f399" />
<br>
<img width="1317" height="544" alt="image" src="https://github.com/user-attachments/assets/8f2a755c-9218-43a0-b44c-308129fdd07b" />


## Next Steps

* Link to supabase for public access

* Need to create supabase client and change queries to use supabase rather than pool


⬜⬜⬜⬜⬜⬛⬛⬛⬛⬜⬜⬜⬜⬜<br>
⬜⬜⬜⬛⬛🟥🟥🟥🟥🟥⬛⬜⬜⬜<br>
⬜⬜⬛🟥🟥🟥🟥🟥🟥🟥🟥⬛⬜⬜<br>
⬜⬛🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥⬛⬜<br>
⬜⬛🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥⬛⬜<br>
⬛🟥🟥🟥🟥🟥⬛⬛🟥🟥🟥🟥🟥⬛<br>
⬛🟥🟥🟥🟥⬛⬜⬜⬛🟥🟥🟥🟥⬛<br>
⬛⬛⬛⬛⬛⬛⬜⬜⬛⬛⬛⬛⬛⬛<br>
⬛⬜⬜⬜⬜⬜⬛⬛⬜⬜⬜⬜⬜⬛<br>
⬜⬛⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬛⬜<br>
⬜⬛⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬛⬜<br>
⬜⬜⬛⬜⬜⬜⬜⬜⬜⬜⬜⬛⬜⬜<br>
⬜⬜⬜⬛⬛⬜⬜⬜⬜⬛⬛⬜⬜⬜<br>
⬜⬜⬜⬜⬜⬛⬛⬛⬛⬜⬜⬜⬜⬜ 
