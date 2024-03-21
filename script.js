fetch("https://rickandmortyapi.com/api/character")
.then(response => response.json())
.then(data => generateCards(data.results))

function generateCards(charactersArray) {
    const cardContainer = document.querySelector(".cardContainer");
    charactersArray.forEach(character => {
        const card = document.createElement('div');
        card.className = 'flip-card m-5';

        card.innerHTML = `
            <div class="flip-card-inner">

                <div class="character-card-${character.id} flip-card-front">
                    <div class="flex justify-center">
                        <img src=${character.image}></img>
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
                </div>
    
                <div class="character-card-${character.id} flip-card-back">
                    <div class="flex justify-center">
                        <img class="w-40 h-auto" src=${character.image}></img>
                    </div>
                    <div class="text-white mx-8 my-5 leading-7">
                        <h2>Name : ${character.name}</h2>
                        <p>Origin : ${character.origin.name}</p>
                        <p>Last known location : ${character.location.name}</p>
                        <p>Species : ${character.species}</p>
                        <p>Episodes : ${getEpisodeList(character.episode)}</p>
                    </div>
                    <div class="flex justify-center items-start pb-1">
                        <button class="back-button">Flip back</button>
                    </div>
                </div>

            </div>`;
        
        cardContainer.appendChild(card);
    });

    // Ajouter l'écouteur d'événements pour le flip après avoir créé toutes les cartes
    const cardButtons = document.querySelectorAll('.card-button');
    cardButtons.forEach(button => {
        button.addEventListener('click', toggleCard);
    });

}

function getEpisodeList(episodeURLs) {
    return episodeURLs.map(url => {
        const episodeNumber = url.split('/').pop(); // Obtient le numéro de l'épisode à partir de l'URL
        return `${episodeNumber}`;
    }).join(', ');
}

function toggleCard() {
    console.log("j'ai cliqué");

    // Récupère l'élément .flip-card-inner
    const flipCardInner = this.closest('.flip-card').querySelector('.flip-card-inner');
    
    // Ajoute ou retire la classe .flip pour effectuer l'animation
    flipCardInner.classList.toggle('flip');

    // Ajoute ou retire la classe .flip-card-back pour afficher la face arrière ou avant de la carte
    flipCardInner.classList.toggle('flip-card-back');
}