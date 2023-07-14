const express = require('express');
const router = express.Router(); // initialisation d'un routeur Express
const auth = require('../middleware/auth'); // middleware d'authentification pour protéger les routes
const multer = require('../middleware/multer-config'); // middleware de configuration Multer pour la gestion des fichiers

const saucesCtrl = require('../controllers/sauces'); // importation du contrôleur de sauces

// Création d'une nouvelle sauce
router.post('/', auth, multer, saucesCtrl.createSauce);

// Modification d'une sauce existante
router.put('/:id', auth, multer, saucesCtrl.modifySauce);

// Suppression d'une sauce existante
router.delete('/:id', auth, saucesCtrl.deleteSauce);

// Récupération d'une sauce spécifique par son identifiant
router.get('/:id', auth, saucesCtrl.getOneSauce);

// Récupération de toutes les sauces
router.get('/', auth, saucesCtrl.getAllSauce);

// Gestion des likes et dislikes des sauces
router.post('/:id/like', auth, saucesCtrl.rateSauce);

module.exports = router; // exportation du routeur pour utilisation dans l'application principale

