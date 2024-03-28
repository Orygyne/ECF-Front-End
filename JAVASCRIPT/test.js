const { function1, function2 } = require('./scriptIndex.js');
const { function3, function4 } = require('./scriptCharacters.js');
const { function5, function6 } = require('./scriptLocations.js');
const { function7, function8 } = require('./scriptEpisode.js');

// ---------------------------------------------------------------------------------------------------------------------

// Test des fonctions pour le fichier scriptIndex.js

// Importer les fonctions à tester
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// Charger le fichier HTML pour les tests
const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');

// Créer un environnement DOM simulé
const dom = new JSDOM(html);
global.document = dom.window.document;

// Importer les fonctions à tester
const { icons, close, nav, links } = require('scriptIndex.js');

// Test pour l'ajout de la classe "activeNav" lors du clic sur les icônes
test('Test de l\'ajout de la classe "activeNav" lors du clic sur les icônes', () => {
    icons.click(); // Simuler un clic sur les icônes
    expect(nav.classList.contains('activeNav')).toBe(true);
});

// Test pour la suppression de la classe "activeNav" lors du clic sur le bouton de fermeture
test('Test de la suppression de la classe "activeNav" lors du clic sur le bouton de fermeture', () => {
    close.click(); // Simuler un clic sur le bouton de fermeture
    expect(nav.classList.contains('activeNav')).toBe(false);
});

// Test pour la suppression de la classe "active" lors du clic sur chaque lien de la barre de navigation
test('Test de la suppression de la classe "active" lors du clic sur chaque lien de la barre de navigation', () => {
    links.forEach(link => {
        link.click(); // Simuler un clic sur chaque lien
        expect(nav.classList.contains('active')).toBe(false);
    });
});

// ---------------------------------------------------------------------------------------------------------------------

const { getAllCharacters, getRandomIndices, getEpisodeList, openPopupOnce, closePopup, closePopupOnClickOutside, generateCards } = require('./yourScriptFile.js');

// Mock de la fonction fetch pour simuler les appels à l'API Rick and Morty
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      info: { pages: 3 }, // Nombre total de pages dans les données fictives
      results: [{ id: 1, name: 'Rick', status: 'Alive', gender: 'Male', species: 'Human', origin: { name: 'Earth' }, location: { name: 'Earth' }, episode: ['url1', 'url2'] }]
    }),
  })
);

describe('getAllCharacters', () => {
  test('should fetch all characters from API', async () => {
    const characters = await getAllCharacters();
    expect(characters).toHaveLength(3); // Nombre total de pages
    expect(fetch).toBeCalledTimes(3); // Vérifie si fetch a été appelé 3 fois (pour chaque page)
  });
});

describe('getRandomIndices', () => {
  test('should return an array of random indices', () => {
    const indices = getRandomIndices(10, 3);
    expect(indices).toHaveLength(3);
    expect(Math.max(...indices)).toBeLessThan(10);
  });
});

describe('getEpisodeList', () => {
  test('should return a string of episode numbers', () => {
    const episodeList = getEpisodeList(['url1', 'url2']);
    expect(episodeList).toBe('1, 2');
  });
});

describe('openPopupOnce', () => {
  test('should add "open" class to popup if not already open', () => {
    document.body.innerHTML = '<div class="popup-card character-card-1"></div>';
    openPopupOnce(1);
    expect(document.querySelector('.popup-card.character-card-1').classList.contains('open')).toBe(true);
  });

  test('should not add "open" class to popup if already open', () => {
    document.body.innerHTML = '<div class="popup-card character-card-1 open"></div>';
    openPopupOnce(1);
    expect(document.querySelector('.popup-card.character-card-1').classList.contains('open')).toBe(true);
  });
});

describe('closePopup', () => {
  test('should remove "open" class from popup', () => {
    document.body.innerHTML = '<div class="popup-card character-card-1 open"></div>';
    closePopup(1);
    expect(document.querySelector('.popup-card.character-card-1').classList.contains('open')).toBe(false);
  });
});

describe('closePopupOnClickOutside', () => {
  test('should close popups when clicking outside', () => {
    document.body.innerHTML = `
      <div class="popup-card"></div>
      <button class="card-button"></button>
    `;
    closePopupOnClickOutside({ target: document.querySelector('button') });
    expect(document.querySelector('.popup-card').classList.contains('open')).toBe(false);
  });

  test('should not close popups when clicking on card buttons', () => {
    document.body.innerHTML = `
      <div class="popup-card"></div>
      <button class="card-button"></button>
    `;
    closePopupOnClickOutside({ target: document.querySelector('.card-button') });
    expect(document.querySelector('.popup-card').classList.contains('open')).toBe(true);
  });
});

describe('generateCards', () => {
    test('should generate cards with correct content and event listeners', () => {
      // Mock des données de personnages
      const charactersArray = [
        { id: 1, name: 'Rick', status: 'Alive', gender: 'Male', species: 'Human', origin: { name: 'Earth' }, location: { name: 'Earth' }, episode: ['url1', 'url2'], image: 'rick.jpg' },
        { id: 2, name: 'Morty', status: 'Alive', gender: 'Male', species: 'Human', origin: { name: 'Earth' }, location: { name: 'Earth' }, episode: ['url3', 'url4'], image: 'morty.jpg' }
      ];
  
      // Création d'un élément de conteneur de carte
      const cardContainer = document.createElement('div');
  
      // Appel de la fonction à tester
      generateCards(charactersArray);
  
      // Vérification du nombre de cartes générées
      expect(cardContainer.querySelectorAll('.flip-card')).toHaveLength(charactersArray.length);
  
      // Vérification du contenu des cartes générées
      const cards = cardContainer.querySelectorAll('.flip-card');
      cards.forEach((card, index) => {
        const character = charactersArray[index];
        expect(card.querySelector('.character-card-' + character.id)).toBeTruthy();
        expect(card.querySelector('.character-card-' + character.id + ' img').src).toContain(character.image);
        expect(card.querySelector('.character-card-' + character.id + ' h2').textContent).toBe('Name : ' + character.name);
        expect(card.querySelector('.character-card-' + character.id + ' p:nth-of-type(1)').textContent).toBe('Status : ' + character.status);
        expect(card.querySelector('.character-card-' + character.id + ' p:nth-of-type(2)').textContent).toBe('Gender : ' + character.gender);
        expect(card.querySelector('.character-card-' + character.id + ' p:nth-of-type(3)').textContent).toBe('Species : ' + character.species);
      });
  
      // Simuler un clic sur le bouton de chaque carte et vérifier si la popup correspondante est ouverte
      cards.forEach((card, index) => {
        const cardButton = card.querySelector('.card-button');
        cardButton.click();
        expect(document.querySelector('.popup-card.character-card-' + charactersArray[index].id).classList.contains('open')).toBe(true);
      });
    });
  });

  