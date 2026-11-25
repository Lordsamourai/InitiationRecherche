const fs = require('fs');

// Lire le fichier JSON
const donnees = JSON.parse(
  fs.readFileSync('data_names.json', 'utf8')
);

async function analyser() {
  const resultats = [];

  // Parcourir chaque nom
  for (const personne of donnees) {
    try {
      const url = `http://localhost:4567/gender?name=${encodeURIComponent(personne.name)}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      const resultat = await response.json();

      resultats.push({
        name: personne.name,
        gender: resultat.gender
      });
    } catch (erreur) {
      console.error(`Erreur pour ${personne.name} :`, erreur.message);

      resultats.push({
        name: personne.name,
        gender: null,
        error: erreur.message
      });
    }
  }

  // Créer le fichier de résultats
  fs.writeFileSync(
    'resultats.json',
    JSON.stringify(resultats, null, 2),
    'utf8'
  );

  console.log('Analyse terminée !');
  console.log(`${resultats.length} noms traités.`);
}

analyser();
