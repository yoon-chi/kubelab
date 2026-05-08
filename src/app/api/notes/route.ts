import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const resource = searchParams.get("resource") || "";

    let query = "SELECT * FROM notes";
    const params: string[] = [];

    if (resource) {
      query += " WHERE resource = ?";
      params.push(resource);
    }

    query += " ORDER BY resource ASC, updated_at DESC";

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET /api/notes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resource, title, content } = body;

    if (!resource || typeof resource !== "string" || resource.trim().length === 0) {
      return NextResponse.json({ error: "Resource is required" }, { status: 400 });
    }
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const cleanResource = resource.trim().slice(0, 64);
    const cleanTitle = title.trim().slice(0, 255);

    const [result] = await pool.execute(
      "INSERT INTO notes (resource, title, content) VALUES (?, ?, ?)",
      [cleanResource, cleanTitle, content.trim()]
    );

    const insertResult = result as { insertId: number };

    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM notes WHERE id = ?",
      [insertResult.insertId]
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error("POST /api/notes error:", error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}
