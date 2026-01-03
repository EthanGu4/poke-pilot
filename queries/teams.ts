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

export async function getSpecificTeamFromId(teamId: string) {
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

export async function createNewUntitledTeam(userId: string) {
    const res = await pool.query(`
        INSERT INTO teams (owner_id, name, is_public)
        VALUES ($1::uuid, 'stealth', false)
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