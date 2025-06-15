import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Fonction pour exécuter un script
function runScript(scriptPath) {
    try {
        console.log(`Exécution de ${scriptPath}...`);
        execSync(`node "${scriptPath}"`, { stdio: 'inherit' });
        return true;
    } catch (error) {
        console.error(`Erreur lors de l'exécution de ${scriptPath}:`, error);
        return false;
    }
}

// Fonction principale
function main() {
    const scriptsDir = __dirname;
    
    console.log('Début de la synchronisation des données de production...');
    
    // 1. Télécharger les données de production
    if (!runScript(join(scriptsDir, 'fetch-prod-data.js'))) {
        console.error('Échec du téléchargement des données de production');
        return;
    }
    
    // 2. Fusionner les données
    if (!runScript(join(scriptsDir, 'merge-data.js'))) {
        console.error('Échec de la fusion des données');
        return;
    }
    
    console.log('Synchronisation terminée avec succès!');
}

main(); 