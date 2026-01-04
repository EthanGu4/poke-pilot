"use server";

import pool from "@/lib/db";
import { getAuth } from "@/lib/auth";

export async function getAllTeams() {
    const res = await pool.query(`
        SELECT id, owner_id, name, is_public, created_at
        FROM teams
        WHERE is_public = true;
    `);
    return res.rows;
}

export async function getPokemonTeamFromTeamId(teamId: string) {
    const res = await pool.query(`
        SELECT id, team_id, pokemon_id, slot
        FROM team_pokemon
        WHERE team_id = $1
        `,
        [teamId]
    );
    return res.rows;
}

export async function getTeamsFromUserId(userId: string) {
    const res = await pool.query(`
        SELECT id, owner_id, name, is_public, created_at
        FROM teams
        WHERE owner_id = $1
        `,
        [userId]
    );
    return res.rows
}

export async function getEligibleTeamsFromUserId(userId: string) {
    const res = await pool.query(`
        SELECT
            t.id,
            t.name,
            COUNT(tp.id)::int AS team_size
        FROM teams t
        LEFT JOIN team_pokemon tp
            ON tp.team_id = t.id
        WHERE t.owner_id = $1
        GROUP BY t.id, t.name
        HAVING COUNT(tp.id) < 6
        ORDER BY t.created_at DESC;
        `,
        [userId]
    );
    return res.rows
}

export async function getOpenSlots(teamId: string) {
    const res = await pool.query(`
        SELECT s.slot
        FROM generate_series(1, 6) AS s(slot)
        LEFT JOIN team_pokemon tp
            ON tp.team_id = $1
            AND tp.slot = s.slot
        WHERE tp.id IS NULL
        ORDER BY s.slot
        `,
        [teamId]
    );
    return res.rows;
}

export async function createNewUntitledTeam(userId: string) {
    const res = await pool.query(`
        INSERT INTO teams (owner_id, name, is_public)
        VALUES ($1::uuid, 'Untitled Team', false)
        RETURNING id
        `,
        [userId]
    );
    return res.rows;
}

export async function deleteTeam(teamId: string) {
    const user = await getAuth();

    if (!user) {
        throw new Error("Unauthorized");
    }
    
    await pool.query(`
        DELETE FROM teams
        WHERE id = $1
            AND owner_id = $2
        `,
        [teamId, user.userId]
    );
}

export async function getTeamFromTeamId(teamId: string, userId: string) {
    const res = await pool.query(`
        SELECT id, owner_id, name, is_public, created_at
        FROM teams
        WHERE id = $1
            AND owner_id = $2
        `,
        [teamId, userId]
    );
    return res.rows[0];
}

export async function updateTeamName(name: string, teamId: string) {
    const user = await getAuth();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const res = await pool.query(`
        UPDATE teams
        SET name = $1
        WHERE id = $2
            AND owner_id = $3
        `,
        [name, teamId, user.userId]
    );

    if (res.rowCount === 0) {
        throw new Error("Team not found or not owned");
    }
}

export async function addPokemonToTeam(pokemonId: string, teamId: string, slotNumber: number) {
    await pool.query(`
        INSERT INTO team_pokemon (team_id, pokemon_id, slot)
        VALUES ($1::uuid, $2, $3::int)
        `,
        [teamId, pokemonId, slotNumber]
    );
}

export async function deletePokemonFromTeam(teamId: string, slotNumber: number) {
    await pool.query(`
        DELETE FROM team_pokemon
        WHERE team_id = $1
            AND slot = $2
        `,
        [teamId, slotNumber]
    );
}