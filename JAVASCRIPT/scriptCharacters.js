/**
 * Fetches all characters from the Rick and Morty API
 * @returns {Promise<Array>} An array containing all characters
 */

async function getAllCharacters() {
    try {
        const characters = [];
        let page = 1;
        let totalPages;

        // Fetch the first page to get total pages
        const initialResponse = await fetch("https://rickandmortyapi.com/api/character");
        const initialData = await initialResponse.json();
        totalPages = initialData.info.pages;

        // Continue fetching pages until all pages have been retrieved
        while (page <= totalPages) {
            const response = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
            const data = await response.json();
            
            if (!data.results) {
                throw new Error("No character data found");
            }
            
            // Add characters from the current page to the array
            characters.push(...data.results);

            // Move to the next page
            page++;
        }
        return characters;

    } catch (error) {
        console.error('Error fetching characters:', error);
        throw error;
    }
}

/**
 * Generates an array of unique random indices within a specified range
 * @param {number} maxRange - The maximum range of indices (exclusive)
 * @param {number} count - The number of random indices to generate
 * @returns {Array} An array containing unique random indices
 */

function getRandomIndices(maxRange, count) {
    // Set to store unique random indices
    const indices = new Set();
    // The maximum index value in the range
    const maxIndex = maxRange - 1; // Index range is from 0 to maxRange - 1

    // Continue generating random indices until desired count is reached
    while (indices.size < count) {
        // Generate a random index within the range
        const randomIndex = Math.floor(Math.random() * maxRange);
        // Add the random index to the set if it's within the valid range
        if (randomIndex <= maxIndex) {
            indices.add(randomIndex);
        }
    }

    // Convert the Set to an array and return
    return [...indices];
}

//  Function to get 12 random characters
getAllCharacters()
    .then(characters => {
        // Extracting random indices to select random characters from the received data
        const randomIndices = getRandomIndices(characters.length, 12);
        // Using the random indices to select random characters from the data
        const charactersArray = randomIndices.map(index => characters[index]);
        // Generating cards for the selected characters
        generateCards(charactersArray);
        // Logging the entire data for reference
        console.log(characters);
    })
    .catch(error => {
        console.error('Error fetching characters:', error);
        // Error handling
        alert("An error occurred while fetching characters. Please try again later.");
    });



/**
 * Generates a string containing a list of episode numbers from an array of episode URLs
 * @param {Array} episodeURLs - An array containing URLs of episodes
 * @returns {string} A comma-separated list of episode numbers
 */

function getEpisodeList(episodeURLs) {
    return episodeURLs.map(url => {
        // Extracts the episode number from the URL
        const episodeNumber = url.split('/').pop();
        return `${episodeNumber}`;
    }).join(', '); // Joins the episode numbers into a comma-separated string
};

/**
 * Opens a popup card for a character if it's not already open
 * @param {string} characterId - The unique identifier of the character
 */

function openPopupOnce(characterId) {
    const popup = document.querySelector(`.popup-card.character-card-${characterId}`);
    // Check if the popup is not already open before adding the "open" class
    if (!popup.classList.contains("open")) {
        popup.classList.add("open");
    }
}

/**
 * Closes a popup card for a character
 * @param {string} characterId - The unique identifier of the character
 */

function closePopup(characterId) {
    const popup = document.querySelector(`.popup-card.character-card-${characterId}`);
    // Remove the "open" class to close the popup
    popup.classList.remove("open");
}

/**
 * Closes all popups when a click event occurs outside of a popup or its associated buttons
 * @param {Event} event - The click event object
 */

function closePopupOnClickOutside(event) {
    // Selecting all popup cards, card buttons, and close buttons
    const popups = document.querySelectorAll('.popup-card');
    const cardButtons = document.querySelectorAll('.card-button');
    const closeButton = document.querySelectorAll('.close-button');

    // Checking if the clicked element is a custom card or a popup button
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

    // If the clicked element is not a card or a button, close all popups
    if (!isCardOrButton) {
        popups.forEach(popup => {
            // Removing the 'open' class to close the popup
            popup.classList.remove('open');
        });
    }
}

/**
 * Generates character cards based on the provided array of character objects
 * @param {Array} charactersArray - An array containing character objects
 */

function generateCards(charactersArray) {
    // Selecting the container where the cards will be appended
    const cardContainer = document.querySelector(".cardContainer");

    // Iterating through each character in the array
    charactersArray.forEach(character => {
        // Creating a new div element for the card
        const card = document.createElement('div');
        card.className = 'flip-card'; // Setting the class name for the card

        // Constructing the HTML content for the card
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

        // Appending the card to the card container
        cardContainer.appendChild(card);
        
        // Adding event listeners for the card button and popup button
        const cardButton = card.querySelector('.card-button');
        cardButton.addEventListener('click', function() {
            openPopupOnce(character.id);
        });

        const closeButton = card.querySelector('.close-button');
        closeButton.addEventListener('click', function() {
            closePopup(character.id);
        });
    });

    // Listening for click events on the document to close modals when clicked outside
    document.addEventListener('click', closePopupOnClickOutside);
};

// Function definition to retrieve all characters and generate cards when the user clicks "New List"
function generateNewRandomCards() {
    // Get the selected status
    const selectedStatus = document.querySelector('#statusSelection').value;

    // Retrieve all characters
    getAllCharacters()
        .then(characters => {
            // Filter characters based on the selected status
            const filteredCharacters = characters.filter(character => character.status === selectedStatus);
            
            // If the filtered list contains less than 12 characters, generate an alert
            if (filteredCharacters.length < 12) {
                alert("Not enough characters with selected status.");
                return;
            }

            // Randomly select 12 characters from those with the selected status
            const randomIndices = getRandomIndices(filteredCharacters.length, 12);
            const selectedCharacters = randomIndices.map(index => filteredCharacters[index]);

            // Generate cards for the selected characters
            const cardContainer = document.querySelector(".cardContainer");
            cardContainer.innerHTML = ''; // Clear the container
            generateCards(selectedCharacters); 
        })
        .catch(error => {
            // Error handling: logging to console and alerting the user
            console.error('Error generating new random cards:', error);
            alert("An error occurred while generating new random cards. Please try again later.");
        });
}

// Adding an event listener to the button with the ID "newList"
const newListButton = document.getElementById('newList');
newListButton.addEventListener('click', generateNewRandomCards);

// Selecting navigation links and elements for opening/closing navigation
const links = document.querySelectorAll('nav li');
const icons = document.getElementById('icons')
const close = document.getElementById('close')
const nav = document.querySelector('nav')

// Event listener for opening navigation when the icons are clicked
icons.addEventListener("click", () =>{
    nav.classList.add("activeNav") // Adding the "activeNav" class to the navigation element
})

// Event listener for closing navigation when the close button is clicked
close.addEventListener("click", () =>{
    nav.classList.remove("activeNav") // Removing the "activeNav" class from the navigation element
})

// Event listeners for navigation links to close the navigation when a link is clicked
links.forEach((link) => {
    link.addEventListener('click', () => {
        nav.classList.remove("active") // Removing the "active" class from the navigation element
    });
});