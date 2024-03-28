// Burger Menu

// Selecting elements
const links = document.querySelectorAll('nav li');
const icons = document.getElementById('icons')
const close = document.getElementById('close')
const nav = document.querySelector('nav')

// Adding event listener for opening the menu
icons.addEventListener("click", () =>{
    nav.classList.add("activeNav")
})

// Adding event listener for closing the menu
close.addEventListener("click", () =>{
    nav.classList.remove("activeNav")
})

// Adding event listener for links to close the menu when clicked
links.forEach((link) => {
    link.addEventListener('click', () => {
        nav.classList.remove("active")
    });
});