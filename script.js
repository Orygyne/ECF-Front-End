fetch("https://rickandmortyapi.com/api/character")
.then(response => response.json())
.then(data => generateCards(data.results))

function getEpisodeList(episodeURLs) {
    return episodeURLs.map(url => {
        const episodeNumber = url.split('/').pop(); // Obtient le numéro de l'épisode à partir de l'URL
        return `${episodeNumber}`;
    }).join(', ');
};

function togglePopup(characterId) {
    const popup = document.querySelector(`.popup-card.character-card-${characterId}`);
    popup.classList.toggle("open");
    
    // Récupérer tous les popups
    const allPopups = document.querySelectorAll('.popup-card');
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
                    <div class="text-white mx-8 my-5 leading-7">
                        <h2>Name : ${character.name}</h2>
                        <p>Status : ${character.status}</p>
                        <p>Gender : ${character.gender}</p>
                        <p>Species : ${character.species}</p>
                    </div>
                    <div class="flex justify-center items-baseline">
                        <button class="card-button">Know more</button>
                </div>

            <div id="popup-${character.id}" class="popup-card character-card-${character.id}"> <!-- Ajout de la classe popup-card ici -->
                <div class="flex justify-center">
                    <img class="w-64 h-auto" src=${character.image}></img>
                </div>
                <div class="text-white mx-8 my-5 leading-7">
                    <h2>Name : ${character.name}</h2>
                    <p>Origin : ${character.origin.name}</p>
                    <p>Last known location : ${character.location.name}</p>
                    <p>Species : ${character.species}</p>
                    <p>Episodes : ${getEpisodeList(character.episode)}</p>
                </div>
                <div class="flex justify-center items-start pb-1">
                    <button class="popup-button">Close</button>
                </div>
            </div>`;

        cardContainer.appendChild(card);
        
        // Ajout des écouteurs d'événements pour les boutons .card-button et .back-button
        const cardButton = card.querySelector('.card-button');
        cardButton.addEventListener('click', function() {
            togglePopup(character.id);
        });

        const backButton = card.querySelector('.popup-button');
        backButton.addEventListener('click', function() {
            togglePopup(character.id);
        });
    });
}