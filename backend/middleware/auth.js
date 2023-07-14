// Importe le module jsonwebtoken
const jwt = require('jsonwebtoken');

// Exporte un middleware pour vérifier le token JWT d'authentification
module.exports = (req, res, next) => {
    try {
        // Récupère le token dans l'en-tête Authorization de la requête
        const token = req.headers.authorization.split(' ')[1];
        // Décrypte le token avec la clé secrète et récupère les données décodées
        const decodedToken = jwt.verify(token, process.env.TOKEN_ENCODED);
        // Récupère l'identifiant de l'utilisateur dans les données décodées
        const userId = decodedToken.userId;
        // Ajoute l'identifiant de l'utilisateur dans l'objet "auth" de la requête
        req.auth = {
            userId: userId
        };
        // Passe au middleware suivant
        next();
    } catch (error) {
        // En cas d'erreur, retourne une erreur 401 non autorisée avec le message d'erreur
        res.status(401).json({ error });
    }
};
