// Importation des modules nécessaires
const express = require('express');
const helmet = require("helmet");
const mongoose = require('mongoose');
// Création de l'application Express
const app = express();

// Importation des routes définies dans le fichier 'user.js' et 'sauces.js'
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauces');

// Importation du module 'path' pour manipuler les chemins d'accès aux fichiers
const path = require('path');

// Configuration de l'application pour utiliser les variables d'environnement stockées dans le fichier .env
require('dotenv').config()

// Connexion à la base de données MongoDB
mongoose.connect(`mongodb+srv://${process.env.USER1}:${process.env.PASSWORD}@${process.env.MONGO_DB_ACCESS}`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// Middleware qui analyse le corps de toutes les requêtes entrantes sous format JSON
app.use(express.json());


app.use(helmet({
    crossOriginResourcePolicy: false
}));



// Middleware qui ajoute des en-têtes de réponse pour autoriser l'accès à l'API depuis n'importe quelle origine
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Configuration des routes à utiliser avec le middleware 'app'
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

// Configuration de l'accès aux images statiques
app.use('/images', express.static(path.join(__dirname, 'images')));

// Exportation de l'application pour utilisation dans d'autres fichiers
module.exports = app;

