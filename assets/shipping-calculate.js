document.addEventListener('DOMContentLoaded', function () {
  const countries = window.allCountryOptionTags || [];
  const countrySelect = document.getElementById('shipping-country');
  const provinceSelect = document.getElementById('shipping-province');
  const zipInput = document.getElementById('shipping-zip');
  const estimateBtn = document.getElementById('estimate-shipping-btn');
  const resultDiv = document.getElementById('shipping-rates-result');

  // Initially disable the button
  estimateBtn.disabled = true;

  function validateInputs() {
    const country = countrySelect.value;
    const zip = zipInput.value.trim();
    estimateBtn.disabled = !(country && zip);
  }

  countrySelect.addEventListener('change', () => {
    validateInputs();

    fetch(`/meta.json`)
      .finally(() => {
        Shopify.CountryProvinceSelector && new Shopify.CountryProvinceSelector(
          'shipping-country', 'shipping-province',
          { hideElement: 'shipping-province-wrapper' }
        );
      });
  });

  zipInput.addEventListener('input', validateInputs);
  countrySelect.dispatchEvent(new Event('change'));

  estimateBtn.addEventListener('click', function (e) {
    e.preventDefault();

    const country = countrySelect.value;
    const province = provinceSelect.value;
    const zip = zipInput.value.trim();

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
    });
  });
});
