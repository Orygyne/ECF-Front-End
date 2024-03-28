// Function to fetch all episodes from the Rick and Morty API
async function fetchEpisodes() {
    const baseUrl = 'https://rickandmortyapi.com/api/episode';
    let episodes = [];
    let nextPageUrl = baseUrl;

    // Keep fetching episodes until there are no more next pages
    while (nextPageUrl) {
        const response = await fetch(nextPageUrl);
        const data = await response.json();
        episodes = episodes.concat(data.results);
        nextPageUrl = data.info.next; // Update the URL of the next page
    }

    return episodes;
}

// Call the fetchEpisodes function and log the results to the console
fetchEpisodes()
    .then(episodes => {
        console.log('Complete list of episodes:', episodes);
    })
    .catch(error => {
        console.error('An error occurred while fetching episodes:', error);
    });

// Function to fetch all characters from the Rick and Morty API
async function fetchAllCharacters() {
    const baseUrl = 'https://rickandmortyapi.com/api/character';
    let characters = [];
    let nextPageUrl = baseUrl;

    // Keep fetching characters until there are no more next pages
    while (nextPageUrl) {
        const response = await fetch(nextPageUrl);
        const data = await response.json();
        characters = characters.concat(data.results);
        nextPageUrl = data.info.next; // Update the URL of the next page
    }

    return characters;
}
    
// Call the fetchAllCharacters function and log the total number of characters to the console
fetchAllCharacters()
    .then(characters => {
        console.log('Total number of characters:', characters.length);
    })
    .catch(error => {
        console.error('An error occurred while fetching characters:', error);
    });

// Function to fetch all episodes from the Rick and Morty API
async function fetchAllEpisodes() {
    const baseUrl = 'https://rickandmortyapi.com/api/episode';
    let episodes = [];
    let nextPageUrl = baseUrl;

    // Keep fetching episodes until there are no more next pages
    while (nextPageUrl) {
        const response = await fetch(nextPageUrl);
        const data = await response.json();
        episodes = episodes.concat(data.results);
        nextPageUrl = data.info.next; // Update the URL of the next page
    }

    return episodes;
}

// Function to populate the episode selection dropdown with all episodes
async function populateEpisodeSelect() {
    const episodes = await fetchAllEpisodes();
    const selectElement = document.getElementById('episodeSelection');

    // Loop through each episode and add an option with its ID and name to the select element
    episodes.forEach(episode => {
        const optionElement = document.createElement('option');
        optionElement.value = episode.id;
        optionElement.textContent = `${episode.id} - ${episode.name}`;

        // Add class to the option
        optionElement.classList.add('option-class');

        selectElement.appendChild(optionElement);
    });
}
        
// Call the populateEpisodeSelect function to populate the select element with episodes
populateEpisodeSelect()
.catch(error => {
    console.error('An error occurred while fetching episodes:', error);
});

// Function to extract episode numbers from episode URLs and format them as a list
function getEpisodeList(episodeURLs) {
    return episodeURLs.map(url => {
        const episodeNumber = url.split('/').pop(); // Extract the episode number from the URL
        return `${episodeNumber}`;
    }).join(', ');
};

// Function to open the popup for a character card only once
function openPopupOnce(characterId) {
    const popup = document.querySelector(`.popup-card.character-card-${characterId}`);
    if (!popup.classList.contains("open")) {
        popup.classList.add("open");
    }
}

// Function to close the popup for a character card
function closePopup(characterId) {
    const popup = document.querySelector(`.popup-card.character-card-${characterId}`);
    popup.classList.remove("open");
}

// Function to close popups when clicked outside
function closePopupOnClickOutside(event) {
    const popups = document.querySelectorAll('.popup-card');
    const cardButtons = document.querySelectorAll('.card-button');
    const closeButton = document.querySelectorAll('.close-button');

    // Check if the clicked element is a custom card or a popup button
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

    // If the clicked element is neither a card nor a button, close all popups
    if (!isCardOrButton) {
        popups.forEach(popup => {
            popup.classList.remove('open'); // Remove the 'open' class to close the modal
        });
    }
}

// Function to generate character cards dynamically
function generateCards(charactersArray) {
    const cardContainer = document.querySelector(".cardContainer");
    cardContainer.innerHTML = ''; // Clear previous content from the container

    // Loop through each character in the array to create a card for each
    charactersArray.forEach(character => {
        // Create a new card element
        const card = document.createElement('div');
        card.className = 'flip-card';

        // Populate the card HTML with character information
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

        // Add event listeners for the card buttons and popup buttons
        const cardButton = card.querySelector('.card-button');
        cardButton.addEventListener('click', function() {
            openPopupOnce(character.id);
        });

        const closeButton = card.querySelector('.close-button');
        closeButton.addEventListener('click', function() {
            closePopup(character.id);
        });
    });

    // Listen for click events on the document to close modals
    document.addEventListener('click', closePopupOnClickOutside);
}

// Add an event listener to the select element
document.getElementById('episodeSelection').addEventListener('change', async function() {
    // Get the value of the selected episode
    const selectedEpisodeId = this.value;

    try {
        // Fetch all episodes
        const allEpisodes = await fetchEpisodes();

        // Find the episode corresponding to the selected ID
        const selectedEpisode = allEpisodes.find(episode => episode.id === parseInt(selectedEpisodeId));

        if (selectedEpisode) {
            // Fetch characters present in the selected episode
            const charactersInEpisode = await fetchCharactersInEpisode(selectedEpisode);

            // Generate cards for characters in the selected episode
            generateCards(charactersInEpisode);
        } else {
            console.error('Selected episode not found.');
        }
    } catch (error) {
        console.error('An error occurred while fetching characters in episode:', error);
    }
});

// Function to fetch characters present in a specific episode
async function fetchCharactersInEpisode(episode) {
    const characters = [];
    // Iterate over each character URL in the episode
    for (const characterUrl of episode.characters) {
        // Fetch character data from the API
        const response = await fetch(characterUrl);
        // Parse character data as JSON
        const character = await response.json();
        // Add the character to the characters array
        characters.push(character);
    }
    // Return the array of characters
    return characters;
}