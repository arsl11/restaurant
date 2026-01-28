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

// Global variables
const multipliedCountries = [...countriesData, ...countriesData, ...countriesData, ...countriesData, ...countriesData, ...countriesData];
const root = document.querySelector(':root');
const style = getComputedStyle(root);


// Utility functions
const maxWidth = Number(style.getPropertyValue('--max-width').slice(0, -2));
function detectDevice() {
    const width = window.innerWidth;

    if (width <= maxWidth) return 'mobile';
    return 'desktop';
}

function setValidity(element) {
    if (!!element.value) {
        element.classList.add('valid');
        element.classList.remove('invalid');
    } else if (!element.value) {
        element.classList.add('invalid');
        element.classList.remove('valid');
    }
}

function updateError(element) {
    const error = document.querySelector(`#${element.id} ~ span.helper__text`);

    if (!!element.value) {
        error.textContent = '';
        error.classList.remove('active');
    } else if (!element.value) {
        error.textContent = '* Required field';
        error?.classList.add('active');
    }
}

function throttle(func, wait) {
  let timeout;
  return function() {
    if (!timeout) {
      timeout = setTimeout(() => {
        func.apply(this, arguments);
        timeout = null;
      }, wait);
    }
  };
}

function setupDocument() {
    setupYear();
    setupRequiredInputs();
}

function setupWindow() {
    setupBurgerMenu();
    setupCountries();
    setupSeparators();
}


// Setup burger menu
const navigationDialog = document.getElementById('navigationDialog')

function setupBurgerMenu() {
    const device = detectDevice();
    const navigationMenu = document.getElementById('navigationMenu')
    const navigationBurger = document.getElementById('navigationBurger')

    navigationBurger.addEventListener('click', handleBurger)

    if (device === 'mobile') {
        navigationMenu.classList.add('hidden');
        navigationBurger.classList.remove('hidden');
    }
    else {
        navigationDialog.removeAttribute("open");
        navigationMenu.classList.remove('hidden');
        navigationBurger.classList.add('hidden');
    }
}

function handleBurger() {
    navigationDialog.setAttribute("open", "true");
}


// Setup countries
const countriesState = {
    visibleCountries: 30,
    countriesPerLoad: 30,
};
function setupCountries() {
    const device = detectDevice();

    if (device === 'mobile') {
        countriesState.visibleCountries = 10;
        countriesState.countriesPerLoad = 10;
        renderCountries();
    } else {
        countriesState.visibleCountries = 30;
        countriesState.countriesPerLoad = 30;
        renderCountries();
    }
}

function renderCountries() {
    const countriesList = document.getElementById('countriesList')
    countriesList.innerHTML = '';

    const countriesToShow = multipliedCountries.slice(0, countriesState.visibleCountries);
    countriesToShow.forEach(country => {
        const countryElement = createCountryElement(country);
        countriesList.appendChild(countryElement);
    });

    const expandBtn = document.getElementById("expandBtn")
    expandBtn.addEventListener('click', handleExpand)
    expandBtn.style.display = countriesState.visibleCountries < multipliedCountries.length ? 'block' : 'none';
}

function createCountryElement(country) {
    const p = document.createElement('p');

    p.classList.add(country.short)

    p.innerHTML = `
        <span class="icon"></span> 
        <span class="text">${country.title} (${country.count} locations)</span>
    `;

    return p;
}

function handleExpand() {
    countriesState.visibleCountries += countriesState.countriesPerLoad;
    renderCountries();
}


// Setup separators
const verticalSeparators = document.querySelectorAll('hr:is(.vertical)');
function setupSeparators() {
    const device = detectDevice();

    if (device === 'mobile') {
        verticalSeparators.forEach(verticalSeparator => {
            verticalSeparator.classList.remove('vertical');
            verticalSeparator.classList.add('horizontal');
        });
    } else {
        verticalSeparators.forEach(verticalSeparator => {
            verticalSeparator.classList.remove('horizontal');
            verticalSeparator.classList.add('vertical');
        });
    }
}


// Setup required inputs
function setupRequiredInputs() {
    const requiredInputs = document.querySelectorAll('[required]');
    requiredInputs.forEach(requiredInput => {
        requiredInput.addEventListener("input", () => handleInput(requiredInput));
    });
}

function handleInput(input) {
    setValidity(input);
    updateError(input);
}


// Setup year
function setupYear() {
    const year = document.getElementById('year')
    year.textContent = `© ${new Date().getFullYear().toString()}`;
}


document.addEventListener('DOMContentLoaded', setupDocument);

window.addEventListener('load', setupWindow);
window.addEventListener('resize', throttle(setupWindow, 500));