import './css/styles.css';
import debounce from 'lodash.debounce';
import countries from './fetchCountries';
import Notiflix from 'notiflix';

const inputEl = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfoCard = document.querySelector('.country-info');


const DEBOUNCE_DELAY = 300;

inputEl.addEventListener('input', debounce(onInputChange,DEBOUNCE_DELAY));

function onInputChange(e){
e.preventDefault();

const searchQuery = e.target.value.trim();

if (searchQuery === "") {
    countryInfoCard.innerHTML = "";
    countryList.innerHTML = "";
    return;
}

countries.fetchCountries(searchQuery).then(country => {

    if (country.length >= 11){
        Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
        countryList.innerHTML = "";
        return;
    }

    if (country.length >= 2){
        createList(country);
        countryInfoCard.innerHTML = "";
        return;
    }

    if (country.length === 1){
        createCard(country[0]);
        countryList.innerHTML = "";
        return;
    }

    if (country.status === 404) {
        Notiflix.Notify.failure("Oops, there is no country with that name");
        countryList.innerHTML = "";
        countryInfoCard.innerHTML = "";
    }     

});
};

function createCard(country){
    const allLanguage = Object.values(country.languages);
    const markup = `<h2><img src='${country.flags.svg}' alt='flag' width='30' class='country-flag'/>${country.name.common}</h2>
    <p>Capital: ${country.capital}</p>
    <p>Population: ${country.population}</p>
    <p>Languages: ${allLanguage}</p>
    `;
    
    countryInfoCard.innerHTML = markup;
}

function createList(country){
    const list = country.map(name =>
    `<li class='list-elem'>
    <p><img src='${name.flags.svg}' alt='flag' width='30' class='country-flag'/>${name.name.common}<p>
    </li>`).join('');
    countryList.innerHTML = list;
}


