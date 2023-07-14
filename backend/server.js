// Importation du module http et du module app local
const http = require('http');
const app = require('./app');

// La fonction normalizePort renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

// Utilisation de la fonction normalizePort pour définir le port d'écoute du serveur

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// La fonction errorHandler recherche les différentes erreurs et les gère de manière appropriée. 
// Elle est ensuite enregistrée dans le serveur
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

// Création du serveur avec le module http et le module app local
const server = http.createServer(app);

// Ajout d'un gestionnaire d'erreur pour le serveur
server.on('error', errorHandler);

// Écoute du port défini et enregistrement de l'adresse sur laquelle le serveur est en train d'écouter
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

// Le serveur commence à écouter le port défini
server.listen(port);
