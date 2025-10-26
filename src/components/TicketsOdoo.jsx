export default function TicketsOdoo({ tickets }) {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Título</th>
          <th>Status</th>
          <th>Criado em</th>
          <th>Cliente</th>
        </tr>
      </thead>
      <tbody>
        {tickets.map(t => (
          <tr key={t.id}>
            <td>{t.id}</td>
            <td>{t.titulo}</td>
            <td>{t.status}</td>
            <td>{t.criado_em}</td>
            <td>{t.cliente}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
