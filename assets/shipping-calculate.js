// document.addEventListener('DOMContentLoaded', function () {
//   const countries = window.allCountryOptionTags || [];
//   const countrySelect = document.getElementById('shipping-country');
//   const provinceSelect = document.getElementById('shipping-province');
//   const zipInput = document.getElementById('shipping-zip');
//   const estimateBtn = document.getElementById('estimate-shipping-btn');
//   const resultDiv = document.getElementById('shipping-rates-result');

//   // Initially disable the button
//   estimateBtn.disabled = true;

//   function validateInputs() {
//     const country = countrySelect.value;
//     const zip = zipInput.value.trim();
//     estimateBtn.disabled = !(country && zip);
//   }

//   countrySelect.addEventListener('change', () => {
//     validateInputs();

//     fetch(`/meta.json`)
//       .finally(() => {
//         Shopify.CountryProvinceSelector && new Shopify.CountryProvinceSelector(
//           'shipping-country', 'shipping-province',
//           { hideElement: 'shipping-province-wrapper' }
//         );
//       });
//   });

//   zipInput.addEventListener('input', validateInputs);
//   countrySelect.dispatchEvent(new Event('change'));

//   estimateBtn.addEventListener('click', function (e) {
//     e.preventDefault();

//     const country = countrySelect.value;
//     const province = provinceSelect.value;
//     const zip = zipInput.value.trim();

//     resultDiv.classList.add("shipping-result-show");
//     resultDiv.textContent = 'Loading shipping rates...';

//     const data = new URLSearchParams();
//     data.append('shipping_address[country]', country);
//     if (province) data.append('shipping_address[province]', province);
//     data.append('shipping_address[zip]', zip);

//     fetch('/cart/shipping_rates.json', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded'
//       },
//       body: data.toString()
//     })
//     .then(response => response.json())
//     .then(data => {
//       if (data.shipping_rates?.length > 0) {
//         const ratesHtml = data.shipping_rates.map(rate =>
//           `<div class="rate-item"><strong>${rate.name}</strong>: ${rate.price} ${rate.currency}</div>`
//         ).join('');
//         resultDiv.innerHTML = `<p>Available Shipping Rates:</p>${ratesHtml}`;
//         resultDiv.classList.add("shipping-result-success");
//       } else {
//         resultDiv.textContent = 'No shipping rates available for this location.';
//         resultDiv.classList.add("shipping-result-error");
//       }
//     })
//     .catch(() => {
//       resultDiv.textContent = 'Error fetching shipping rates.';
//     });
//   });
// });
document.addEventListener('DOMContentLoaded', function () {
  const countries = window.allCountryOptionTags || [];

  // Reusable function to initialize a single shipping estimator
  function initializeShippingEstimator(containerElement) {
    const countrySelect = containerElement.querySelector('.shipping-country-select');
    const provinceSelect = containerElement.querySelector('.shipping-province-select');
    const zipInput = containerElement.querySelector('.shipping-zip-input');
    const estimateBtn = containerElement.querySelector('.estimate-shipping-btn');
    const resultDiv = containerElement.querySelector('.shipping-rates-result');
    const provinceWrapper = containerElement.querySelector('.shipping-province-wrapper'); // Get the wrapper for hiding

    // Initially disable the button for this instance
    estimateBtn.disabled = true;

    function validateInputs() {
      const country = countrySelect.value;
      const zip = zipInput.value.trim();
      estimateBtn.disabled = !(country && zip);
    }

    countrySelect.addEventListener('change', () => {
      validateInputs();

      // IMPORTANT: Shopify.CountryProvinceSelector needs unique IDs for its elements.
      // Make sure the countrySelect and provinceSelect have unique IDs in your HTML
      // for this to work correctly when you have multiple instances.
      // The hideElement option now targets the provinceWrapper element unique to this instance.
      fetch(`/meta.json`)
        .finally(() => {
          if (Shopify.CountryProvinceSelector) {
            new Shopify.CountryProvinceSelector(
              countrySelect.id, // Use the unique ID of the country select
              provinceSelect.id, // Use the unique ID of the province select
              { hideElement: provinceWrapper.id } // Use the unique ID of the province wrapper
            );
          }
        });
    });

    zipInput.addEventListener('input', validateInputs);

    // Trigger initial validation and province setup when the page loads
    // For off-canvas elements, this might need to be called when the off-canvas opens
    // For now, we'll dispatch the change event to set up initial state
    countrySelect.dispatchEvent(new Event('change'));

    estimateBtn.addEventListener('click', function (e) {
      e.preventDefault();

      const country = countrySelect.value;
      const province = provinceSelect.value;
      const zip = zipInput.value.trim();

      resultDiv.classList.remove("shipping-result-success", "shipping-result-error"); // Clear previous states
      resultDiv.classList.add("shipping-result-show");
      resultDiv.textContent = 'Loading shipping rates...';

      const data = new URLSearchParams();
      data.append('shipping_address[country]', country);
      if (province) data.append('shipping_address[province]', province);
      data.append('shipping_address[zip]', zip);

      fetch('/cart/shipping_rates.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: data.toString()
      })
      .then(response => response.json())
      .then(data => {
        if (data.shipping_rates?.length > 0) {
          const ratesHtml = data.shipping_rates.map(rate =>
            `<div class="rate-item"><strong>${rate.name}</strong>: ${rate.price} ${rate.currency}</div>`
          ).join('');
          resultDiv.innerHTML = `<p>Available Shipping Rates:</p>${ratesHtml}`;
          resultDiv.classList.add("shipping-result-success");
        } else {
          resultDiv.textContent = 'No shipping rates available for this location.';
          resultDiv.classList.add("shipping-result-error");
        }
      })
      .catch(() => {
        resultDiv.textContent = 'Error fetching shipping rates.';
        resultDiv.classList.add("shipping-result-error"); // Add error class on fetch error
      });
    });
  }

  // Find all shipping estimator containers on the page
  const estimatorContainers = document.querySelectorAll('.shipping-estimator-container');

  // Initialize each estimator
  estimatorContainers.forEach(container => {
    initializeShippingEstimator(container);
  });
});

// Ensure window.allCountryOptionTags is still available globally
// <script>window.allCountryOptionTags = {{ all_country_option_tags | json }};</script>
// This should be placed in your theme.liquid or a common file that loads before shipping-calculate.js