import { createWriteStream, existsSync, mkdirSync, unlink } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const PROD_URL = 'https://compteur-des-api.onrender.com/api';
const dataDir = join(__dirname, 'data');

// Fonction pour télécharger un fichier
function downloadFile(filename) {
    return new Promise((resolve, reject) => {
        const filePath = join(dataDir, `${filename}_prod.json`);
        const file = createWriteStream(filePath);

        https.get(`${PROD_URL}/${filename}`, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Erreur HTTP: ${response.statusCode}`));
                return;
            }

            response.pipe(file);

            file.on('finish', () => {
                file.close();
                console.log(`Téléchargement terminé: ${filename}`);
                resolve();
            });
        }).on('error', (err) => {
            unlink(filePath, () => {}); // Supprimer le fichier en cas d'erreur
            reject(err);
        });
    });
}

// Fonction principale
async function main() {
    try {
        // Créer le dossier data s'il n'existe pas
        if (!existsSync(dataDir)) {
            mkdirSync(dataDir);
        }

        // Télécharger les fichiers
        await downloadFile('seances');
        await downloadFile('campagnes');

        console.log('Téléchargement des données de production terminé!');
    } catch (error) {
        console.error('Erreur lors du téléchargement:', error);
    }
}

main(); 