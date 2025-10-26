import { useEffect, useState, useRef } from "react";
import { getTickets } from "./api";
import TicketsOdoo from "./components/TicketsOdoo";
import "./App.css";

export default function App() {
  const [email, setEmail] = useState("");           // definido pelo Chatwoot ou manual
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const loadedOnce = useRef(false);

  // prioridade: Abertos > Solved > Cancelled. Dentro do mesmo status: mais novo primeiro.
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

  // Integração Chatwoot Dashboard Apps
  useEffect(() => {
    if (loadedOnce.current) return;
    loadedOnce.current = true;

    const onMsg = (event) => {
      // Aceita apenas mensagens do Chatwoot
      // Em produção, se quiser, restrinja por origin com uma whitelist.
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
      } catch {
        // mensagens que não são JSON podem ser ignoradas
      }
    };

    window.addEventListener("message", onMsg);
    // sinaliza que a app está pronta
    try { window.parent?.postMessage(JSON.stringify({ type: "READY" }), "*"); } catch {}

    return () => window.removeEventListener("message", onMsg);
  }, []);

  // Campo manual para testes fora do Chatwoot
  return (
    <div className="container">
      <h2>Tickets do Cliente</h2>

      <div className="toolbar">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e-mail do cliente"
        />
        <button onClick={() => carregar(email)}>Buscar</button>
      </div>

      {loading && <p>Carregando…</p>}
      {!loading && !tickets.length && email && <p>Sem tickets para {email}.</p>}
      {!loading && !email && <p>Informe um e-mail ou abra dentro do Chatwoot.</p>}

      {!loading && tickets.length > 0 && <TicketsOdoo tickets={tickets} />}
    </div>
  );
}
