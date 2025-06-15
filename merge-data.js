import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Fonction pour lire un fichier JSON
function readJsonFile(filePath) {
    try {
        const data = readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(data);
        // Si les données sont dans un objet, extraire le tableau
        return Array.isArray(parsed) ? parsed : parsed.seances || parsed.campagnes || [];
    } catch (error) {
        console.error(`Erreur lors de la lecture de ${filePath}:`, error);
        return [];
    }
}

// Fonction pour sauvegarder un fichier JSON
function saveJsonFile(filePath, data) {
    try {
        writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Fichier sauvegardé avec succès: ${filePath}`);
    } catch (error) {
        console.error(`Erreur lors de la sauvegarde de ${filePath}:`, error);
    }
}

// Fonction pour fusionner les données
function mergeData(devData, prodData, keyField) {
    const merged = [...devData];
    const existingIds = new Set(devData.map(item => item[keyField]));

    prodData.forEach(prodItem => {
        if (!existingIds.has(prodItem[keyField])) {
            merged.push(prodItem);
        }
    });

    return merged;
}

// Fonction principale
function main() {
    const dataDir = join(__dirname, 'data');
    const backupDir = join(__dirname, 'data', 'backup');

    // Créer le dossier de backup s'il n'existe pas
    if (!existsSync(backupDir)) {
        mkdirSync(backupDir);
    }

    // Sauvegarder les fichiers actuels
    const files = ['seances.json', 'campagnes.json', 'data.json', 'jets.json'];
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    files.forEach(file => {
        const sourcePath = join(dataDir, file);
        const backupPath = join(backupDir, `${file}.${timestamp}.bak`);
        
        if (existsSync(sourcePath)) {
            copyFileSync(sourcePath, backupPath);
            console.log(`Backup créé: ${backupPath}`);
        }
    });

    // Fusionner les données
    const seancesDev = readJsonFile(join(dataDir, 'seances.json')) || [];
    const seancesProd = readJsonFile(join(dataDir, 'seances_prod.json')) || [];
    const campagnesDev = readJsonFile(join(dataDir, 'campagnes.json')) || [];
    const campagnesProd = readJsonFile(join(dataDir, 'campagnes_prod.json')) || [];

    // Vérification des formats
    if (!Array.isArray(seancesDev)) {
        console.error('Erreur : seances.json n\'est pas un tableau JSON valide.');
        return;
    }
    if (!Array.isArray(seancesProd)) {
        console.error('Erreur : seances_prod.json n\'est pas un tableau JSON valide.');
        return;
    }
    if (!Array.isArray(campagnesDev)) {
        console.error('Erreur : campagnes.json n\'est pas un tableau JSON valide.');
        return;
    }
    if (!Array.isArray(campagnesProd)) {
        console.error('Erreur : campagnes_prod.json n\'est pas un tableau JSON valide.');
        return;
    }

    // Fusionner les séances
    const mergedSeances = mergeData(seancesDev, seancesProd, 'id');
    saveJsonFile(join(dataDir, 'seances.json'), mergedSeances);

    // Fusionner les campagnes
    const mergedCampagnes = mergeData(campagnesDev, campagnesProd, 'id');
    saveJsonFile(join(dataDir, 'campagnes.json'), mergedCampagnes);

    console.log('Fusion des données terminée avec succès!');
}

main(); 