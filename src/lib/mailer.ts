const BREVO_API = "https://api.brevo.com/v3/smtp/email";

function required(key: string): string {
  const v = process.env[key];
  if (!v) throw new Error(`Variável de ambiente obrigatória ausente: ${key}`);
  return v;
}

export async function sendLeadNotification(payload: Record<string, unknown>): Promise<void> {
  const apiKey      = required("BREVO_API_KEY");
  const senderEmail = required("BREVO_SENDER_EMAIL");
  const senderName  = required("BREVO_SENDER_NAME");

  const json = JSON.stringify(payload, null, 2);

  const serviceLabels: Record<string, string> = {
    "landing-page":      "Landing Page",
    "institutional-site":"Site Institucional",
    "custom-system":     "Sistema Próprio",
    "marketplace":       "Marketplace",
    "freelance":         "Freelance",
    "it-services":       "Serviços de T.I",
    "other":             "Outro",
  };

  const nome      = String(payload.nome ?? "—");
  const telefone  = String(payload.telefone ?? "—");
  const servico   = serviceLabels[String(payload.serviceType ?? "")] ?? String(payload.serviceType ?? "—");
  const preferencia = String(payload.contactPreference ?? "—");

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Novo Lead — Portfolio</title>
  <style>
    body { margin:0; padding:0; background:#0f172a; font-family: 'Helvetica Neue', Arial, sans-serif; color:#e2e8f0; }
    .wrap { max-width:600px; margin:32px auto; background:#1e293b; border-radius:12px; overflow:hidden; }
    .header { background:#16a34a; padding:24px 32px; }
    .header h1 { margin:0; font-size:20px; font-weight:700; color:#fff; letter-spacing:-0.3px; }
    .header p  { margin:4px 0 0; font-size:13px; color:rgba(255,255,255,0.75); }
    .body { padding:28px 32px; }
    .grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:24px; }
    .card { background:#0f172a; border:1px solid #334155; border-radius:8px; padding:14px 16px; }
    .card .label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.8px; color:#64748b; margin-bottom:4px; }
    .card .value { font-size:15px; font-weight:600; color:#f1f5f9; }
    .section-title { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.8px; color:#64748b; margin:0 0 10px; }
    .terminal { background:#020617; border:1px solid #1e3a5f; border-radius:8px; overflow:hidden; }
    .term-bar { display:flex; align-items:center; gap:6px; padding:10px 14px; background:#0f172a; border-bottom:1px solid #1e3a5f; }
    .dot { width:10px; height:10px; border-radius:50%; }
    .term-label { margin-left:8px; font-size:11px; color:#475569; font-family:monospace; }
    pre { margin:0; padding:18px; font-size:12px; line-height:1.7; color:#4ade80; font-family:'Courier New',monospace; overflow-x:auto; white-space:pre-wrap; word-break:break-all; }
    .footer { padding:16px 32px; border-top:1px solid #1e293b; font-size:11px; color:#475569; text-align:center; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <h1>Novo Lead recebido</h1>
      <p>Portfolio — notificação automática de briefing</p>
    </div>
    <div class="body">
      <div class="grid">
        <div class="card">
          <div class="label">Nome</div>
          <div class="value">${nome}</div>
        </div>
        <div class="card">
          <div class="label">Telefone</div>
          <div class="value">${telefone}</div>
        </div>
        <div class="card">
          <div class="label">Serviço</div>
          <div class="value">${servico}</div>
        </div>
        <div class="card">
          <div class="label">Contato preferido</div>
          <div class="value">${preferencia}</div>
        </div>
      </div>
      <p class="section-title">Payload completo — POST /api/leads</p>
      <div class="terminal">
        <div class="term-bar">
          <div class="dot" style="background:#ff5f57"></div>
          <div class="dot" style="background:#febc2e"></div>
          <div class="dot" style="background:#28c840"></div>
          <span class="term-label">application/json</span>
        </div>
        <pre>${json.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</pre>
      </div>
    </div>
    <div class="footer">Enviado automaticamente pelo backend do Portfolio de Leonardo Vieira</div>
  </div>
</body>
</html>`;

  const body = JSON.stringify({
    sender:  { name: senderName, email: senderEmail },
    to:      [{ email: "leovc2011@gmail.com", name: "Leonardo Vieira" }],
    subject: `[Portfolio] Novo lead: ${nome} — ${servico}`,
    htmlContent: html,
  });

  const res = await fetch(BREVO_API, {
    method:  "POST",
    headers: { "api-key": apiKey, "Content-Type": "application/json", Accept: "application/json" },
    body,
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    console.error("[mailer] Brevo erro:", res.status, err);
  }
}
