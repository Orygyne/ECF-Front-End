// Function to fetch all locations from the Rick and Morty API
async function fetchLocations() {
    const baseUrl = 'https://rickandmortyapi.com/api/location';
    const locationsPerPage = 20; // Number of locations per page
    const totalPages = Math.ceil(126 / locationsPerPage); // Total pages of locations
    let locations = [];

    // Loop through all pages to fetch locations
    for (let page = 1; page <= totalPages; page++) {
        const response = await fetch(`${baseUrl}?page=${page}`);
        const data = await response.json();
        const pageLocations = data.results;
        locations = locations.concat(pageLocations);
    }

    return locations; // Return the array of locations
}

// Function to fetch all characters from the Rick and Morty API
async function fetchCharacters() {
    const baseUrl = 'https://rickandmortyapi.com/api/character';
    const charactersPerPage = 20; // Number of characters per page
    const totalPages = 42; // Total pages of characters
    let characters = [];

    // Loop through all pages to fetch characters
    for (let page = 1; page <= totalPages; page++) {
        const response = await fetch(`${baseUrl}?page=${page}`);
        const data = await response.json();
        const pageCharacters = data.results;
        characters = characters.concat(pageCharacters);
    }

    return characters; // Return the array of characters
}

// Function to fetch locations and populate the select element with location names
async function fetchLocationsAndPopulateSelect() {
    const locations = await fetchLocations(); // Fetch all locations
    const selectElement = document.getElementById('locationSelection'); // Get the select element

    // Iterate through each location
    for (const location of locations) {
        // Fetch characters for this location
        const characters = await fetchCharactersByLocation(location.name);

        // Check if there are characters for this location
        if (characters.length > 0) {
            // If characters exist, add an option to the select element
            const optionElement = document.createElement('option');
            optionElement.value = location.name;
            optionElement.textContent = location.name;

            // Add class to the option
            optionElement.classList.add('option-class');

            selectElement.appendChild(optionElement); // Append the option to the select element
        } else {
            // If no characters exist, add h2 and p elements instead of the option
            const h2Element = document.createElement('h2');
            h2Element.textContent = 'Oops';
            selectElement.appendChild(h2Element);

            const pElement = document.createElement('p');
            pElement.textContent = "They're all dead! (Nah just kidding)";
            selectElement.appendChild(pElement);
        }
    }
}

// Function to fetch characters by location name
async function fetchCharactersByLocation(locationName) {
    const characters = await fetchCharacters(); // Ensure fetchCharacters is defined
    return characters.filter(character => character.location.name === locationName);
}

// Function to generate a comma-separated list of episode numbers from episode URLs
function getEpisodeList(episodeURLs) {
    return episodeURLs.map(url => {
        const episodeNumber = url.split('/').pop(); // Extracts the episode number from the URL
        return `${episodeNumber}`;
    }).join(', ');
}

// Function to open a popup modal once for a given character ID
function openPopupOnce(characterId) {
    const popup = document.querySelector(`.popup-card.character-card-${characterId}`);
    if (!popup.classList.contains("open")) {
        popup.classList.add("open"); // Adds the 'open' class to show the modal
    }
}

// Function to close the popup modal for a given character ID
function closePopup(characterId) {
    const popup = document.querySelector(`.popup-card.character-card-${characterId}`);
    popup.classList.remove("open"); // Removes the 'open' class to hide the modal
}

// Function to close popup modals when clicking outside the modal
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

    if (!isCardOrButton) {
        popups.forEach(popup => {
            popup.classList.remove('open'); // Remove the 'open' class to close the modal
        });
    }
}


// Function to generates cards for characters associated with a specified location
async function generateCardsForLocation(locationName) {
    // Fetch characters based on the provided location name
    const characters = await fetchCharactersByLocation(locationName);
    const cardContainer = document.querySelector(".cardContainer");
    cardContainer.innerHTML = ''; // Clear the previous content of the container

    // Loop through each character and generate a card
    characters.forEach(character => {
        const card = document.createElement('div');
        card.className = 'flip-card';

        // Populate the card with character information
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

// Add event listener to the location selection dropdown
document.getElementById('locationSelection').addEventListener('change', async function() {
    // Get the selected location value
    const selectedLocation = this.value;
    
    // Generate cards for the selected location
    await generateCardsForLocation(selectedLocation);
});

// Initial call to fetch and populate locations in the selection dropdown
fetchLocationsAndPopulateSelect().catch(error => {
    console.error('An error occurred:', error);
});

// Event listeners for navigation icons and close button
const links = document.querySelectorAll('nav li');
const icons = document.getElementById('icons')
const close = document.getElementById('close')
const nav = document.querySelector('nav')

// Event listener to toggle navigation menu visibility
icons.addEventListener("click", () =>{
    nav.classList.add("activeNav")
})

// Event listener to close the navigation menu
close.addEventListener("click", () =>{
    nav.classList.remove("activeNav")
})

// Event listeners to remove 'active' class from navigation on link click
links.forEach((link) => {
    link.addEventListener('click', () => {
        nav.classList.remove("active")
    });
});