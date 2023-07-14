// import de la bibliothèque Express
const express = require('express');

// Création d'un objet Router d'Express
const router = express.Router();

// Import du contrôleur utilisateur
const userCtrl = require('../controllers/user');

// Configuration de routes POST pour l'inscription et la connexion de l'utilisateur
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// Export du router pour l'utilisation dans d'autres modules
module.exports = router;
