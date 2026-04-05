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
  Tile,
  Heading,
} from "@carbon/react";
import { Login, Fire } from "@carbon/icons-react";
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
    <div style={{ width: "100%", maxWidth: "440px", padding: "0 1rem" }}>
      <Tile style={{ padding: "3rem 2.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "var(--cds-support-error)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 0.75rem",
            }}
          >
            <Fire size={36} style={{ color: "#fff" }} />
          </div>
          <Heading style={{ fontSize: "1.75rem", fontWeight: 700 }}>Firedrive</Heading>
          <p style={{ color: "var(--cds-text-secondary)", marginTop: "0.5rem", fontSize: "0.875rem" }}>
            Fire / Public Safety Management System
          </p>
          <p style={{ color: "var(--cds-text-helper)", fontSize: "0.75rem", marginTop: "0.25rem" }}>
            MFES – Maharashtra Fire &amp; Emergency Services
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
          <Stack gap={5}>
            <TextInput
              id="email"
              labelText="Email Address"
              type="email"
              placeholder="superadmin@firedrive.gov.in"
              invalid={!!errors.email}
              invalidText={errors.email?.message}
              {...register("email")}
            />
            <PasswordInput
              id="password"
              labelText="Password"
              placeholder="Enter your password"
              invalid={!!errors.password}
              invalidText={errors.password?.message}
              {...register("password")}
            />
            <Button
              type="submit"
              renderIcon={Login}
              disabled={loading}
              style={{ width: "100%", maxWidth: "100%" }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </Stack>
        </Form>

        <p style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.75rem", color: "var(--cds-text-helper)" }}>
          Super Admin: superadmin@firedrive.gov.in / Fire@Admin#2026
        </p>
      </Tile>
    </div>
  );
}
