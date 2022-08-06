'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

///////////////////////////////////////
// Modal window

const openModal = function(e) {
    e.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const closeModal = function() {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});

///////////////////////////////////////////////
// Button scrolling
btnScrollTo.addEventListener('click', function(e) {
    const s1coords = section1.getBoundingClientRect();
    //console.log(s1coords);

    console.log(e.target.getBoundingClientRect());

    console.log(window.pageXOffset, window.pageYOffset);

    //Scrolling
    // window.scrollTo(
    //     s1coords.left + window.pageXOffset,
    //     s1coords.top + window.pageYOffset
    // );
    //Or

    // window.scrollTo({
    //     left: s1coords.left + window.pageXOffset,
    //     top: s1coords.top + window.pageYOffset,
    //     behavior: 'smooth',
    // });
    // Or

    section1.scrollIntoView({ behavior: 'smooth' });
});

////////////////////////////////
// Page navigation

// document.querySelectorAll('.nav__link').forEach(el => {
//     el.addEventListener('click', function(e) {
//         e.preventDefault();
//         const id = this.getAttribute('href');
//         console.log(id);
//         document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//     });
// });

// Efficient Way
// 1. Add event listenre to common parent element
// 2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function(e) {
    e.preventDefault();

    // Matching strategy
    if (e.target.classList.contains('nav__link')) {
        const id = e.target.getAttribute('href');
        console.log(id);
        document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    }
});

// Tabbed component
tabsContainer.addEventListener('click', e => {
    const clicked = e.target.closest('.operations__tab');

    // Guard clause
    if (!clicked) return;

    tabs.forEach(t => t.classList.remove('operations__tab--active'));

    tabsContent.forEach(content =>
        content.classList.remove('operations__content--active')
    );

    clicked.classList.add('operations__tab--active');

    // Activate content area
    document
        .querySelector(`.operations__content--${clicked.dataset.tab}`)
        .classList.add('operations__content--active');
});

// Menu fade animation
const handleHover = function(e) {
    if (e.target.classList.contains('nav__link')) {
        const link = e.target;
        const siblings = link.closest('.nav').querySelectorAll('.nav__link');
        const logo = link.closest('.nav').querySelector('img');

        siblings.forEach(el => {
            if (el !== link) el.style.opacity = this; //this holds argument value
        });
        logo.style.opacity = this;
    }
};

// Passing an argument into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky navigation
// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function(e) {
//     if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//     else nav.classList.remove('sticky');
// });
// Sticky navigation: Intersection Observer API

// const obsCallBack = function(entries, onserver) {
//     entries.forEach(entry => console.log(entry));
// };

// const obsOptions = {
//     root: null,
//     threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallBack, obsOptions);
// observer.observe(section1);

// Sticky navigation: Intersection Observer API
const header = document.querySelector('.header');
const navHeight = getComputedStyle(nav).height;
//console.log(navHeight);

const stickyNav = function(entries) {
    const [entry] = entries;
    //console.log(entry);

    if (!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}`,
});
headerObserver.observe(header);

// Reveal sections
const allSections = document.querySelectorAll('.section');
const revealSection = function(entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting) return;

    observer.unobserve(entry.target);
    entry.target.classList.remove('section--hidden');
};
const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
});

allSections.forEach(sec => {
    sectionObserver.observe(sec);
    sec.classList.add('section--hidden');
});

// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function(entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting) return;

    // Replace src with data-src
    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener('load', () => {
        entry.target.classList.remove('lazy-img');
    });

    observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
    root: null,
    threshold: 0,
    rootMargin: '+200px',
});

imgTargets.forEach(img => {
    imgObserver.observe(img);
});

///////////////////////////////////////////
///////////////////////////////////////////
//////////////////////////////////////////

// console.log(document.documentElement);
// console.log(document.body);

// document.querySelector('.header');
// const allSelections = document.querySelectorAll('.section');
// console.log(allSelections);

// document.getElementById('section--1');
// const allButtons = document.getElementsByTagName('button');
// console.log(allButtons);

// document.getElementsByClassName('btn');

// // Creating and inserting elements

// const message = document.createElement('div');
// message.classList.add('cookie-message');
// //message.textContent = 'We use cookied for improved functionality and analytics';
// message.innerHTML =
//     'We use cookied for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

// const header = document.querySelector('.header');
// //header.prepend(message);
// header.append(message);
// //header.append(message.cloneNode(true));

// //header.before(message);
// //header.after(message);

// // Delete elements
// document
//     .querySelector('.btn--close-cookie')
//     .addEventListener('click', function() {
//         message.remove();
//         //message.parentElement.removeChild(message);
//     });

// // Styles
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

// console.log(message.style.backgroundColor);
// console.log(message.style.display);

// console.log(getComputedStyle(message).display);

// message.style.height =
//     Number.parseFloat(getComputedStyle(message).height) + 40 + 'px';
// console.log(message.style.height);

// // CSS Custom properties
// document.documentElement.style.setProperty('--color-primary', 'orangered');

// // Attributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo.src);
// console.log(logo.className);

// logo.alt = 'Beautiful minimalist logo';

// console.log(logo.getAttribute('src'));

// const link = document.querySelector('.nav__link--btn');
// console.log(link.href);
// console.log(link.getAttribute('href'));

// // Data attributes
// console.log(logo.dataset.versionNumber);

// // Classes
// logo.classList.add('c', 'j');
// logo.classList.remove('c', 'j');
// logo.classList.toggle('c');
// console.log(logo.classList.contains('c'));

// // Don't use
// logo.className = 'Prince';

// const h1 = document.querySelector('h1');

// const alertH1 = e => {
//     alert('addEventListener: Great! You are reading the heading: D');

//     // Modern way to listen to event only once
//     //h1.removeEventListener('mouseenter', alertH1);
// };

// h1.addEventListener('mouseenter', alertH1);

// setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);

// h1.onmouseenter = function(e) {
//     alert('addEventListener: Great! You are reading the heading: D');
// };

//rgb
// const randomInt = (min, max) =>
//     Math.floor(Math.random() * (max - min + 1) + min);

// const randomColor = () =>
//     `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function(e) {
//     this.style.backgroundColor = randomColor();
//     console.log('LINK', e.target);

//     // Stop propagation
//     //e.stopPropagation();
// });

// document.querySelector('.nav__links').addEventListener('click', function(e) {
//     this.style.backgroundColor = randomColor();
//     console.log('CONTAINER', e.target);
// });

// document.querySelector('.nav').addEventListener('click', function(e) {
//     this.style.backgroundColor = randomColor();
//     console.log('NAV', e.target);
// });

// const h1 = document.querySelector('h1');

// // Going downwards: Child
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'orangered';

// // Going upwards: parents
// console.log(h1.parentNode);

// h1.closest('.header').style.background = 'var(--gradient-secondary)';

// // Going sideways: siblings
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// // All siblings
// console.log(h1.parentElement.children);

// [...h1.parentElement.children].forEach(el => {
//     el !== h1 && (el.style.transform = 'scale(0.5)');
// });