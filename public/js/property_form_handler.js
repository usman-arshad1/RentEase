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
// const provinceStateSelect = document.getElementById('provinceState');
//
// updateProvinceStateOptions();

countrySelect.addEventListener('change', updateProvinceStateOptions);

// /**
//  * Updates the options of the province/state
//  * select element based on the selected country.
//  *
//  * @return {void}
//  */
// function updateProvinceStateOptions() {
//   const selectedCountry = countrySelect.value;
//   provinceStateSelect.innerHTML = '';
//
//   if (selectedCountry === 'USA') {
//     provinceStateSelect.innerHTML = usaStates.join('');
//   } else if (selectedCountry === 'Canada') {
//     provinceStateSelect.innerHTML = canadaProvinces.join('');
//   }
// }


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

// For 'Add Property' form
const countrySelectAdd = document.getElementById('country');
if (countrySelectAdd) {
  const provinceStateSelectAdd = document.getElementById('provinceState');
  countrySelectAdd.addEventListener('change', () =>
    updateProvinceStateOptions(countrySelectAdd, provinceStateSelectAdd),
  );

  // Call it once initially to populate options based on initial country value
  updateProvinceStateOptions(countrySelectAdd, provinceStateSelectAdd);
}

// Event listener for 'Update Property' modal
document.addEventListener('DOMContentLoaded', function() {
  // Handles country change for both Add and Update modals
  // eslint-disable-next-line max-len
  document.querySelectorAll('select[name="country"]').forEach((countrySelect) => {
    countrySelect.addEventListener('change', function() {
      // eslint-disable-next-line max-len
      const provinceStateSelect = this.closest('form').querySelector('select[name="provinceState"]');
      updateProvinceStateOptions(this, provinceStateSelect);
    });
  });

  // eslint-disable-next-line max-len
  // Initializes province/state options based on the default country selection for the Update modal
  // This function needs to be called when the Update modal is shown
  $('#updatePropertyModal').on('show.bs.modal', function(event) {
    const button = $(event.relatedTarget); // Button that triggered the modal
    const property = button.data('property'); // Extract property data
    populateForm(property); // Populate form with property data

    const countrySelectUpdate = this.querySelector('select[name="country"]');
    const provinceStateSelectUpdate = this
        .querySelector('select[name="provinceState"]');
    updateProvinceStateOptions(countrySelectUpdate, provinceStateSelectUpdate);
  });
});
// eslint-disable-next-line max-len,require-jsdoc
function updateProvinceStateOptions(countrySelect, provinceStateSelect, provinceStateValue = null) {
  const selectedCountry = countrySelect.value;
  provinceStateSelect.innerHTML = '';

  const options = selectedCountry === 'USA' ? usaStates : canadaProvinces;
  provinceStateSelect.innerHTML = options.join('');

  if (provinceStateValue) {
    provinceStateSelect.value = provinceStateValue;
  }
}

// eslint-disable-next-line require-jsdoc,no-unused-vars
function populateForm(propertyJson) {
  const property = JSON.parse(propertyJson);
  const modal = document.getElementById('updatePropertyModal');

  modal.querySelector('input[name="unit"]').value = property.unit;
  modal.querySelector('input[name="street"]').value = property.street;
  modal.querySelector('input[name="city"]').value = property.city;

  const countrySelect = modal.querySelector('select[name="country"]');
  countrySelect.value = property.country;

  const provinceStateSelect = modal
      .querySelector('select[name="provinceState"]');
  // eslint-disable-next-line max-len
  modal.querySelector('form').action = '/landlord-properties/update/' + property.property_id;

  updateProvinceStateOptions(countrySelect,
      provinceStateSelect,
      property.province_state);
}
