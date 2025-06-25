import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [ime, setIme] = useState("");
  const [email, setEmail] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await axios.post("http://localhost:5000/api/users", {
        ime,
        email,
        lozinka,
      });

      setMessage("Uspješno ste se registrovali! Provjerite email za potvrdu.");
      setIme("");
      setEmail("");
      setLozinka("");

      setTimeout(() => {
        navigate("/"); // vrati na login
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Greška pri registraciji");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Registracija</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ime"
          value={ime}
          onChange={(e) => setIme(e.target.value)}
          required
          style={{ display: "block", marginBottom: "1rem", padding: "0.5rem" }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: "block", marginBottom: "1rem", padding: "0.5rem" }}
        />
        <input
          type="password"
          placeholder="Lozinka"
          value={lozinka}
          onChange={(e) => setLozinka(e.target.value)}
          required
          style={{ display: "block", marginBottom: "1rem", padding: "0.5rem" }}
        />
        <button type="submit" style={{ marginRight: "1rem" }}>
          Registruj se
        </button>
        <button
          type="button"
          onClick={() => navigate("/")}
          style={{ padding: "0.5rem 1rem" }}
        >
          Otkaži
        </button>
      </form>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
