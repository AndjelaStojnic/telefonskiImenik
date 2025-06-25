import { useEffect, useState } from "react";

interface User {
  id: number;
  ime: string;
  email: string;
}

interface Contact {
  id: number;
  ime: string;
  prezime: string;
  brojTelefona: string;
  email: string;
  omiljeni: boolean;
}

export default function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<"profile" | "search" | "contacts">("profile");
  const [userData, setUserData] = useState({
    ime: "",
    email: "",
    telefon: "",
    adresa: "",
    profilnaSlika: ""
  });
  const [users, setUsers] = useState<User[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newContact, setNewContact] = useState({
    ime: "",
    prezime: "",
    brojTelefona: "",
    email: "",
  });

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!userId || !token) return;

    fetch(`http://localhost:5000/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUserData({
          ime: data.ime,
          email: data.email,
          telefon: data.telefon || "",
          adresa: data.adresa || "",
          profilnaSlika: data.profilnaSlika || ""
        });
      });

    fetch(`http://localhost:5000/api/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data));

    fetch(`http://localhost:5000/api/contacts/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
                        const sorted = data.sort((a: { omiljeni: any; }, b: { omiljeni: any; }) => Number(b.omiljeni) - Number(a.omiljeni));
                        setContacts(sorted);
                      });
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.ime.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !token) return;

    const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    const result = await res.json();
    setMessage(res.ok ? "Profile updated." : result.error || "Update failed.");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile || !userId || !token) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    const res = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      const newImagePath = data.imageUrl;

      const updateRes = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...userData, profilnaSlika: newImagePath }),
      });

      if (updateRes.ok) {
        setUserData((prev) => ({ ...prev, profilnaSlika: newImagePath }));
        setMessage("Image uploaded and saved.");
      } else {
        const error = await updateRes.json();
        setMessage(error?.error || "Image uploaded but not saved.");
      }
    } else {
      setMessage(data.error || "Image upload failed.");
    }
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewContact({ ...newContact, [e.target.name]: e.target.value });
  };

  const handleCreateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...newContact, userId }),
    });
    const data = await res.json();
    if (res.ok) setContacts((prev) => [...prev, data]);
  };

  const handleDeleteContact = async (id: number) => {
    await fetch(`http://localhost:5000/api/contacts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const toggleFavorite = async (contactId: number, current: boolean) => {
    const route = current ? 'unfavorite' : 'favorite';
    await fetch(`http://localhost:5000/api/contacts/${contactId}/${route}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });

    setContacts((prev) =>
      prev
        .map((c) => c.id === contactId ? { ...c, omiljeni: !current } : c)
        .sort((a, b) => Number(b.omiljeni) - Number(a.omiljeni))
    );
  };


  const handleAddUserAsContact = async (user: User) => {
    if (!userId || !token) return;

    const alreadyExists = contacts.some(c => c.email === user.email);
    if (alreadyExists) {
      setMessage("Kontakt već postoji.");
      return;
    }

    const res = await fetch("http://localhost:5000/api/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ime: user.ime,
        email: user.email,
        brojTelefona: "",
        userId,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setContacts((prev) => [...prev, data]);
      setMessage(`Korisnik ${user.ime} dodat u kontakte.`);
    } else {
      setMessage(data.error || "Greška pri dodavanju kontakta.");
    }
  };

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 20px", backgroundColor: "#1976d2", color: "#fff" }}>
        <h2>Welcome, {userData.ime}</h2>
        <button onClick={onLogout} style={{ backgroundColor: "#fff", color: "#1976d2", border: "none", padding: "5px 10px", cursor: "pointer" }}>
          Logout
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <button onClick={() => setActiveTab("profile")} style={{ margin: "0 10px" }}>Your Profile</button>
        <button onClick={() => setActiveTab("search")} style={{ margin: "0 10px" }}>Search Users</button>
        <button onClick={() => setActiveTab("contacts")} style={{ margin: "0 10px" }}>Contacts</button>
      </div>

      <div style={{ padding: "30px" }}>
        {activeTab === "profile" && (
          <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "0 auto" }}>
            <label>Name:</label>
            <input name="ime" value={userData.ime} onChange={handleChange} style={{ width: "100%", marginBottom: "10px" }} />
            <label>Email:</label>
            <input name="email" value={userData.email} onChange={handleChange} style={{ width: "100%", marginBottom: "10px" }} />
            <label>Telefon:</label>
            <input name="telefon" value={userData.telefon} onChange={handleChange} style={{ width: "100%", marginBottom: "10px" }} />
            <label>Adresa:</label>
            <input name="adresa" value={userData.adresa} onChange={handleChange} style={{ width: "100%", marginBottom: "10px" }} />
            <label>Profilna slika:</label>
            {userData.profilnaSlika && (
              <div style={{ marginBottom: "10px" }}>
                <img src={`http://localhost:5000${userData.profilnaSlika}`} alt="Profilna" width={100} />
              </div>
            )}
            <input type="file" onChange={handleFileChange} style={{ marginBottom: "10px" }} />
            <button type="button" onClick={handleImageUpload} style={{ marginBottom: "10px" }}>Upload Image</button>
            <button type="submit" style={{ padding: "5px 10px" }}>Save</button>
            {message && <p style={{ marginTop: 10 }}>{message}</p>}
          </form>
        )}

        {activeTab === "search" && (
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <input type="text" placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: "100%", marginBottom: "20px", padding: "5px" }} />
            <ul>
              {filteredUsers.map((user) => {
                const alreadyContact = contacts.some((c) => c.email === user.email);
                return (
                  <li key={user.id} style={{ marginBottom: "10px" }}>
                    <strong>{user.ime}</strong> — {user.email}
                    {!alreadyContact ? (
                      <button
                        onClick={() => handleAddUserAsContact(user)}
                        style={{
                          marginLeft: "10px",
                          padding: "4px 8px",
                          backgroundColor: "#4caf50",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Add to Contacts
                      </button>
                    ) : (
                      <span style={{ marginLeft: "10px", color: "gray" }}>Already in Contacts</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {activeTab === "contacts" && (
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <h3>Your Contacts</h3>
              <ul>
                {contacts.map((c) => (
                  <li key={c.id}>
                    <span
                      style={{ cursor: "pointer", color: c.omiljeni ? "gold" : "gray", marginRight: "8px" }}
                      onClick={() => toggleFavorite(c.id, c.omiljeni)}
                    >
                      {c.omiljeni ? "★" : "☆"}
                    </span>
                    <strong>{c.ime}</strong> {c.prezime} — {c.brojTelefona}
                    <button onClick={() => handleDeleteContact(c.id)} style={{ marginLeft: 10 }}>Delete</button>
                  </li>
                ))}
              </ul>
            <form onSubmit={handleCreateContact}>
              <input name="ime" value={newContact.ime} onChange={handleContactChange} placeholder="Ime" />
              <input name="prezime" value={newContact.prezime} onChange={handleContactChange} placeholder="Prezime" />
              <input name="brojTelefona" value={newContact.brojTelefona} onChange={handleContactChange} placeholder="Broj telefona" />
              <input name="email" value={newContact.email} onChange={handleContactChange} placeholder="Email" />
              <button type="submit">Add Contact</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
