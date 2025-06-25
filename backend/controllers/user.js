const User = require('../models/user');  // Uvezi model
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Helper funkcija da izbacimo lozinku pre slanja
function userWithoutPassword(user) {
  const userData = user.toJSON();
  delete userData.lozinka;
  return userData;
}

// Nodemailer konfiguracija (primer sa Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendWelcomeEmail(email, ime, verificationLink) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Dobrodošli! Nastavite registraciju',
    html: `
      <h1>Zdravo, ${ime}!</h1>
      <p>Vaš nalog je kreiran. Molimo kliknite na link ispod da biste nastavili registraciju:</p>
      <a href="${verificationLink}">Nastavi registraciju</a>
    `,
  };

  await transporter.sendMail(mailOptions);
}

async function getAllUsers(req, res) {
  try {
    const users = await User.findAll();
    const usersSafe = users.map(userWithoutPassword);
    res.json(usersSafe);
  } catch (err) {
    res.status(500).json({ error: 'Greška pri dohvatanju korisnika' });
  }
}

async function getAllUsersWithPasswords(req, res) {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Greška pri dohvatanju korisnika' });
  }
}

async function getUserById(req, res) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Korisnik nije pronađen' });
    res.json(userWithoutPassword(user));
  } catch (err) {
    res.status(500).json({ error: 'Greška pri dohvatanju korisnika' });
  }
}

async function createUser(req, res) {
  try {
    const { ime, email, lozinka } = req.body;

    if (!ime || !email || !lozinka) {
      return res.status(400).json({ error: 'Sva polja su obavezna' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Korisnik sa tim email-om već postoji' });
    }

    const newUser = await User.create({ ime, email, lozinka });

    // Kreiraj JWT token za verifikaciju (validan 1h)
    const verificationToken = jwt.sign(
      { userId: newUser.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const verificationLink = `http://localhost:5000/api/users/verify-email?token=${verificationToken}`;

    // Pošalji email sa linkom za verifikaciju
    await sendWelcomeEmail(email, ime, verificationLink);

    res.status(201).json(userWithoutPassword(newUser));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška pri kreiranju korisnika' });
  }
}

async function verifyEmail(req, res) {
  const token = req.query.token;
  if (!token) return res.status(400).send('Token nije prosleđen.');

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.userId);
    if (!user) return res.status(404).send('Korisnik nije pronađen.');

    user.emailVerified = true;
    await user.save();
    res.send('Email je uspešno verifikovan. Možete nastaviti registraciju.');
  } catch (error) {
    res.status(400).send('Nevažeći ili istekao token.');
  }
}

async function updateUser(req, res) {
  try {
    const { ime, email, lozinka, profilnaSlika, telefon, adresa } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Korisnik nije pronađen' });

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        return res.status(400).json({ error: 'Email je već zauzet' });
      }
    }

    await user.update({
      ime,
      email,
      lozinka,
      profilnaSlika,
      telefon,
      adresa,
    });

    res.json(userWithoutPassword(user));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška pri ažuriranju korisnika' });
  }
}

async function deleteUser(req, res) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Korisnik nije pronađen' });
    await user.destroy();
    res.json({ message: 'Korisnik je obrisan' });
  } catch (err) {
    res.status(500).json({ error: 'Greška pri brisanju korisnika' });
  }
}

async function login(req, res) {
  try {
    const { email, lozinka } = req.body;
    if (!email || !lozinka) {
      return res.status(400).json({ error: 'Email i lozinka su obavezni' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Neispravan email ili lozinka' });

    // Provera verifikacije emaila
    if (!user.emailVerified) {
      return res.status(403).json({ error: 'Email nije verifikovan. Proverite vašu email poštu.' });
    }

    const validPassword = await user.proveriLozinku(lozinka);
    if (!validPassword) return res.status(401).json({ error: 'Neispravan email ili lozinka' });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user: userWithoutPassword(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška pri logovanju' });
  }
}

module.exports = {
  getAllUsers,
  getAllUsersWithPasswords,
  getUserById,
  createUser,
  verifyEmail,
  updateUser,
  deleteUser,
  login,
};
