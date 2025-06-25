import { useEffect, useState } from "react";
import axios from "axios";

export default function VerifyEmail() {
  const [message, setMessage] = useState("Verifikacija u toku...");
  const [error, setError] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setMessage("Token nije prosleđen.");
      setError(true);
      return;
    }

    axios
      .get(`http://localhost:5000/api/users/verify-email?token=${token}`)
      .then(() => {
        setMessage("Email je uspešno verifikovan! Možete se prijaviti.");
      })
      .catch(() => {
        setMessage("Nevažeći ili istekao token.");
        setError(true);
      });
  }, []);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Verifikacija email-a</h2>
      <p style={{ color: error ? "red" : "green" }}>{message}</p>
    </div>
  );
}
