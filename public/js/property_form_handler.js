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
document.addEventListener('DOMContentLoaded', function() {
  // Initialization and Event Binding for Country Selectors
  document.querySelectorAll('.country-selector').forEach((countrySelect) => {
    updateProvinceStateOptionsBasedOnCountry(countrySelect,
        countrySelect.closest('form')
            .querySelector('.province-state-selector'));

    // Update province/state options when the country selection changes
    countrySelect.addEventListener('change', function() {
      updateProvinceStateOptionsBasedOnCountry(this,
          this.closest('form')
              .querySelector('.province-state-selector'));
    });
  });

  // Validation for input fields
  document.querySelectorAll('input').forEach((input) => {
    input.addEventListener('input', function() {
      validateInput(this);
    });
  });

  // Submit button handling for forms
  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', function(e) {
      disableSubmitButton(this);
    });
  });
});

// Updates the province/state options based on the selected country
// eslint-disable-next-line max-len
function updateProvinceStateOptionsBasedOnCountry(countrySelect, provinceStateSelect, callback) {
  const selectedCountry = countrySelect.value;
  provinceStateSelect.innerHTML =
      selectedCountry === 'USA' ? usaStates.join('') : canadaProvinces.join('');

  if (typeof callback === 'function') {
    callback();
  }
}


// Validates an input field and sets custom validity messages
function validateInput(input) {
  if (input.id === 'city' || input.id ==='street') {
    if (input.value.trim() ==='') {
      input.setCustomValidity('Field cannot be empty');
    } else if (input.validity.patternMismatch) {
      input.setCustomValidity('No special characters allowed');
    } else if (input.value.length > 50) {
      input.setCustomValidity('Input must be less than 50 characters');
    } else {
      input.setCustomValidity('');
    }
  }
}

// Disables the submit button to prevent multiple submissions
function disableSubmitButton(form) {
  const submitButton = form.querySelector('[type="submit"]');
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.value = 'Submitting...';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const updateModal = document.getElementById('updatePropertyModal');
  if (updateModal) {
    updateModal.addEventListener('show.bs.modal', function(event) {
      const button = event.relatedTarget;
      const property = JSON.parse(button.getAttribute('data-property'));
      const propertyId = button.getAttribute('data-property-id');

      const form = updateModal.querySelector('form');
      form
          .setAttribute('action',
              '/landlord-properties/update/' + propertyId);
      // Populate the form fields
      form.elements['unit'].value = property.unit;
      form.elements['street'].value = property.street;
      form.elements['city'].value = property.city;
      form.elements['country'].value = property.country;

      updateProvinceStateOptionsBasedOnCountry(form.elements['country'],
          form.querySelector('.province-state-selector'), function() {
            form.elements['provinceState'].value = property.province_state;
          });
    });
  } else {
    console.error('Modal element not found: #updatePropertyModal');
  }
});




// const countrySelect = document.getElementById('country');
// countrySelect.addEventListener('change', updateProvinceStateOptions);
//
// /**
//  * Sets custom validity messages for input fields with id 'city' or 'street'
//  *
//  * @param {HTMLInputElement} input - The input element to validate
//  *
//  * @return {void}
//  */
// function invalidInput(input) {
//   if (input.id === 'city' || input.id ==='street') {
//     if (input.value.trim() ==='') {
//       input.setCustomValidity('Field cannot be empty');
//     } else if (input.validity.patternMismatch) {
//       input.setCustomValidity('No special characters allowed');
//     } else if (input.value.length > 50) {
//       input.setCustomValidity('Input must be less than 100 characters');
//     } else {
//       input.setCustomValidity('');
//     }
//   }
// }
//
//
// // eslint-disable-next-line no-unused-vars,require-jsdoc
// function validateInput(input) {
//   invalidInput(input);
// }
//
// // eslint-disable-next-line no-unused-vars,require-jsdoc
// function disableSubmitButton() {
//   document.getElementById('submit').disabled = true;
//   document.getElementById('submit').value = 'Submitting...';
// }
//
// // For 'Add Property' form
// const countrySelectAdd = document.getElementById('country');
// if (countrySelectAdd) {
//   const provinceStateSelectAdd = document.getElementById('provinceState');
//   countrySelectAdd.addEventListener('change', () =>
//     updateProvinceStateOptions(countrySelectAdd, provinceStateSelectAdd),
//   );
//
//   // Call it once initially to populate options based on initial country value
//   updateProvinceStateOptions(countrySelectAdd, provinceStateSelectAdd);
// }
//
// // eslint-disable-next-line max-len,require-jsdoc
// document.addEventListener('DOMContentLoaded', function() {
//   // Initialization and Event Binding for Country Selectors
//   document.querySelectorAll('.country-selector').forEach(countrySelect => {
//     updateProvinceStateOptions(countrySelect, countrySelect.closest('form').querySelector('.province-state-selector'));
//
//     // On country change, update province/state options
//     countrySelect.addEventListener('change', function() {
//       updateProvinceStateOptions(this, this.closest('form').querySelector('.province-state-selector'));
//     });
//   });
// });
//
// function updateProvinceStateOptions(countrySelect, provinceStateSelect) {
//   const selectedCountry = countrySelect.value;
//   let optionsHtml = '';
//
//   if (selectedCountry === 'USA') {
//     optionsHtml = usaStates.join('');
//   } else if (selectedCountry === 'Canada') {
//     optionsHtml = canadaProvinces.join('');
//   }
//
//   provinceStateSelect.innerHTML = optionsHtml;
// }
//
// $('#updatePropertyModal').on('show.bs.modal', function(event) {
//   const button = event.relatedTarget;
//   const property = JSON.parse(button.getAttribute('data-property')); // Make sure data-property is correctly set on the button
//
//   const form = this.querySelector('form');
//   const countrySelect = form.querySelector('.country-selector');
//   const provinceStateSelect = form.querySelector('.province-state-selector');
//
//   // Populate form fields...
//   countrySelect.value = property.country;
//   updateProvinceStateOptions(countrySelect, provinceStateSelect);
//
//   provinceStateSelect.value = property.province_state; // This should be after updating options
// });
//
// // eslint-disable-next-line require-jsdoc,no-unused-vars
// // Function to populate the Update Property form with existing property values
// function populateForm(propertyJson) {
//   const property = JSON.parse(propertyJson);
//   const modal = $('#updatePropertyModal');
//
//   modal.find('input[name="unit"]').val(property.unit);
//   modal.find('input[name="street"]').val(property.street);
//   modal.find('input[name="city"]').val(property.city);
//   modal.find('select[name="provinceState"]').val(property.province_state);
//   modal.find('select[name="country"]').val(property.country);
//
//   // Update the form's action attribute if needed
//   modal.find('form').attr('action', '/landlord-properties/update/' + property.property_id);
//
//   // Call the function to update province/state options based on the country
//   updateProvinceStateOptions(
//     modal.find('select[name="country"]')[0],
//     modal.find('select[name="provinceState"]')[0],
//     property.province_state,
//   );
// }
//
//
