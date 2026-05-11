import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { isKubernetesConcept } from "@/lib/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || "";

    let query = "SELECT * FROM concepts";
    const params: string[] = [];

    if (category) {
      query += " WHERE category = ?";
      params.push(category);
    }

    query += " ORDER BY category ASC, updated_at DESC";

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET /api/concepts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch concepts" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category, title, content } = body;

    if (!isKubernetesConcept(category)) {
      return NextResponse.json(
        { error: "Category must be a known Kubernetes concept" },
        { status: 400 }
      );
    }
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const cleanTitle = title.trim().slice(0, 255);

    const [result] = await pool.execute(
      "INSERT INTO concepts (category, title, content) VALUES (?, ?, ?)",
      [category, cleanTitle, content.trim()]
    );

    const insertResult = result as { insertId: number };

    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM concepts WHERE id = ?",
      [insertResult.insertId]
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error("POST /api/concepts error:", error);
    return NextResponse.json(
      { error: "Failed to create concept" },
      { status: 500 }
    );
  }
}
