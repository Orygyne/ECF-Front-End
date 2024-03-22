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


