const countriesData = [
    {
        title: "United States",
        short: "us",
        count: 34260
    },
    {
        title: "Canada",
        short: "ca",
        count: 2696,
    },
    {
        title: "Spain",
        short: "es",
        count: 271
    },
    {
        title: "Poland",
        short: "pl",
        count: 214,
    },
    {
        title: "El Salvador",
        short: "sv",
        count: 212
    },
    {
        title: "Australia",
        short: "au",
        count: 184,
    },
    {
        title: "Switzerland",
        short: "ch",
        count: 153,
    },
    {
        title: "Hong Kong",
        short: "hk",
        count: 152,
    },
    {
        title: "Romania",
        short: "ro",
        count: 150,
    },
    {
        title: "Austria",
        short: "at",
        count: 131,
    },
];

const multipliedCountries = [...countriesData, ...countriesData, ...countriesData, ...countriesData, ...countriesData, ...countriesData]

function detectDevice() {
    const width = window.innerWidth;

    if (width <= 768) return 'mobile';
    return 'desktop';
}

const state = {
    visibleCount: 30,
    itemsPerLoad: 30,
};

const elements = {
    navigationMenu: document.querySelector('.navigation__menu'),
    navigationBurger: document.querySelector('.navigation__burger'),
    navigationDialog: document.querySelector('.navigation__dialog'),
    countriesList: document.querySelector('.countries__list'),
    expandBtn: document.getElementById('expandBtn'),
    restaurantForm: document.getElementById('restaurantForm'),
    year: document.querySelector('.year')
};

function documentInit() {
    renderCountries();
    renderYear();
    setupEventListeners();
    formInit();
}

function windowSetup() {
    setupMenu()
    setupCountries()
}

function setupEventListeners() {
    elements.expandBtn?.addEventListener('click', handleExpand);
    elements.restaurantForm?.addEventListener('submit', handleSubmit);
    elements.navigationBurger?.addEventListener('click', handleBurger);
}

function setupMenu() {
    const device = detectDevice()

    if (device === 'mobile') {
        elements.navigationMenu.classList.add('hidden');
        elements.navigationBurger.classList.remove('hidden');
    }
    else {
        elements.navigationDialog.removeAttribute("open")
        elements.navigationMenu.classList.remove('hidden');
        elements.navigationBurger.classList.add('hidden');
    }
}

function setupCountries() {
    const device = detectDevice()

    if (device === 'mobile') {
        state.visibleCount = 10;
        state.itemsPerLoad = 10;
        renderCountries()
    } else {
        state.visibleCount = 30;
        state.itemsPerLoad = 30;
        renderCountries()
    }
}

function handleBurger() {
    elements.navigationDialog?.setAttribute("open", "true")
}

function handleExpand() {
    state.visibleCount += state.itemsPerLoad;
    renderCountries();
}

function renderCountries() {
    const countriesToShow = multipliedCountries.slice(0, state.visibleCount);

    elements.countriesList.innerHTML = '';

    countriesToShow.forEach(country => {
        const countryElement = createCountryElement(country);
        elements.countriesList.appendChild(countryElement);
    });

    elements.expandBtn.style.display =
        state.visibleCount < multipliedCountries.length ? 'block' : 'none';
}

function createCountryElement(country) {
    const p = document.createElement('p');

    p.innerHTML = `
        <span class="fi fi-${country.short}">
        </span> ${country.title} (${country.count} locations)
    `;

    return p;
}

function renderYear() {
    elements.year.textContent = `© ${new Date().getFullYear().toString()}`
}

const formElements = {
    email: document.getElementById('email'),
    address: document.getElementById('address'),
    restaurantName: document.getElementById('restaurantName'),
}

function formInit() {
    Object.values(formElements).forEach(formElement => formElement.addEventListener("input", handleInput))
}

function setValidity(element) {
    if(!!element.value && !element.classList.contains('valid')) {
        element.classList.add('valid')
        element.classList.remove('invalid')
    } else if (!element.value && !element.classList.contains('invalid')) {
        element.classList.add('invalid')
        element.classList.remove('valid')
    }
}

function updateError(element) {
    const error = document.querySelector(`#${element.id} ~ span.helper__text`)

    if(!!element.value) {
        error.textContent = ''
        error.classList.remove('active')
    } else if (!element.value) {
        error.textContent = '* Required field'
        error?.classList.add('active')
    }
}

function handleInput() {
    Object.values(formElements).forEach(formElement => {
        setValidity(formElement)
        updateError(formElement)
    })
}

function handleSubmit(event) {
    event.preventDefault()

    Object.values(formElements).forEach(formElement => {
        setValidity(formElement)
        updateError(formElement)
    })
}

document.addEventListener('DOMContentLoaded', documentInit);

window.addEventListener('load', windowSetup);
window.addEventListener('resize', windowSetup);