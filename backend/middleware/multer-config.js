// Importe le module Multer
const multer = require('multer');

// Définit les types MIME acceptés et les extensions correspondantes
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// Configure le stockage des fichiers téléchargés
const storage = multer.diskStorage({
    // Définit le dossier de destination
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    // Définit le nom du fichier
    filename: (req, file, callback) => {
        // Remplace les espaces par des underscores dans le nom du fichier
        const name = file.originalname.split(' ').join('_');
        // Récupère l'extension du fichier en fonction du type MIME
        const extension = MIME_TYPES[file.mimetype];
        // Appelle le callback avec le nom et l'extension du fichier
        callback(null, name + Date.now() + '.' + extension);
    }
});

// Exporte un middleware Multer qui stocke un seul fichier avec la configuration définie
module.exports = multer({ storage: storage }).single('image');
