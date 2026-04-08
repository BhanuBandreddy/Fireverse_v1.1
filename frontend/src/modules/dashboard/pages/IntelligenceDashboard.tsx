import { useState, useEffect, useRef } from "react";
import { Button, Tag, InlineLoading } from "@carbon/react";
import {
  Send,
  Dashboard,
  Warning,
  DocumentSigned,
  Renew,
  Van,
  Package,
  Education,
  Alarm,
  Security,
  UserAvatar,
  Bot,
  ChevronRight,
} from "@carbon/icons-react";
import client from "@/api/client";

// ─── Types ────────────────────────────────────────────────────────────────────

interface KPI {
  label: string;
  value: number;
  unit?: string;
  status: "ok" | "warn" | "critical";
}

interface Alert {
  module: string;
  message: string;
  severity: "info" | "warn" | "critical";
}

interface ChatMessage {
  id: string;
  role: "user" | "ai";
  text: string;
  data?: Record<string, unknown>[];
  chart?: { labels: string[]; values: number[]; type: string };
  module?: string;
  ts: Date;
}

// ─── Suggested questions ──────────────────────────────────────────────────────

const SUGGESTED: { label: string; query: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { label: "Operational status", query: "Give me today's complete operational status across all modules", icon: Dashboard },
  { label: "Critical incidents", query: "Show me all critical and high priority incidents right now", icon: Warning },
  { label: "Pending NOC", query: "How many NOC applications are pending or under review?", icon: DocumentSigned },
  { label: "Vehicles offline", query: "Which vehicles are currently offline or out of service?", icon: Van },
  { label: "Low stock items", query: "Show me equipment items that are low on stock", icon: Package },
  { label: "Upcoming trainings", query: "What trainings and drills are scheduled in the next 30 days?", icon: Education },
  { label: "Open audit findings", query: "List all open critical audit observations", icon: Security },
  { label: "Expiring renewals", query: "Which renewal certificates are expiring soon?", icon: Renew },
  { label: "Monthly incident trend", query: "Show me the incident trend for the last 6 months", icon: Alarm },
  { label: "Compliance summary", query: "Give me a compliance and deviation summary", icon: Security },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_COLOR: Record<string, string> = {
  ok: "var(--cds-support-success)",
  warn: "var(--cds-support-warning)",
  critical: "var(--cds-support-error)",
};

const SEV_COLOR: Record<string, string> = {
  info: "var(--cds-support-info)",
  warn: "var(--cds-support-warning)",
  critical: "var(--cds-support-error)",
};

function uid() {
  return Math.random().toString(36).slice(2);
}

function formatTime(d: Date) {
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

// ─── Mini bar chart (pure CSS, no library) ───────────────────────────────────

function MiniBarChart({ labels, values }: { labels: string[]; values: number[] }) {
  const max = Math.max(...values, 1);
  return (
    <div style={{ marginTop: "0.75rem" }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "60px" }}>
        {values.map((v, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
            <span style={{ fontSize: "0.6rem", color: "var(--cds-text-secondary)", fontWeight: 600 }}>{v}</span>
            <div
              style={{
                width: "100%",
                background: "var(--cds-interactive)",
                borderRadius: "2px 2px 0 0",
                height: `${Math.max(4, (v / max) * 44)}px`,
                transition: "height 0.4s ease",
              }}
            />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
        {labels.map((l, i) => (
          <span key={i} style={{ flex: 1, fontSize: "0.6rem", color: "var(--cds-text-secondary)", textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Data table inside chat bubble ───────────────────────────────────────────

function InlineTable({ rows }: { rows: Record<string, unknown>[] }) {
  if (!rows.length) return null;
  const cols = Object.keys(rows[0]);
  return (
    <div style={{ marginTop: "0.625rem", overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem" }}>
        <thead>
          <tr>
            {cols.map((c) => (
              <th
                key={c}
                style={{
                  padding: "4px 8px",
                  background: "var(--cds-layer-02)",
                  color: "var(--cds-text-secondary)",
                  fontWeight: 600,
                  textAlign: "left",
                  textTransform: "capitalize",
                  borderBottom: "1px solid var(--cds-border-subtle-01)",
                  whiteSpace: "nowrap",
                }}
              >
                {c.replace(/_/g, " ")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 8).map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "var(--cds-layer-01)" }}>
              {cols.map((c) => (
                <td
                  key={c}
                  style={{
                    padding: "4px 8px",
                    color: "var(--cds-text-primary)",
                    borderBottom: "1px solid var(--cds-border-subtle-01)",
                    maxWidth: "200px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {String(row[c] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length > 8 && (
        <p style={{ fontSize: "0.7rem", color: "var(--cds-text-secondary)", marginTop: "4px", textAlign: "right" }}>
          +{rows.length - 8} more rows
        </p>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function IntelligenceDashboard() {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load executive summary on mount
  useEffect(() => {
    setSummaryLoading(true);
    client
      .get<{ data: { kpis: KPI[]; alerts: Alert[] } }>("/intelligence/summary")
      .then((r) => {
        setKpis(r.data.data.kpis);
        setAlerts(r.data.data.alerts);
      })
      .catch(() => {
        setKpis([]);
        setAlerts([]);
      })
      .finally(() => setSummaryLoading(false));

    // Welcome message
    setMessages([
      {
        id: uid(),
        role: "ai",
        text: "Good day. I'm the Firedrive Intelligence Assistant for MFES Maharashtra. I have real-time access to all 10 operational modules. Ask me anything — incidents, NOC status, fleet health, compliance, training, or request a full executive summary.",
        ts: new Date(),
      },
    ]);
  }, []);

  const sendQuery = async (q: string) => {
    const query = q.trim();
    if (!query || loading) return;
    setInput("");

    const userMsg: ChatMessage = { id: uid(), role: "user", text: query, ts: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await client.post<{
        data: { answer: string; data?: Record<string, unknown>[]; chart?: { labels: string[]; values: number[]; type: string }; module: string };
      }>("/intelligence/query", { query });

      const { answer, data, chart, module } = res.data.data;
      setMessages((prev) => [
        ...prev,
        { id: uid(), role: "ai", text: answer, data, chart, module, ts: new Date() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "ai",
          text: "Unable to retrieve data at this moment. Please check the backend connection or try again.",
          ts: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendQuery(input);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: "1400px", margin: "0 auto" }}>

      {/* ── Page header ── */}
      <div style={{ borderBottom: "1px solid var(--cds-border-subtle-01)", paddingBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
          <div
            style={{
              width: "36px", height: "36px", borderRadius: "8px",
              background: "var(--cds-interactive)", display: "flex",
              alignItems: "center", justifyContent: "center",
            }}
          >
            <Bot size={20} style={{ fill: "#ffffff" }} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "var(--cds-text-primary)" }}>
              Intelligence Dashboard
            </h1>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--cds-text-secondary)" }}>
              AI-powered operational command view · Maharashtra Fire &amp; Emergency Services
            </p>
          </div>
        </div>
      </div>

      {/* ── KPI strip ── */}
      {summaryLoading ? (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "1rem" }}>
          <InlineLoading description="Loading executive summary…" />
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "0.75rem" }}>
            {kpis.map((kpi, i) => (
              <div
                key={i}
                style={{
                  background: "var(--cds-layer-01)",
                  border: `1px solid var(--cds-border-subtle-01)`,
                  borderTop: `3px solid ${STATUS_COLOR[kpi.status]}`,
                  borderRadius: "4px",
                  padding: "0.875rem 1rem",
                }}
              >
                <p style={{ margin: 0, fontSize: "0.6875rem", color: "var(--cds-text-secondary)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>
                  {kpi.label}
                </p>
                <p style={{ margin: "0.25rem 0 0", fontSize: "1.75rem", fontWeight: 700, color: STATUS_COLOR[kpi.status], lineHeight: 1 }}>
                  {kpi.value}{kpi.unit ? <span style={{ fontSize: "0.875rem", fontWeight: 400, marginLeft: "2px" }}>{kpi.unit}</span> : null}
                </p>
              </div>
            ))}
          </div>

          {/* Alerts strip */}
          {alerts.length > 0 && (
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {alerts.map((a, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.375rem",
                    padding: "0.375rem 0.75rem",
                    borderRadius: "4px",
                    background: `color-mix(in srgb, ${SEV_COLOR[a.severity]} 12%, transparent)`,
                    border: `1px solid ${SEV_COLOR[a.severity]}`,
                    fontSize: "0.75rem",
                    color: "var(--cds-text-primary)",
                  }}
                >
                  <span style={{ fontWeight: 700, color: SEV_COLOR[a.severity] }}>{a.module}</span>
                  <ChevronRight size={12} style={{ fill: SEV_COLOR[a.severity] }} />
                  {a.message}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Chat + suggestions layout ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "1rem", minHeight: "520px" }}>

        {/* Chat panel */}
        <div
          style={{
            display: "flex", flexDirection: "column",
            background: "var(--cds-layer-01)",
            border: "1px solid var(--cds-border-subtle-01)",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          {/* Chat header */}
          <div
            style={{
              padding: "0.75rem 1rem",
              background: "var(--cds-background-inverse)",
              display: "flex", alignItems: "center", gap: "0.5rem",
            }}
          >
            <Bot size={16} style={{ fill: "var(--cds-icon-inverse)" }} />
            <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--cds-text-inverse)" }}>
              Firedrive Intelligence Assistant
            </span>
            <span style={{ marginLeft: "auto", fontSize: "0.6875rem", color: "var(--cds-text-placeholder)", display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--cds-support-success)", display: "inline-block" }} />
              Live data
            </span>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  flexDirection: msg.role === "user" ? "row-reverse" : "row",
                  gap: "0.5rem",
                  alignItems: "flex-start",
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
                    background: msg.role === "user" ? "var(--cds-interactive)" : "var(--cds-layer-02)",
                    border: "1px solid var(--cds-border-subtle-01)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  {msg.role === "user"
                    ? <UserAvatar size={14} style={{ fill: "#ffffff" }} />
                    : <Bot size={14} style={{ fill: "var(--cds-interactive)" }} />
                  }
                </div>

                {/* Bubble */}
                <div style={{ maxWidth: "78%", display: "flex", flexDirection: "column", gap: "4px", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
                  {msg.module && (
                    <Tag type="blue" size="sm" style={{ alignSelf: "flex-start" }}>{msg.module}</Tag>
                  )}
                  <div
                    style={{
                      padding: "0.625rem 0.875rem",
                      borderRadius: msg.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                      background: msg.role === "user" ? "var(--cds-interactive)" : "var(--cds-layer-02)",
                      border: msg.role === "ai" ? "1px solid var(--cds-border-subtle-01)" : "none",
                      fontSize: "0.8125rem",
                      lineHeight: 1.5,
                      color: msg.role === "user" ? "#ffffff" : "var(--cds-text-primary)",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {msg.text}
                    {msg.data && msg.data.length > 0 && <InlineTable rows={msg.data} />}
                    {msg.chart && <MiniBarChart labels={msg.chart.labels} values={msg.chart.values} />}
                  </div>
                  <span style={{ fontSize: "0.625rem", color: "var(--cds-text-secondary)" }}>
                    {formatTime(msg.ts)}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--cds-layer-02)", border: "1px solid var(--cds-border-subtle-01)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Bot size={14} style={{ fill: "var(--cds-interactive)" }} />
                </div>
                <InlineLoading description="Querying live data…" style={{ fontSize: "0.8125rem" }} />
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input row */}
          <div
            style={{
              padding: "0.75rem 1rem",
              borderTop: "1px solid var(--cds-border-subtle-01)",
              display: "flex", gap: "0.5rem", alignItems: "center",
              background: "var(--cds-layer-01)",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about operations, incidents, fleet, compliance…"
              disabled={loading}
              style={{
                flex: 1,
                padding: "0.5rem 0.75rem",
                background: "var(--cds-field-01)",
                border: "1px solid var(--cds-border-strong-01)",
                borderRadius: "4px",
                fontSize: "0.8125rem",
                color: "var(--cds-text-primary)",
                outline: "none",
              }}
            />
            <Button
              renderIcon={Send}
              iconDescription="Send"
              hasIconOnly
              size="md"
              onClick={() => sendQuery(input)}
              disabled={loading || !input.trim()}
            />
          </div>
        </div>

        {/* Suggested questions sidebar */}
        <div
          style={{
            background: "var(--cds-layer-01)",
            border: "1px solid var(--cds-border-subtle-01)",
            borderRadius: "4px",
            overflow: "hidden",
            display: "flex", flexDirection: "column",
          }}
        >
          <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--cds-border-subtle-01)" }}>
            <p style={{ margin: 0, fontSize: "0.75rem", fontWeight: 700, color: "var(--cds-text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Quick Questions
            </p>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "0.5rem" }}>
            {SUGGESTED.map((s, i) => {
              const Icon = s.icon;
              return (
                <button
                  key={i}
                  onClick={() => sendQuery(s.query)}
                  disabled={loading}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.625rem",
                    padding: "0.625rem 0.75rem",
                    background: "transparent",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    textAlign: "left",
                    marginBottom: "2px",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--cds-layer-hover-01)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <span style={{ display: "flex", flexShrink: 0, fill: "var(--cds-interactive)", color: "var(--cds-interactive)" }}>
                    <Icon size={16} />
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "var(--cds-text-primary)", lineHeight: 1.3 }}>
                    {s.label}
                  </span>
                  <ChevronRight size={14} style={{ fill: "var(--cds-icon-secondary)", marginLeft: "auto", flexShrink: 0 }} />
                </button>
              );
            })}
          </div>
          <div style={{ padding: "0.75rem", borderTop: "1px solid var(--cds-border-subtle-01)", fontSize: "0.6875rem", color: "var(--cds-text-secondary)", lineHeight: 1.4 }}>
            Queries run against live PostgreSQL database. All data is real.
          </div>
        </div>
      </div>
    </div>
  );
}
