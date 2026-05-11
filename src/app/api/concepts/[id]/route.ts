import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { isKubernetesConcept } from "@/lib/types";

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

    const [result] = await pool.execute<ResultSetHeader>(
      "UPDATE concepts SET category = ?, title = ?, content = ? WHERE id = ?",
      [category, cleanTitle, content.trim(), numId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Concept not found" }, { status: 404 });
    }

    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM concepts WHERE id = ?",
      [numId]
    );

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("PUT /api/concepts/[id] error:", error);
    return NextResponse.json({ error: "Failed to update concept" }, { status: 500 });
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
      "DELETE FROM concepts WHERE id = ?",
      [numId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Concept not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/concepts/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete concept" }, { status: 500 });
  }
}
