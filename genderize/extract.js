
const fs = require('fs');
const path = require('path');

// Fichier source
const inputFile = path.join(__dirname, 'data.json');

// Fichier de sortie
const outputFile = path.join(__dirname, 'data_names.json');

// Normalisation du prénom
function normaliserPrenom(prenom) {
    const normalise = prenom
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();

    return normalise.charAt(0).toUpperCase() + normalise.slice(1);
}

try {
    const contenu = fs.readFileSync(inputFile, 'utf8');

    // Récupérer les valeurs associées à la clé "rst"
    const regex = /"rst"\s*:\s*"((?:\\.|[^"\\])*)"/g;

    const resultats = [];

    let match;
    let occurrences = 0;
    let ignores = 0;

    while ((match = regex.exec(contenu)) !== null) {
        occurrences++;

        try {
            // Décoder les caractères Unicode échappés
            const nomComplet = JSON.parse(`"${match[1]}"`);

            // Récupérer le premier mot (prénom)
            const prenom = nomComplet.trim().split(/\s+/)[0];

            if (prenom) {
                resultats.push({
                    name: normaliserPrenom(prenom)
                });
            } else {
                ignores++;
            }

        } catch (error) {
            ignores++;
            console.error('Valeur ignorée :', match[1]);
        }
    }

    // Créer le fichier JSON
    fs.writeFileSync(
        outputFile,
        JSON.stringify(resultats, null, 2),
        'utf8'
    );

    console.log('\nExtraction terminée !');
    console.log(`Occurrences rst trouvées : ${occurrences}`);
    console.log(`Prénoms extraits : ${resultats.length}`);
    console.log(`Entrées ignorées : ${ignores}`);
    console.log(`Fichier créé : ${outputFile}`);

} catch (error) {
    console.error('Erreur :', error.message);
    process.exit(1);
}
