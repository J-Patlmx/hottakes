// Importation des modules nécessaires

const Sauce = require('../models/sauces');
const fs = require('fs');

// Route post pour créer une sauce
exports.createSauce = (req, res, next) => {
    // On récupère les données de la sauce depuis le corps de la requête
    const sauceObject = JSON.parse(req.body.sauce);
    // On retire les champs inutiles pour la création de la sauce
    delete sauceObject._id;
    delete sauceObject._userId;
    // On crée une instance de Sauce avec les données de la requête et l'ID de l'utilisateur
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    sauce.save()// Sauvegarde de la sauce dans la base de données
        .then(() => { res.status(201).json({ message: 'Sauce enregistré !' }) })
        .catch(error => { res.status(400).json({ error }) })
};


// Route pour modifier une sauce existante
exports.modifySauce = (req, res, next) => {
    // On récupère les données de la sauce depuis le corps de la requête
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    // On retire les champs inutiles pour la modification de la sauce
    delete sauceObject._userId;
    // On vérifie que l'utilisateur est autorisé à modifier cette sauce
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                // On met à jour la sauce dans la base de données
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce modifié!' }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

// Route pour supprimer une sauce existante
exports.deleteSauce = (req, res, next) => {
    // On vérifie que l'utilisateur est autorisé à supprimer cette sauce
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                // On supprime l'image de la sauce sur le serveur
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    // On supprime la sauce dans la base de données
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Sauce supprimé !' }) })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

// Route pour obtenir les détails d'une sauce spécifique
exports.getOneSauce = (req, res, next) => {

    Sauce.findOne({ _id: req.params.id })  // Recherche la sauce avec l'id donné
        .then(sauces => res.status(200).json(sauces))// Si la sauce est trouvée, retourne les détails de la sauce
        .catch(error => res.status(404).json({ error }));// Si la sauce n'est pas trouvée, retourne une erreur 404
};

// Route pour obtenir toutes les sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find() // Recherche toutes les sauces
        .then(sauces => res.status(200).json(sauces)) // Si les sauces sont trouvées, retourne les détails de toutes les sauces
        .catch(error => res.status(404).json({ error }));// Si les sauces ne sont pas trouvées, retourne une erreur 404

};


// Route pour noter une sauce(post)

exports.rateSauce = (req, res, next) => {

    const like = req.body.like// Récupère la valeur de la note
    const userId = req.body.userId // Récupère l'id de l'utilisateur qui a noté la sauce
    const sauceId = req.params.id// Récupère l'id de la sauce notée
    if (like === 1) {// Si l'utilisateur a noté la sauce avec un "j'aime"
        Sauce.updateOne({ _id: sauceId }, // On récupère la sauce correspondante
            {
                $inc: { likes: +1 }, // On incrémente les likes de +1
                $push: { usersLiked: userId }  // On ajoute l'id de l'utilisateur dans le tableau des utilisateurs qui ont aimé la sauce
            })
            .then(() => res.status(201).json({ message: 'Vous avez aimé cette sauce !' }))// Si la mise à jour s'est effectuée avec succès, retourne un message de confirmation
            .catch((error) => res.status(400).json({ error }));// Si la mise à jour a échoué, retourne une erreur 400
    }





    if (like === -1) { // Si l'utilisateur a noté la sauce avec un "je n'aime pas"
        Sauce.updateOne({ _id: sauceId }, // On récupère la sauce correspondante
            {
                $inc: { dislikes: +1 }, // On incrémente les dislikes de +1
                $push: { usersDisliked: userId } // On ajoute l'id de l'utilisateur dans le tableau des utilisateurs qui n'ont pas aimé la sauce
            })
            .then(() => res.status(201).json({ message: "Vous avez n'avez pas aimé cette sauce !" }))// Si la mise à jour s'est effectuée avec succès, retourne un message de confirmation
            .catch((error) => res.status(400).json({ error }));// Si la mise à jour a échoué, retourne une erreur 400
    }



    if (like === 0) {  // Si l'utilisateur annule sa note
        Sauce.findOne({ _id: sauceId })// On récupère la sauce correspondante
            .then((sauce) => {
                if (sauce.usersLiked.includes(userId)) { // Si l'utilisateur est dans le tableau des utilisateurs qui ont aimé la sauce
                    Sauce.updateOne(
                        { _id: sauceId },
                        {
                            $inc: { likes: -1 }, // On incrémente les likes de -1
                            $pull: { usersLiked: userId } // On retire le user du tableau
                        })
                        .then(() => res.status(201).json({ message: 'Votre mention \'j\'aime\' a été retirée !' }))
                        .catch((error) => res.status(400).json({ error }));
                }
                if (sauce.usersDisliked.includes(userId)) { // Si l'utilisateur est dans le tableau des dislikes(il a déjà noté la sauce)
                    Sauce.updateOne(
                        { _id: sauceId },
                        {
                            $inc: { dislikes: -1 },  // On incrémente les likes de -1
                            $pull: { usersDisliked: userId } // On retire le user du tableau
                        })
                        .then(() => res.status(201).json({ message: 'Votre mention \'je n\'aime pas\' a été retirée !' }))
                        .catch((error) => res.status(400).json({ error }));
                }
            })
            .catch((error) => res.status(404).json({ error }));
    }
}

