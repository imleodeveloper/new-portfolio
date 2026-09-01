import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { validateLeadPayload, normalizeCompanyName } from "@/lib/validate-lead";
import type { RowDataPacket } from "mysql2";

// ─── Rate limiting ────────────────────────────────────────────────────────────
const rateMap = new Map<string, { count: number; reset: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + 15 * 60 * 1000 });
    return false;
  }
  if (entry.count >= 5) return true;
  entry.count++;
  return false;
}

function getIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "anon"
  );
}

// ─── POST /api/leads ──────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Rate limit: 5 envios por IP a cada 15 minutos
  if (isRateLimited(getIP(req))) {
    return NextResponse.json(
      { success: false, errors: { _rate: "Limite de envios atingido. Aguarde 15 minutos." } },
      { status: 429 }
    );
  }

  // Parse do body com limite implícito do Next.js (~4 MB, mais que suficiente)
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, errors: { _body: "Requisição inválida." } },
      { status: 400 }
    );
  }

  // Validação de entrada
  const { ok, errors, cleaned } = validateLeadPayload(body);
  if (!ok || !cleaned) {
    return NextResponse.json({ success: false, errors }, { status: 422 });
  }

  const pool = getPool();
  const conn = await pool.getConnection();

  try {
    // ── Verificar telefone duplicado ────────────────────────────────────────
    const [phoneRows] = await conn.execute<RowDataPacket[]>(
      "SELECT id FROM leads WHERE telefone = ? LIMIT 1",
      [cleaned.telefone]
    );
    if (phoneRows.length > 0) {
      return NextResponse.json(
        { success: false, errors: { telefone: "Este número já está registrado. Entraremos em contato em breve." } },
        { status: 409 }
      );
    }

    // ── Verificar empresa duplicada (normalizada) ───────────────────────────
    if (cleaned.companyName) {
      const normalized = normalizeCompanyName(cleaned.companyName);
      const [compRows] = await conn.execute<RowDataPacket[]>(
        `SELECT id FROM leads
         WHERE company_name IS NOT NULL
           AND LOWER(REPLACE(company_name, ' ', '')) = ?
         LIMIT 1`,
        [normalized]
      );
      if (compRows.length > 0) {
        return NextResponse.json(
          { success: false, errors: { companyName: "Esta empresa já possui um contato registrado." } },
          { status: 409 }
        );
      }
    }

    // ── Inserir lead (id gerado pelo MySQL com DEFAULT (UUID())) ───────────
    const briefingJson = Object.keys(cleaned.briefingAnswers).length > 0
      ? JSON.stringify(cleaned.briefingAnswers)
      : null;

    await conn.execute(
      `INSERT INTO leads
         (nome, telefone, contact_preference, service_type,
          company_name, company_services, briefing_answers, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(3))`,
      [
        cleaned.nome,
        cleaned.telefone,
        cleaned.contactPreference,
        cleaned.serviceType,
        cleaned.companyName     ?? null,
        cleaned.companyServices ?? null,
        briefingJson,
      ]
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    // Log interno — nunca expor detalhes ao cliente
    console.error("[api/leads] Erro ao salvar lead:", err);
    return NextResponse.json(
      { success: false, errors: { _server: "Erro interno. Tente novamente." } },
      { status: 500 }
    );
  } finally {
    conn.release();
  }
}
