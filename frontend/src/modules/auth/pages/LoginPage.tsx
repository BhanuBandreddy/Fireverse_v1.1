import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  Stack,
  TextInput,
  PasswordInput,
  Button,
  InlineNotification,
} from "@carbon/react";
import { Login } from "@carbon/icons-react";
import client from "@/api/client";
import { useAuthStore } from "@/store/auth.store";

const schema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(1, "Password required"),
});
type FormData = z.infer<typeof schema>;

interface LoginResponse {
  data: {
    user: {
      id: string;
      email: string;
      username: string;
      firstName: string;
      lastName: string;
      roles: string[];
      permissions: string[];
    };
    accessToken: string;
    refreshToken: string;
  };
}

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError("");
    try {
      const res = await client.post<LoginResponse>("/auth/login", data);
      const { user, accessToken, refreshToken } = res.data.data;
      setAuth(user, accessToken, refreshToken);
      navigate("/dashboard");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message ?? "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100vw" }}>

      {/* ── LEFT PANEL ── */}
      <div
        style={{
          flex: "0 0 58%",
          background: "linear-gradient(160deg, #0d0000 0%, #1f0505 35%, #2a0a00 65%, #0a0a0a 100%)",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          padding: "3rem",
        }}
      >
        {/* Radial fire glow */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "600px",
            height: "600px",
            background: "radial-gradient(ellipse, rgba(220,50,0,0.18) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        {/* Bottom ember glow */}
        <div
          style={{
            position: "absolute",
            bottom: "-60px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "700px",
            height: "260px",
            background: "radial-gradient(ellipse, rgba(255,90,0,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: "440px" }}>

          {/* Emblem ring */}
          <div
            style={{
              width: "96px",
              height: "96px",
              borderRadius: "50%",
              border: "2px solid rgba(220,60,0,0.6)",
              background: "rgba(180,30,0,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 2rem",
              boxShadow: "0 0 40px rgba(220,60,0,0.25), inset 0 0 20px rgba(220,60,0,0.08)",
            }}
          >
            {/* Flame SVG */}
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C12 2 7 7 7 12.5C7 15.5 9 18 12 18C15 18 17 15.5 17 12.5C17 10 15 8 15 8C15 8 14.5 10.5 13 11C13 11 14 9 12 6C12 6 11 9 9.5 10C9.5 10 10 7 12 2Z"
                fill="url(#fireGrad)"
              />
              <path
                d="M12 18C10.5 18 9.5 16.5 9.5 15C9.5 13.5 10.5 12.5 12 12.5C13.5 12.5 14.5 13.5 14.5 15C14.5 16.5 13.5 18 12 18Z"
                fill="rgba(255,200,80,0.9)"
              />
              <defs>
                <linearGradient id="fireGrad" x1="12" y1="2" x2="12" y2="18" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ff6b00" />
                  <stop offset="100%" stopColor="#e63200" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <p
            style={{
              color: "rgba(220,60,0,0.85)",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              marginBottom: "0.75rem",
            }}
          >
            Government of Maharashtra
          </p>

          <h1
            style={{
              color: "#ffffff",
              fontSize: "2.6rem",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: "0.5rem",
            }}
          >
            Firedrive
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: "1rem",
              fontWeight: 400,
              marginBottom: "0.4rem",
            }}
          >
            Fire &amp; Public Safety Management System
          </p>

          <p
            style={{
              color: "rgba(220,80,0,0.7)",
              fontSize: "0.78rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            MFES — Maharashtra Fire &amp; Emergency Services
          </p>

          {/* Divider */}
          <div
            style={{
              width: "48px",
              height: "2px",
              background: "linear-gradient(90deg, transparent, rgba(220,60,0,0.7), transparent)",
              margin: "2rem auto",
            }}
          />

          {/* Stat pills */}
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { value: "36", label: "Districts" },
              { value: "248+", label: "Stations" },
              { value: "24/7", label: "Operations" },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  padding: "0.5rem 1.1rem",
                  borderRadius: "4px",
                  border: "1px solid rgba(220,60,0,0.2)",
                  background: "rgba(220,60,0,0.07)",
                  textAlign: "center",
                }}
              >
                <p style={{ color: "#ff6b35", fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>{s.value}</p>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <p
          style={{
            position: "absolute",
            bottom: "1.5rem",
            color: "rgba(255,255,255,0.2)",
            fontSize: "0.7rem",
            letterSpacing: "0.06em",
          }}
        >
          AUTHORISED PERSONNEL ONLY · RESTRICTED SYSTEM
        </p>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div
        style={{
          flex: 1,
          background: "#0f0f0f",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem 2.5rem",
        }}
        data-carbon-theme="g100"
      >
        <div style={{ width: "100%", maxWidth: "360px" }}>

          <div style={{ marginBottom: "2.5rem" }}>
            <h2
              style={{
                color: "#ffffff",
                fontSize: "1.6rem",
                fontWeight: 700,
                marginBottom: "0.4rem",
              }}
            >
              Sign In
            </h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.875rem" }}>
              Access the Firedrive operations portal
            </p>
          </div>

          {error && (
            <InlineNotification
              kind="error"
              title="Login Failed"
              subtitle={error}
              style={{ marginBottom: "1.5rem" }}
              lowContrast
            />
          )}

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap={6}>
              <div>
                <label
                  style={{
                    display: "block",
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    marginBottom: "0.5rem",
                  }}
                >
                  Email Address
                </label>
                <TextInput
                  id="email"
                  labelText=""
                  type="email"
                  placeholder="superadmin@firedrive.gov.in"
                  invalid={!!errors.email}
                  invalidText={errors.email?.message}
                  style={{
                    background: "#1a1a1a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#fff",
                    borderRadius: "4px",
                  }}
                  {...register("email")}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    marginBottom: "0.5rem",
                  }}
                >
                  Password
                </label>
                <PasswordInput
                  id="password"
                  labelText=""
                  placeholder="Enter your password"
                  invalid={!!errors.password}
                  invalidText={errors.password?.message}
                  style={{
                    background: "#1a1a1a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#fff",
                    borderRadius: "4px",
                  }}
                  {...register("password")}
                />
              </div>

              <Button
                type="submit"
                renderIcon={Login}
                disabled={loading}
                style={{
                  width: "100%",
                  maxWidth: "100%",
                  background: loading ? "#5a1a00" : "linear-gradient(90deg, #c62a00, #e63200)",
                  border: "none",
                  borderRadius: "4px",
                  justifyContent: "space-between",
                  paddingRight: "1rem",
                }}
              >
                {loading ? "Authenticating…" : "Sign In"}
              </Button>
            </Stack>
          </Form>

          <div
            style={{
              marginTop: "2.5rem",
              padding: "1rem",
              borderRadius: "4px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.4rem" }}>
              Demo Credentials
            </p>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.78rem", margin: 0 }}>
              superadmin@firedrive.gov.in
            </p>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.78rem", margin: 0 }}>
              Fire@Admin#2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
