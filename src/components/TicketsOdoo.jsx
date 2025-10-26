export default function TicketsOdoo({ tickets }) {
  // Badge de status
  const statusBadge = (status) => {
    const map = {
      Novo: { color: "#0ea5e9", bg: "#e0f2fe" },
      "Em andamento": { color: "#f59e0b", bg: "#fef3c7" },
      Resolvido: { color: "#10b981", bg: "#d1fae5" },
      Cancelado: { color: "#9ca3af", bg: "#f3f4f6" },
    };
    const s = map[status] || { color: "#6b7280", bg: "#f3f4f6" };
    return (
      <span
        style={{
          backgroundColor: s.bg,
          color: s.color,
          borderRadius: "9999px",
          padding: "4px 10px",
          fontSize: "0.8rem",
          fontWeight: 500,
        }}
      >
        {status}
      </span>
    );
  };

  // Gera link para o modo edição no Odoo
  const odooLink = (id) =>
    `https://erp.hubseven.solutions/odoo/all-tickets/${id}?view_type=form`;

  return (
    <table>
      <thead>
        <tr>
          <th>Referência</th>
          <th>Título</th>
          <th>Status</th>
          <th>Criado em</th>
          <th>Cliente</th>
        </tr>
      </thead>
      <tbody>
        {tickets.map((t) => (
          <tr key={t.id}>
            <td>#{t.referencia}</td>
            <td>
              <a
                href={odooLink(t.id)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#1f93ff",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                {t.titulo}
              </a>
            </td>
            <td>{statusBadge(t.status)}</td>
            <td>{t.criado_em}</td>
            <td>{t.cliente}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
