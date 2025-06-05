const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const SECRET_KEY = 'campus_secret_key'; // À mettre dans .env plus tard

const register = async (req, res) => {
  const { name, email, password } = req.body;
  console.log('Tentative d’inscription avec :', { name, email, password });

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Champs requis manquants' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users (name, email, password_hash)
      VALUES (?, ?, ?)
    `;

    db.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) {
        console.error('Erreur SQL:', err);
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ error: 'Email déjà utilisé' });
        }
        return res.status(500).json({ error: 'Erreur serveur' });
      }

      res.status(201).json({ message: 'Inscription réussie', userId: result.insertId });
    });
  } catch (err) {
    console.error('Erreur catch register:', err);
    res.status(500).json({ error: 'Erreur lors du traitement' });
  }
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ error: 'Champs requis manquants' });

  const sql = `SELECT * FROM users WHERE email = ?`;
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });

    if (results.length === 0) {
      return res.status(401).json({ error: 'Email non trouvé' });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) return res.status(401).json({ error: 'Mot de passe incorrect' });

    const token = jwt.sign(
      { userId: user.id },
      SECRET_KEY,
      { expiresIn: '3h' }
    );

    res.json({
      message: 'Connexion réussie',
      token,
      user: { id: user.id, name: user.name }
    });
  });
};

const me = (req, res) => {
  const { userId } = req.user;

  const sql = `SELECT id, name, email FROM users WHERE id = ?`;
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur SQL' });    
    if (results.length === 0) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    res.json(results[0]);
  });
};

module.exports = {
  register,
  login,
  me // ✅ maintenant correctement exportée
};
