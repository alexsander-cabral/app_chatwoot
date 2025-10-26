const API_BASE = "https://chatwoot-odoo-backend.onrender.com";

export async function getTickets(email) {
  const res = await fetch(`${API_BASE}/api/tickets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });
  if (!res.ok) return { tickets: [] };
  return res.json();
}
