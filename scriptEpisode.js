async function fetchEpisodes() {
    const baseUrl = 'https://rickandmortyapi.com/api/episode';
    let episodes = [];
    let nextPageUrl = baseUrl;

    // Continuer à récupérer les épisodes jusqu'à ce qu'il n'y ait plus de page suivante
    while (nextPageUrl) {
        const response = await fetch(nextPageUrl);
        const data = await response.json();
        episodes = episodes.concat(data.results);
        nextPageUrl = data.info.next; // Met à jour l'URL de la page suivante
    }

    return episodes;
}

// Appel de la fonction fetchEpisodes et affichage des résultats dans la console
fetchEpisodes()
    .then(episodes => {
        console.log('Liste complète des épisodes :', episodes);
    })
    .catch(error => {
        console.error('Une erreur s\'est produite lors de la récupération des épisodes :', error);
    });

    async function fetchAllCharacters() {
        const baseUrl = 'https://rickandmortyapi.com/api/character';
        let characters = [];
        let nextPageUrl = baseUrl;
    
        // Continuer à récupérer les personnages jusqu'à ce qu'il n'y ait plus de page suivante
        while (nextPageUrl) {
            const response = await fetch(nextPageUrl);
            const data = await response.json();
            characters = characters.concat(data.results);
            nextPageUrl = data.info.next; // Met à jour l'URL de la page suivante
        }
    
        return characters;
    }
    
    // Appel de la fonction fetchAllCharacters et affichage du nombre total de personnages dans la console
    fetchAllCharacters()
        .then(characters => {
            console.log('Nombre total de personnages :', characters.length);
        })
        .catch(error => {
            console.error('Une erreur s\'est produite lors de la récupération des personnages :', error);
        });

        async function fetchAllEpisodes() {
            const baseUrl = 'https://rickandmortyapi.com/api/episode';
            let episodes = [];
            let nextPageUrl = baseUrl;
        
            // Continuer à récupérer les épisodes jusqu'à ce qu'il n'y ait plus de page suivante
            while (nextPageUrl) {
                const response = await fetch(nextPageUrl);
                const data = await response.json();
                episodes = episodes.concat(data.results);
                nextPageUrl = data.info.next; // Met à jour l'URL de la page suivante
            }
        
            return episodes;
        }
        
        async function populateEpisodeSelect() {
            const episodes = await fetchAllEpisodes();
            const selectElement = document.getElementById('episodeSelection');
        
            // Parcourir chaque épisode et ajouter une option avec son ID et son nom à la balise select
            episodes.forEach(episode => {
                const optionElement = document.createElement('option');
                optionElement.value = episode.id;
                optionElement.textContent = `${episode.id} - ${episode.name}`;
                selectElement.appendChild(optionElement);
            });
        }
        
// Appel de la fonction populateEpisodeSelect pour peupler la balise select avec les épisodes
populateEpisodeSelect()
.catch(error => {
    console.error('Une erreur s\'est produite lors de la récupération des épisodes :', error);
});

function getEpisodeList(episodeURLs) {
    return episodeURLs.map(url => {
        const episodeNumber = url.split('/').pop(); // Obtient le numéro de l'épisode à partir de l'URL
        return `${episodeNumber}`;
    }).join(', ');
};

function openPopupOnce(characterId) {
    const popup = document.querySelector(`.popup-card.character-card-${characterId}`);
    if (!popup.classList.contains("open")) {
        popup.classList.add("open");
    }
}

function closePopup(characterId) {
    const popup = document.querySelector(`.popup-card.character-card-${characterId}`);
    popup.classList.remove("open");
}

function closePopupOnClickOutside(event) {
    const popups = document.querySelectorAll('.popup-card');
    const cardButtons = document.querySelectorAll('.card-button');
    const closeButton = document.querySelectorAll('.close-button');

    // Vérifie si l'élément cliqué est une carte personnalisée ou un bouton popup
    let isCardOrButton = false;
    cardButtons.forEach(button => {
        if (button.contains(event.target)) {
            isCardOrButton = true;
        }
    });
    closeButton.forEach(button => {
        if (button.contains(event.target)) {
            isCardOrButton = true;
        }
    });

    if (!isCardOrButton) {
        popups.forEach(popup => {
            popup.classList.remove('open'); // Retire la classe 'open' pour fermer la modal
        });
    }
}

function generateCards(charactersArray) {
    const cardContainer = document.querySelector(".cardContainer");
    cardContainer.innerHTML = ''; // Effacer le contenu précédent du conteneur

    charactersArray.forEach(character => {
        const card = document.createElement('div');
        card.className = 'flip-card';

        card.innerHTML = `
            <div class="character-card-${character.id} flip-card-front">
                <div class="flex justify-center">
                    <img class="w-64" src=${character.image}></img>
                </div>
                <div class="text-black mx-8 my-5 leading-7">
                    <h2>Name : ${character.name}</h2>
                    <p>Status : ${character.status}</p>
                    <p>Gender : ${character.gender}</p>
                    <p>Species : ${character.species}</p>
                </div>
                <div class="flex justify-center items-baseline">
                    <button class="card-button">Know more</button>
                </div>
            </div>
            
            <div id="popup-${character.id}" class="popup-card character-card-${character.id}">
                <div class="flex justify-center py-5">
                    <img class="w-64 h-auto" src=${character.image}></img>
                </div>
                <div class="text-black mx-8 my-5 leading-7">
                    <h2>Name : ${character.name}</h2>
                    <p>Origin : ${character.origin.name}</p>
                    <p>Last known location : ${character.location.name}</p>
                    <p>Species : ${character.species}</p>
                    <p>Episodes : ${getEpisodeList(character.episode)}</p>
                </div>
                <div class="flex justify-center items-center h-auto my-5">
                    <button class="popup-button close-button">Close</button>
                </div>
            </div>`;

        cardContainer.appendChild(card);

        // Ajout des écouteurs d'événements pour les boutons .card-button et .popup-button
        const cardButton = card.querySelector('.card-button');
        cardButton.addEventListener('click', function() {
            openPopupOnce(character.id);
        });

        const closeButton = card.querySelector('.close-button');
        closeButton.addEventListener('click', function() {
            closePopup(character.id);
        });
    });

    // Écoute des événements de clic sur le document pour fermer les modals
    document.addEventListener('click', closePopupOnClickOutside);
}

// Ajouter un gestionnaire d'événements à la balise select
document.getElementById('episodeSelection').addEventListener('change', async function() {
    // Récupérer la valeur de l'épisode sélectionné
    const selectedEpisodeId = this.value;

    try {
        // Récupérer tous les épisodes
        const allEpisodes = await fetchEpisodes();

        // Trouver l'épisode correspondant à l'ID sélectionné
        const selectedEpisode = allEpisodes.find(episode => episode.id === parseInt(selectedEpisodeId));

        if (selectedEpisode) {
            // Récupérer les personnages présents dans l'épisode sélectionné
            const charactersInEpisode = await fetchCharactersInEpisode(selectedEpisode);

            // Générer les cartes pour les personnages dans l'épisode sélectionné
            generateCards(charactersInEpisode);
        } else {
            console.error('L\'épisode sélectionné n\'a pas été trouvé.');
        }
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des personnages de l\'épisode :', error);
    }
});

// Fonction pour récupérer les personnages présents dans un épisode spécifique
async function fetchCharactersInEpisode(episode) {
    const characters = [];
    for (const characterUrl of episode.characters) {
        const response = await fetch(characterUrl);
        const character = await response.json();
        characters.push(character);
    }
    return characters;
}