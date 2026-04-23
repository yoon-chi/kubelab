import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const tag = searchParams.get("tag") || "";

    let query = "SELECT * FROM commands";
    const conditions: string[] = [];
    const params: string[] = [];

    if (search) {
      conditions.push("(title LIKE ? OR command LIKE ? OR description LIKE ?)");
      const like = `%${search}%`;
      params.push(like, like, like);
    }

    if (tag) {
      conditions.push("JSON_CONTAINS(tags, ?)");
      params.push(JSON.stringify(tag));
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY updated_at DESC";

    const [rows] = await pool.query<RowDataPacket[]>(query, params);

    const commands = rows.map((row) => ({
      ...row,
      tags: typeof row.tags === "string" ? JSON.parse(row.tags) : row.tags,
    }));

    return NextResponse.json(commands);
  } catch (error) {
    console.error("GET /api/commands error:", error);
    return NextResponse.json(
      { error: "Failed to fetch commands" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, command, description, tags } = body;

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }
    if (!command || typeof command !== "string" || command.trim().length === 0) {
      return NextResponse.json(
        { error: "Command is required" },
        { status: 400 }
      );
    }
    if (title.length > 255) {
      return NextResponse.json(
        { error: "Title must be 255 characters or less" },
        { status: 400 }
      );
    }

    const cleanTags = Array.isArray(tags)
      ? [...new Set(tags.map((t: string) => t.trim().toLowerCase()).filter(Boolean))]
      : [];

    const [result] = await pool.execute(
      "INSERT INTO commands (title, command, description, tags) VALUES (?, ?, ?, ?)",
      [title.trim(), command.trim(), (description || "").trim(), JSON.stringify(cleanTags)]
    );

    const insertResult = result as { insertId: number };

    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM commands WHERE id = ?",
      [insertResult.insertId]
    );

    const newCommand = {
      ...rows[0],
      tags: typeof rows[0].tags === "string" ? JSON.parse(rows[0].tags) : rows[0].tags,
    };

    return NextResponse.json(newCommand, { status: 201 });
  } catch (error) {
    console.error("POST /api/commands error:", error);
    return NextResponse.json(
      { error: "Failed to create command" },
      { status: 500 }
    );
  }
}
