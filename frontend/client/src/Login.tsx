import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        { email, lozinka },
        { withCredentials: true }
      );

      const { token, user } = res.data;

      // ✅ Spasi token i userId u localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.id);

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Greška pri logovanju");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          border: "1px solid #ccc",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Prijava</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              marginBottom: "1rem",
              width: "100%",
              padding: "0.5rem",
              boxSizing: "border-box",
            }}
          />
          <input
            type="password"
            placeholder="Lozinka"
            value={lozinka}
            onChange={(e) => setLozinka(e.target.value)}
            required
            style={{
              marginBottom: "1rem",
              width: "100%",
              padding: "0.5rem",
              boxSizing: "border-box",
            }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.5rem",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Prijavi se
          </button>
        </form>

        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          Nemate nalog? <Link to="/register">Registrujte se</Link>
        </p>

        {error && (
          <p style={{ color: "red", marginTop: "1rem", textAlign: "center" }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
