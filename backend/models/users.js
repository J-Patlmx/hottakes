// Importation des modules nécessaires
const mongoose = require('mongoose');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');

// Définition du schéma de la collection 'users' dans la base de données
const usersSchema = mongoose.Schema({
    email: {
        type: String, // Le type de l'attribut 'email' est une chaîne de caractères
        required: true, // L'attribut 'email' est obligatoire
        unique: true, // L'attribut 'email' doit être unique (pas de doublons)
        Validate: [validator.isEmail, 'Email invalide'] // La valeur de l'attribut 'email' doit être une adresse email valide
    },
    password: {
        type: String, // Le type de l'attribut 'password' est une chaîne de caractères
        required: true // L'attribut 'password' est obligatoire
    }
});
usersSchema.plugin(uniqueValidator);
// Exportation du modèle 'Users' basé sur le schéma défini ci-dessus
module.exports = mongoose.model('Users', usersSchema);

