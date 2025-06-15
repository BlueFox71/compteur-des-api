import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function moveFiles() {
    // Créer le dossier data s'il n'existe pas
    const DATA_DIR = join(__dirname, 'data');
    if (!fs.existsSync(DATA_DIR)) {
        await fs.mkdir(DATA_DIR);
    }

    // Liste des fichiers à déplacer
    const files = [
        'data.json',
        'jets.json',
        'seances.json',
        'campagnes.json'
    ];

    // Déplacer chaque fichier
    for (const file of files) {
        const sourcePath = join(__dirname, file);
        const destPath = join(DATA_DIR, file);

        try {
            // Vérifier si le fichier source existe
            await fs.access(sourcePath);
            
            // Lire le contenu du fichier source
            const content = await fs.readFile(sourcePath, 'utf8');
            
            // Écrire dans le nouveau fichier
            await fs.writeFile(destPath, content);
            
            console.log(`Fichier ${file} déplacé avec succès`);
        } catch (error) {
            console.error(`Erreur lors du déplacement de ${file}:`, error.message);
        }
    }
}

moveFiles().catch(console.error); 