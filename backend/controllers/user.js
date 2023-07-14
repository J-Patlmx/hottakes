// Importation des modules nécessaires
const bcrypt = require('bcrypt');
const User = require('../models/users');
const jwt = require('jsonwebtoken');

// const handleErrors = (err) => { return err;};

// Fonction pour créer un nouvel utilisateur

exports.signup = (req, res, next) => {

    // Expression régulière pour valider le format du mot de passe (au moins 8 caractères, une lettre en capitale, un chiffre)
    const isPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
    try {
        // Si le mot de passe correspond au format requis
        if (req.body.password.match(isPassword)) {
            // Hashage du mot de passe avec le sel 10 (pour plus de sécurité)
            bcrypt.hash(req.body.password, 10)
                .then(hash => {
                    // Création d'un nouvel utilisateur avec l'email et le mot de passe hashé
                    const user = new User({
                        email: req.body.email,
                        password: hash
                    });
                    user.save()// Sauvegarde de l'utilisateur dans la base de données
                        .then(() => res.status(201).json({ message: 'Utilisateur crée !' }))
                        .catch(error => res.status(409).json({ message: 'Veuillez vérifier vos identifiants.' }));
                })
                .catch(error => res.status(500).json({ error }));

        }
        // Si le mot de passe ne correspond pas au format requis
        else {
            res.status(400).json({
                message:
                    "votre mot de passe doit contenir entre 8 et 20 caractères, avec au moins 1 lettre en capitale et 1 chiffre",
            });


        }
    }
    // Si une erreur se produit lors de la validation du mot de passe
    catch (err) {
        return res.status(500).json(
            { message: 'Erreur serveur, veuillez ressayer plus tard.' })
    }
};

// Fonction pour connecter un utilisateur existant
exports.login = (req, res, next) => {
    // Recherche de l'utilisateur correspondant à l'email fourni
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {// Si aucun utilisateur n'est trouvé avec cet email
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            // Comparaison du mot de passe fourni avec le mot de passe hashé stocké pour cet utilisateur
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {// Si le mot de passe fourni ne correspond pas au mot de passe hashé
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    // Si l'authentification est réussie, retourner un token d'authentification avec l'ID de l'utilisateur
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },

                            process.env.TOKEN_ENCODED,
                            { expiresIn: '24h' },
                        )
                    });
                    // user.email = MaskData.maskEmail2(req.body.email, emailMask2Options)
                    console.log(user)
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};