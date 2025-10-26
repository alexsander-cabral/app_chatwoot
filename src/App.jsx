import { useEffect, useState, useRef } from "react";
import { getTickets } from "./api";
import TicketsOdoo from "./components/TicketsOdoo";
import "./App.css";

export default function App() {
  const [email, setEmail] = useState("");
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const loadedOnce = useRef(false);

  const ordenar = (lista) => {
    const rank = { New: 1, "Em andamento": 1, Open: 1, Solved: 2, Cancelled: 3 };
    return [...lista].sort((a, b) => {
      const ra = rank[a.status] ?? 99;
      const rb = rank[b.status] ?? 99;
      if (ra !== rb) return ra - rb;
      return new Date(b.criado_em) - new Date(a.criado_em);
    });
  };

  const carregar = async (mail) => {
    if (!mail) return;
    setLoading(true);
    try {
      const data = await getTickets(mail);
      setTickets(ordenar(data?.tickets || []));
    } catch (e) {
      console.error("Erro ao carregar tickets", e);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loadedOnce.current) return;
    loadedOnce.current = true;

    const onMsg = (event) => {
      try {
        const payload = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        const mail =
          payload?.data?.contact?.email ||
          payload?.contact?.email ||
          payload?.data?.email ||
          null;

        if (mail) {
          setEmail(mail);
          carregar(mail);
        }
      } catch {}
    };

    window.addEventListener("message", onMsg);
    try { window.parent?.postMessage(JSON.stringify({ type: "READY" }), "*"); } catch {}

    return () => window.removeEventListener("message", onMsg);
  }, []);

  return (
    <div className="container">
      <h2>Tickets do Cliente</h2>

      {email && (
        <div className="email-badge">
          <span>{email}</span>
        </div>
      )}

      {loading && <p>Carregando…</p>}
      {!loading && !tickets.length && email && <p>Sem tickets para {email}.</p>}
      {!loading && !email && <p>Aguardando e-mail do Chatwoot…</p>}
      {!loading && tickets.length > 0 && <TicketsOdoo tickets={tickets} />}
    </div>
  );
}
