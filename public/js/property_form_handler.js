const usaStates = [
  '<option value="AL">Alabama</option>',
  '<option value="AK">Alaska</option>',
  '<option value="AZ">Arizona</option>',
  '<option value="AR">Arkansas</option>',
  '<option value="CA">California</option>',
  '<option value="CO">Colorado</option>',
  '<option value="CT">Connecticut</option>',
  '<option value="DE">Delaware</option>',
  '<option value="DC">District Of Columbia</option>',
  '<option value="FL">Florida</option>',
  '<option value="GA">Georgia</option>',
  '<option value="HI">Hawaii</option>',
  '<option value="ID">Idaho</option>',
  '<option value="IL">Illinois</option>',
  '<option value="IN">Indiana</option>',
  '<option value="IA">Iowa</option>',
  '<option value="KS">Kansas</option>',
  '<option value="KY">Kentucky</option>',
  '<option value="LA">Louisiana</option>',
  '<option value="ME">Maine</option>',
  '<option value="MD">Maryland</option>',
  '<option value="MA">Massachusetts</option>',
  '<option value="MI">Michigan</option>',
  '<option value="MN">Minnesota</option>',
  '<option value="MS">Mississippi</option>',
  '<option value="MO">Missouri</option>',
  '<option value="MT">Montana</option>',
  '<option value="NE">Nebraska</option>',
  '<option value="NV">Nevada</option>',
  '<option value="NH">New Hampshire</option>',
  '<option value="NJ">New Jersey</option>',
  '<option value="NM">New Mexico</option>',
  '<option value="NY">New York</option>',
  '<option value="NC">North Carolina</option>',
  '<option value="ND">North Dakota</option>',
  '<option value="OH">Ohio</option>',
  '<option value="OK">Oklahoma</option>',
  '<option value="OR">Oregon</option>',
  '<option value="PA">Pennsylvania</option>',
  '<option value="RI">Rhode Island</option>',
  '<option value="SC">South Carolina</option>',
  '<option value="SD">South Dakota</option>',
  '<option value="TN">Tennessee</option>',
  '<option value="TX">Texas</option>',
  '<option value="UT">Utah</option>',
  '<option value="VT">Vermont</option>',
  '<option value="VA">Virginia</option>',
  '<option value="WA">Washington</option>',
  '<option value="WV">West Virginia</option>',
  '<option value="WI">Wisconsin</option>',
  '<option value="WY">Wyoming</option>',
];

const canadaProvinces = [
  '<option value="AB">Alberta</option>',
  '<option value="BC">British Columbia</option>',
  '<option value="MB">Manitoba</option>',
  '<option value="NB">New Brunswick</option>',
  '<option value="NL">Newfoundland and Labrador</option>',
  '<option value="NS">Nova Scotia</option>',
  '<option value="ON">Ontario</option>',
  '<option value="PE">Prince Edward Island</option>',
  '<option value="QC">Quebec</option>',
  '<option value="SK">Saskatchewan</option>',
  '<option value="NT">Northwest Territories</option>',
  '<option value="NU">Nunavut</option>',
  '<option value="YT">Yukon</option>',
];
const countrySelect = document.getElementById('country');
const provinceStateSelect = document.getElementById('provinceState');

updateProvinceStateOptions();

countrySelect.addEventListener('change', updateProvinceStateOptions);

/**
 * Updates the options of the province/state
 * select element based on the selected country.
 *
 * @return {void}
 */
function updateProvinceStateOptions() {
  const selectedCountry = countrySelect.value;
  provinceStateSelect.innerHTML = '';

  if (selectedCountry === 'USA') {
    provinceStateSelect.innerHTML = usaStates.join('');
  } else if (selectedCountry === 'Canada') {
    provinceStateSelect.innerHTML = canadaProvinces.join('');
  }
}

/**
 * Sets custom validity messages for input fields with id 'city' or 'street'
 *
 * @param {HTMLInputElement} input - The input element to validate
 *
 * @return {void}
 */
function invalidInput(input) {
  if (input.id === 'city' || input.id ==='street') {
    if (input.value.trim() ==='') {
      input.setCustomValidity('Field cannot be empty');
    } else if (input.validity.patternMismatch) {
      input.setCustomValidity('No special characters allowed');
    } else if (input.value.length > 50) {
      input.setCustomValidity('Input must be less than 100 characters');
    } else {
      input.setCustomValidity('');
    }
  }
}


// eslint-disable-next-line no-unused-vars,require-jsdoc
function validateInput(input) {
  invalidInput(input);
}

// eslint-disable-next-line no-unused-vars,require-jsdoc
function disableSubmitButton() {
  document.getElementById('submit').disabled = true;
  document.getElementById('submit').value = 'Submitting...';
}
