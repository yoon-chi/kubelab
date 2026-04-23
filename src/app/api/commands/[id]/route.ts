import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numId = Number(id);
    if (isNaN(numId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await req.json();
    const { title, command, description, tags } = body;

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!command || typeof command !== "string" || command.trim().length === 0) {
      return NextResponse.json({ error: "Command is required" }, { status: 400 });
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

    const [result] = await pool.execute<ResultSetHeader>(
      "UPDATE commands SET title = ?, command = ?, description = ?, tags = ? WHERE id = ?",
      [title.trim(), command.trim(), (description || "").trim(), JSON.stringify(cleanTags), numId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Command not found" }, { status: 404 });
    }

    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM commands WHERE id = ?",
      [numId]
    );

    const updated = {
      ...rows[0],
      tags: typeof rows[0].tags === "string" ? JSON.parse(rows[0].tags) : rows[0].tags,
    };

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/commands/[id] error:", error);
    return NextResponse.json({ error: "Failed to update command" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numId = Number(id);
    if (isNaN(numId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const [result] = await pool.execute<ResultSetHeader>(
      "DELETE FROM commands WHERE id = ?",
      [numId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Command not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/commands/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete command" }, { status: 500 });
  }
}
