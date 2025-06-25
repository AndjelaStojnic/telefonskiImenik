interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh"
    }}>
      <h2>Uspješno ste ulogovani!</h2>
      <button onClick={onLogout} style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}>
        Logout
      </button>
    </div>
  );
}
