async function getAllCharacters() {
    try {
        const response = await fetch("https://rickandmortyapi.com/api/character");
        const data = await response.json();
        const totalPages = data.info.pages;
        console.log("Total pages:", totalPages);

        const characters = [];

        // Récupérer les données de chaque page
        for (let i = 1; i <= totalPages; i++) {
            const charactersResponse = await fetch(`https://rickandmortyapi.com/api/character?page=${i}`);
            const charactersData = await charactersResponse.json();
            characters.push(...charactersData.results);
        }

        return characters;
    } catch (error) {
        console.error('Error fetching characters:', error);
        throw error;
    }
}

function getRandomIndices(maxRange, count) {
    const indices = new Set();
    const maxIndex = maxRange - 1; // La plage d'index va de 0 à maxRange - 1

    while (indices.size < count) {
        const randomIndex = Math.floor(Math.random() * maxRange);
        if (randomIndex <= maxIndex) {
            indices.add(randomIndex);
        }
    }

    return [...indices];
}

fetch("https://rickandmortyapi.com/api/character")
.then(response => response.json())
.then(data => {
    const randomIndices = getRandomIndices(data.results.length, 12);
    const charactersArray = randomIndices.map(index => data.results[index]);
    generateCards(charactersArray);
    console.log(data)
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
                        <div class="flex justify-center items-center my-5">
                            <button class="popup-button close-button">Close</button>
                        </div>
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
};

// Définition de la fonction pour afficher 12 cartes aléatoires avec un statut aléatoire
function displayRandomCardsOnLoad() {
    getAllCharacters()
        .then(characters => {
            // Sélectionnez aléatoirement un statut parmi ceux disponibles
            const statuses = [...new Set(characters.map(character => character.status))];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

            // Filtrer les personnages en fonction du statut sélectionné
            const filteredCharacters = characters.filter(character => character.status === randomStatus);
        })
        .catch(error => {
            console.error('Error fetching characters:', error);
            alert("An error occurred while fetching characters. Please try again later.");
        });
}

// Appel de la fonction pour afficher les cartes dès le chargement de la page
displayRandomCardsOnLoad();

// Définition de la fonction pour récupérer tous les personnages et génération des cartes lorsque l'utilisateur clique sur "New List"
function generateNewRandomCards() {
    // Récupérer le statut sélectionné
    const selectedStatus = document.querySelector('#statusSelection').value;

    // Récupérer tous les personnages
    getAllCharacters()
        .then(characters => {
            // Filtrer les personnages en fonction du statut sélectionné
            const filteredCharacters = characters.filter(character => character.status === selectedStatus);
            
            // Si la liste filtrée contient moins de 12 personnages, générer une alerte
            if (filteredCharacters.length < 12) {
                alert("Not enough characters with selected status.");
                return;
            }

            // Sélectionnez aléatoirement 12 personnages parmi ceux ayant le statut sélectionné
            const randomIndices = getRandomIndices(filteredCharacters.length, 12);
            const selectedCharacters = randomIndices.map(index => filteredCharacters[index]);

            // Générer les cartes pour les personnages sélectionnés
            const cardContainer = document.querySelector(".cardContainer");
            cardContainer.innerHTML = ''; // Purge le conteneur
            generateCards(selectedCharacters); 
        })
        .catch(error => {
            console.error('Error generating new random cards:', error);
            alert("An error occurred while generating new random cards. Please try again later.");
        });
}

// Ajout d'un gestionnaire d'événements au bouton avec l'ID "newList"
const newListButton = document.getElementById('newList');
newListButton.addEventListener('click', generateNewRandomCards);

const links = document.querySelectorAll('nav li');
const icons = document.getElementById('icons')
const close = document.getElementById('close')
const nav = document.querySelector('nav')

icons.addEventListener("click", () =>{
    nav.classList.add("activeNav")
})

close.addEventListener("click", () =>{
    nav.classList.remove("activeNav")
})

links.forEach((link) => {
    link.addEventListener('click', () => {
        nav.classList.remove("active")
    });
});