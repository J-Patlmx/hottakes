// Importe le module Mongoose
const mongoose = require('mongoose');

// Création d'un schéma de données pour les sauces
const saucesSchema = mongoose.Schema({
    userId: {// L'utilisateur qui a créé la sauce doit être renseigné
        type: String,
        required: true
    },
    name: {
        type: String,// Le nom de la sauce est obligatoire
        required: true
    },
    manufacturer: {
        type: String, // Le nom du fabricant est obligatoire
        required: true
    },
    description: {
        type: String,// Une description de la sauce est obligatoire
        required: true
    },
    mainPepper: { // Le principal ingrédient de la sauce est obligatoire
        type: String,
        required: true
    },
    imageUrl: { // L'url de l'image de la sauce est obligatoire
        type: String,
        required: true
    },
    heat: {
        type: Number, // L'indice de piquant de la sauce est obligatoire
        required: true
    },
    likes: {// Le nombre de likes de la sauce est initialisé à 0 par défaut
        type: Number,
        required: true,
        default: 0
    },
    dislikes: {// Le nombre de disLikes de la sauce est initialisé à 0 par défaut
        type: Number,
        required: true,
        default: 0
    },
    usersLiked: {// Tableau contenant les identifiants des utilisateurs ayant aimé la sauce
        type: [String],
        required: true,
        default: []
    },
    usersDisliked: {// Tableau contenant les identifiants des utilisateurs ayant indiqué ne pas aimer la sauce
        type: [String],
        required: true,
        default: []
    },
});

// Exporte le schéma des sauces en tant que modèle Mongoose nommé "Sauces"
module.exports = mongoose.model('Sauces', saucesSchema);
