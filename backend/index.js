const express = require('express');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const routes = require('./routes');
const { syncDatabase } = require('./models');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', routes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    await syncDatabase();
    console.log('✅ Konekcija na bazu uspešna.');
  } catch (error) {
    console.error('Greška pri konekciji sa bazom:', error);
  }

  console.log(` Server je pokrenut na portu ${PORT}`);
});
