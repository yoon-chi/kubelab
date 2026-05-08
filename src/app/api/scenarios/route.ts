import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

const VALID_EXAMS = new Set(["cka", "ckad"]);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const exam = searchParams.get("exam") || "";
    const chapter = searchParams.get("chapter") || "";

    let query = "SELECT * FROM scenarios";
    const conditions: string[] = [];
    const params: string[] = [];

    if (exam) {
      if (!VALID_EXAMS.has(exam)) {
        return NextResponse.json({ error: "Invalid exam" }, { status: 400 });
      }
      conditions.push("exam = ?");
      params.push(exam);
    }

    if (chapter) {
      conditions.push("chapter = ?");
      params.push(chapter);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY chapter ASC, updated_at DESC";

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET /api/scenarios error:", error);
    return NextResponse.json(
      { error: "Failed to fetch scenarios" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
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

    const [result] = await pool.execute(
      "INSERT INTO scenarios (exam, question, answer, chapter) VALUES (?, ?, ?, ?)",
      [exam, question.trim(), answer.trim(), cleanChapter]
    );

    const insertResult = result as { insertId: number };

    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM scenarios WHERE id = ?",
      [insertResult.insertId]
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error("POST /api/scenarios error:", error);
    return NextResponse.json(
      { error: "Failed to create scenario" },
      { status: 500 }
    );
  }
}
