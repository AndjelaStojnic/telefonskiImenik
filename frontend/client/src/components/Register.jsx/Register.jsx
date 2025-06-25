import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [ime, setIme] = useState('');
  const [email, setEmail] = useState('');
  const [lozinka, setLozinka] = useState('');
  const [poruka, setPoruka] = useState('');
  const [greska, setGreska] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPoruka('');
    setGreska('');

    try {
      await axios.post('http://localhost:3000/users', {
        ime,
        email,
        lozinka,
      });

      setPoruka('Uspešno registrovan! Proverite mejl da nastavite registraciju.');
      setIme('');
      setEmail('');
      setLozinka('');
    } catch (err) {
      console.error(err);
      setGreska(err.response?.data?.error || 'Greška pri registraciji');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>Registracija</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Ime:</label>
          <input
            type="text"
            value={ime}
            onChange={(e) => setIme(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Lozinka:</label>
          <input
            type="password"
            value={lozinka}
            onChange={(e) => setLozinka(e.target.value)}
            required
          />
        </div>
        <button type="submit">Registruj se</button>
      </form>

      {poruka && <p style={{ color: 'green' }}>{poruka}</p>}
      {greska && <p style={{ color: 'red' }}>{greska}</p>}
    </div>
  );
};

export default Register;
