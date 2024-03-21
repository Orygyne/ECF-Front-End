async function fetchLocations() {
    const baseUrl = 'https://rickandmortyapi.com/api/location';
    const locationsPerPage = 20;
    const totalPages = Math.ceil(126 / locationsPerPage);
    let locations = [];

    // Parcourir toutes les pages pour récupérer les emplacements
    for (let page = 1; page <= totalPages; page++) {
        const response = await fetch(`${baseUrl}?page=${page}`);
        const data = await response.json();
        const pageLocations = data.results;
        locations = locations.concat(pageLocations);
    }

    return locations;
}

async function fetchCharacters() {
    const baseUrl = 'https://rickandmortyapi.com/api/character';
    const charactersPerPage = 20;
    const totalPages = 42;
    let characters = [];

    // Parcourir toutes les pages pour récupérer les personnages
    for (let page = 1; page <= totalPages; page++) {
        const response = await fetch(`${baseUrl}?page=${page}`);
        const data = await response.json();
        const pageCharacters = data.results;
        characters = characters.concat(pageCharacters);
    }

    return characters;
}

async function fetchLocationsAndPopulateSelect() {
    const locations = await fetchLocations();
    const selectElement = document.getElementById('locationSelection');

    // Parcourir chaque emplacement
    for (const location of locations) {
        // Récupérer les personnages pour cet emplacement
        const characters = await fetchCharactersByLocation(location.name);

        // Vérifier s'il y a des personnages pour cet emplacement
        if (characters.length > 0) {
            // Si des personnages existent, ajouter une option à la balise select
            const optionElement = document.createElement('option');
            optionElement.value = location.name;
            optionElement.textContent = location.name;

            // Ajouter la classe à l'option
            optionElement.classList.add('option-class');

            selectElement.appendChild(optionElement);
        } else {
            // Si aucun personnage n'existe, ajouter des éléments h2 et p à la place de l'option
            const h2Element = document.createElement('h2');
            h2Element.textContent = 'Oups';
            selectElement.appendChild(h2Element);

            const pElement = document.createElement('p');
            pElement.textContent = "they're all dead ! (Nah just kidding)";
            selectElement.appendChild(pElement);
        }
    }
}

async function fetchCharactersByLocation(locationName) {
    const characters = await fetchCharacters(); // Assurez-vous que fetchCharacters est défini
    return characters.filter(character => character.location.name === locationName);
}

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

async function generateCardsForLocation(locationName) {
    const characters = await fetchCharactersByLocation(locationName);
    const cardContainer = document.querySelector(".cardContainer");
    cardContainer.innerHTML = ''; // Effacer le contenu précédent du conteneur

    characters.forEach(character => {
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
                    </div>
                </div>`;

        cardContainer.appendChild(card);
    });
}

document.getElementById('locationSelection').addEventListener('change', async function() {
    // Récupérer la valeur sélectionnée
    const selectedLocation = this.value;
    
    // Générer les cartes pour la location sélectionnée
    await generateCardsForLocation(selectedLocation);
});

// Appel initial pour afficher tous les personnages
fetchLocationsAndPopulateSelect().catch(error => {
    console.error('Une erreur s\'est produite :', error);
});