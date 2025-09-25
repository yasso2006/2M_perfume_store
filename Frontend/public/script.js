const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav__links");
const menuBtnIcon = menuBtn.querySelector("i");

menuBtn.addEventListener("click", (e) => {
    navLinks.classList.toggle("open");

    const isOpen = navLinks.classList.contains("open");
    menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
});

navLinks.addEventListener("click", (e) => {
    navLinks.classList.remove("open");
    menuBtnIcon.setAttribute("class", "ri-menu-line");
});

const scrollRevealOption = {
    distance: "50px",
    origin: "bottom",
    duration: 1000,
};

ScrollReveal().reveal(".header__image img", {
    ...scrollRevealOption,
    origin: "right",
});

ScrollReveal().reveal(".header__content h1", {
    ...scrollRevealOption,
    delay: 500,
});

ScrollReveal().reveal(".header__content p", {
    ...scrollRevealOption,
    delay: 1000,
});

ScrollReveal().reveal(".header__content h5", {
    ...scrollRevealOption,
    delay: 1000,
});

ScrollReveal().reveal(".header__content .btn", {
    ...scrollRevealOption,
    delay: 1500,
});

ScrollReveal().reveal(".header__content .bar", {
    ...scrollRevealOption,
    delay: 2000,
});

ScrollReveal().reveal(".header__content .size", {
    ...scrollRevealOption,
    delay: 500,
});

// Scroll animations for new sections
ScrollReveal().reveal(".product__card", {
    ...scrollRevealOption,
    interval: 200,
});

ScrollReveal().reveal(".contact__item", {
    ...scrollRevealOption,
    interval: 300,
});

ScrollReveal().reveal(".checkout__section", {
    ...scrollRevealOption,
    interval: 400,
});

ScrollReveal().reveal(".page__header", {
    ...scrollRevealOption,
    origin: "top",
});
