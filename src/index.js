import './css/styles.css';

import { debounce } from 'lodash';
import { Notify } from 'notiflix';

import RenderService from './render.js';
import Country from './api/fetchCountries.js';

const DEBOUNCE_DELAY = 300

const inputField = document.querySelector('#search-box')

const countryAPI = new Country()
const renderService = new RenderService()

inputField.addEventListener('input', debounce(() => {
  
  let inputValue = inputField.value.trim()
  countryAPI.query = inputValue
  const minLetter = inputValue.length

  if (minLetter >= 1) {
    countryAPI.fetchCountry()
      .then(countrysArray => {

          if (countrysArray.length >= 10) {
            
            return Notify.info('Too many matches found. Please enter a more specific name')
              
        } else if (countrysArray.length === 1) {
          console.log(countrysArray)

          renderService.renderCountryInfo(countrysArray)

        } else if (countrysArray.length < 10 && countrysArray.length >= 2) {

          renderService.renderCountryList(countrysArray)
        } else {
          return Notify.failure('Oops, there is no country with that name')
        }
      })
      .catch(error => console.log(error))

  } else if (minLetter === 0) {
    renderService.clearList()
  }
    }, DEBOUNCE_DELAY))