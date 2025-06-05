// Force l'encodage UTF-8 pour Node.js sous Windows
if (process.platform === 'win32') {
  const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.on('SIGINT', () => process.emit('SIGINT'));
}

// === Importations
const eventsRoutes = require('./routes/eventsRoutes');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/db');
const { internalIpV4 } = require('internal-ip');
const authRoutes = require('./routes/authRoutes');
const commentsRoutes = require('./routes/commentsRoutes');

const app = express();
const PORT = 3000;

// === Middleware
app.use(cors());
app.use(bodyParser.json());

// === Routes
app.use('/auth', authRoutes);
app.use('/events', eventsRoutes);
app.use('/comments', commentsRoutes);

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.get('/', (req, res) => {
  res.send('API Campus Events Hub - Opérationnelle');
});

app.get('/categories', (req, res) => {
  db.query('SELECT * FROM categories', (err, results) => {
    if (err) {
      console.error('Erreur SQL:', err);
      return res.status(500).json({ error: 'Erreur de base de données' });
    }
    res.json(results);
  });
});

app.get('/test-db', (req, res) => {
  db.query(`
    SELECT 
      e.id,
      e.title,
      e.date,
      e.time,
      c.name AS category,
      COUNT(a.user_id) AS attendees_count
    FROM events e
    LEFT JOIN categories c ON e.category_id = c.id
    LEFT JOIN attendees a ON e.id = a.event_id
    GROUP BY e.id
    LIMIT 10
  `, (err, results) => {
    if (err) {
      console.error('Erreur SQL:', err);
      return res.status(500).json({ error: 'Erreur de base de données' });
    }
    res.json(results);
  });
});

// === 404 - route non trouvée
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// === Démarrage du serveur
app.listen(PORT, '0.0.0.0', () => {
  internalIpV4().then((ip) => {
    console.log('\n=== SERVEUR PRÊT ===');
    console.log(`Local:    http://localhost:${PORT}`);
    console.log(`Réseau:   http://${ip}:${PORT}`);
  });
});
