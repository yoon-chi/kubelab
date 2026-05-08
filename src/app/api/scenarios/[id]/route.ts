import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

const VALID_EXAMS = new Set(["cka", "ckad"]);

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
    const { exam, question, answer, chapter } = body;

    if (!exam || !VALID_EXAMS.has(exam)) {
      return NextResponse.json(
        { error: "Valid exam (cka or ckad) is required" },
        { status: 400 }
      );
    }
    if (!question || typeof question !== "string" || question.trim().length === 0) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }
    if (!answer || typeof answer !== "string" || answer.trim().length === 0) {
      return NextResponse.json({ error: "Answer is required" }, { status: 400 });
    }

    const cleanChapter = (chapter || "").toString().trim().slice(0, 100);

    const [result] = await pool.execute<ResultSetHeader>(
      "UPDATE scenarios SET exam = ?, question = ?, answer = ?, chapter = ? WHERE id = ?",
      [exam, question.trim(), answer.trim(), cleanChapter, numId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Scenario not found" }, { status: 404 });
    }

    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM scenarios WHERE id = ?",
      [numId]
    );

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("PUT /api/scenarios/[id] error:", error);
    return NextResponse.json({ error: "Failed to update scenario" }, { status: 500 });
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
      "DELETE FROM scenarios WHERE id = ?",
      [numId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Scenario not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/scenarios/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete scenario" }, { status: 500 });
  }
}
