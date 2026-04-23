import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT tags FROM commands");

    const tagSet = new Set<string>();
    for (const row of rows) {
      const tags = typeof row.tags === "string" ? JSON.parse(row.tags) : row.tags;
      if (Array.isArray(tags)) {
        tags.forEach((t: string) => tagSet.add(t));
      }
    }

    const sorted = [...tagSet].sort();
    return NextResponse.json(sorted);
  } catch (error) {
    console.error("GET /api/tags error:", error);
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 });
  }
}
