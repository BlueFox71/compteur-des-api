import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function deploy(message) {
    try {
        // Vérifier si un message est fourni
        if (!message) {
            console.error('Erreur: Veuillez fournir un message de commit avec l\'option -m');
            process.exit(1);
        }

        // Ajouter tous les fichiers
        console.log('Ajout des fichiers...');
        await execAsync('git add .');

        // Commit avec le message
        console.log('Création du commit...');
        await execAsync(`git commit -m "${message}"`);

        // Push vers origin
        console.log('Push vers origin...');
        await execAsync('git push origin');

        // Build
        console.log('Build en cours...');
        await execAsync('npm run build');

        // Déploiement
        console.log('Déploiement en cours...');
        await execAsync('npm run deploy');

        console.log('Déploiement terminé avec succès !');
    } catch (error) {
        console.error('Erreur lors du déploiement:', error.message);
        process.exit(1);
    }
}

// Récupérer le message depuis les arguments de la ligne de commande
const args = process.argv.slice(2);
const messageIndex = args.indexOf('-m');
if (messageIndex === -1 || messageIndex === args.length - 1) {
    console.error('Erreur: Veuillez fournir un message de commit avec l\'option -m');
    process.exit(1);
}

const message = args[messageIndex + 1];
deploy(message); 