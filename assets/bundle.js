document.addEventListener('DOMContentLoaded', function () {
    const BUNDLE_LIMIT = 3;
    function updateItemRange() {
      const currentBundle = JSON.parse(localStorage.getItem('bundleList')) || [];
      const itemRangeValue = (currentBundle.length / BUNDLE_LIMIT) * 100;
      // Get the #item-range div and update its --item-range CSS variable
      const itemRangeDiv = document.getElementById('item-range');
      itemRangeDiv.style.setProperty('--item-range', `${itemRangeValue}%`);
    }
    // Initial load of the page
    updateItemRange();
    const buttons = document.querySelectorAll('.add-to-bundle')
    // Add to Bundle button handler
    document.querySelectorAll('.add-to-bundle').forEach((button) => {
      button.addEventListener('click', function () {
        if (this.getAttribute('data-disabled') === 'true') {
        return; // Prevent action if button is marked as disabled
      }
        const productElem = this.closest('.product');
        const productId = productElem.querySelector('.product-variant-id').value;
        const productTitle = productElem.dataset.title;
        const productPrice = parseFloat(productElem.querySelector('.product-price').textContent.replace(/[^0-9.-]+/g, ""));
        const productImage = productElem.querySelector('img') ? productElem.querySelector('img').src : null;
        const variantSelect = productElem.querySelector('.variant-select');
        const variantGroups = productElem.querySelectorAll('.variant-group');
          let selectedVariants = [];
          // Loop through each variant group (size, color, etc.)
          variantGroups.forEach((group) => {
            const groupName = group.querySelector('.variant-group-name').textContent.trim();  // e.g., "Size" or "Color"
            const selectedOption = group.querySelector('input:checked');  // Get the selected radio button
            
            if (selectedOption) {
              const selectedValue = selectedOption.value;  // e.g., "M" for size, "Red" for color
              selectedVariants.push(`${groupName} ${selectedValue}`);  // Format: "Size M", "Color Red"
            }
          });
          // console.log(selectedVariants)
        const quantityInput = productElem.querySelector('.quantity-input');
        const quantity = quantityInput ? parseInt(quantityInput.value, 10) : 1;
        // Create bundle item object
        const bundleItem = {
          id: productId,
          title: productTitle,
          price: productPrice,
          image: productImage,
          quantity: quantity,
          selectedVariants: selectedVariants,
        };
        // Add to localStorage
        const currentBundle = JSON.parse(localStorage.getItem('bundleList')) || [];
        currentBundle.push(bundleItem);
        localStorage.setItem('bundleList', JSON.stringify(currentBundle));

        this.disabled = true;

        updateItemRange();
        // Update Bundle List
        updateBundleList();
      });
    });
    // Remove Item from Bundle List
    function removeItemFromBundle(itemId) {
      const currentBundle = JSON.parse(localStorage.getItem('bundleList')) || [];
      const updatedBundle = currentBundle.filter((item) => item.id !== itemId);
      localStorage.setItem('bundleList', JSON.stringify(updatedBundle));
      // Enable "Add to Bundle" button for the removed item
      const addButtons = document.querySelectorAll('.add-to-bundle');
      addButtons.forEach((button) => {
        const productElem = button.closest('.product');
        const productId = productElem.querySelector('.product-variant-id').value;
        if (productId === itemId) {
          button.classList.remove('disabled');
          button.removeAttribute('data-disabled');
          button.disabled = false; // Ensure it's enabled
        }
      });

      updateItemRange();
      updateBundleList();
    }
    // Update quantity in the Bundle List
    function updateQuantity(itemId, quantity) {
      const currentBundle = JSON.parse(localStorage.getItem('bundleList')) || [];
      const itemIndex = currentBundle.findIndex((item) => item.id === itemId);
      if (itemIndex !== -1) {
        currentBundle[itemIndex].quantity = quantity;
        localStorage.setItem('bundleList', JSON.stringify(currentBundle));
        updateBundleList();
      }
    }
    // Calculate the total price of the bundle
    function calculateTotalPrice() {
      const currentBundle = JSON.parse(localStorage.getItem('bundleList')) || [];
      let totalPrice = 0;
      currentBundle.forEach((item) => {
        totalPrice += item.quantity * item.price;
      });
      return totalPrice;
    }
    // Update Bundle List UI
    function updateBundleList() {
      const bundleListElem = document.getElementById('bundle-items');
      bundleListElem.innerHTML = ''; // Clear the list
      const currentBundle = JSON.parse(localStorage.getItem('bundleList')) || [];
      let currencySymbol = window.currencySymbol || "$";
      currentBundle.forEach((item) => {
        const listItemHTML = `
          <li class="flex added-item" data-id="${item.id}">
            <div class="item-thumb"><img src="${item.image}" alt="${item.title}"></div>
            <div class="item-product-info">
              <h5 class="item-title">${item.title}</h5>
              ${item.selectedVariants.map(variant => {
          const [optionName, optionValue] = variant.split(' ');
          return `<p class="selected-variants">${optionName}: ${optionValue}</p>`;
        }).join('')}
              <p> 
              ${currencySymbol + item.price.toFixed(2)}</p>
              <div class="item-info-bottom flex align-items-center">
                <div class="item-info-btns grid">
                  <button class="minus-btn">-</button>
                  <input type="text" class="quantity-input" value="${item.quantity}">
                  <button class="plus-btn">+</button>
                </div>
                  <button class="remove-btn btn-line">Remove</button>
              </div>
            </div>
          </li>
        `;
        bundleListElem.insertAdjacentHTML('beforeend', listItemHTML);
          //Check & Disable Add-to-Bundle Buttons After Page Load
          const addButtons = document.querySelectorAll('.add-to-bundle');
          addButtons.forEach((button) => {
            const productElem = button.closest('.product');
            const productId = productElem.querySelector('.product-variant-id').value;

            if (currentBundle.some(item => item.id === productId)) {
              button.classList.add('disabled');
              button.setAttribute('data-disabled', 'true');
              button.disabled = true; // Ensure it's disabled
            } else {
              button.classList.remove('disabled');
              button.removeAttribute('data-disabled');
              button.disabled = false; // Ensure it's enabled
            }
          });
        // Add event listeners for quantity and remove buttons
        const listItem = bundleListElem.lastElementChild;
        const minusButton = listItem.querySelector('.minus-btn');
        const plusButton = listItem.querySelector('.plus-btn');
        const quantityInput = listItem.querySelector('.quantity-input');
        const removeButton = listItem.querySelector('.remove-btn');
        minusButton.addEventListener('click', function () {
          if (item.quantity > 1) {
            item.quantity--;
            updateQuantity(item.id, item.quantity);
          }
        });
        plusButton.addEventListener('click', function () {
          item.quantity++;
          updateQuantity(item.id, item.quantity);
        });
        quantityInput.addEventListener('change', function () {
          const newQuantity = parseInt(quantityInput.value, 10);
          if (!isNaN(newQuantity) && newQuantity > 0) {
            updateQuantity(item.id, newQuantity);
          }
        });
        removeButton.addEventListener('click', function () {
          removeItemFromBundle(item.id);
        });
      });
        // Add placeholders if needed
        const placeholdersNeeded = BUNDLE_LIMIT - currentBundle.length;
        for (let i = 0; i < placeholdersNeeded; i++) {
          const placeholderHTML = `
            <li class="flex align-items-center">
              <div class="item-thumb placeholder">
                  <span class="activity"></span>
              </div>
              <div class="item-product-info">
                <div class="placeholder">
                  <span class="activity"></span>
                </div>
                <div class="placeholder">
                  <span class="activity"></span>
                </div>
              </div>
          </li>
          `;
          bundleListElem.insertAdjacentHTML('beforeend', placeholderHTML);
        }
      // Disable all "Add to Bundle" buttons if limit is reached
      const addButtons = document.querySelectorAll('.add-to-bundle');
      addButtons.forEach((button) => {
        const productElem = button.closest('.product');
        const productId = productElem.dataset.id;
        // Disable the button if the limit is reached or if the product is already in the bundle
        if (currentBundle.length >= BUNDLE_LIMIT || currentBundle.some(item => item.id === productId)) {
          button.classList.add('disabled'); // Add a visual "disabled" style
          button.setAttribute('data-disabled', 'true'); // Custom attribute to track the disabled state
        } else {
          button.classList.remove('disabled'); // Remove the visual "disabled" style
          button.removeAttribute('data-disabled'); // Remove the custom attribute
        }
      });
      // Update Total Price of the Bundle
      const totalPrice = calculateTotalPrice();
      const totalPriceElem = document.getElementById('bundle-total');
      totalPriceElem.textContent = `${currencySymbol + totalPrice.toFixed(2)}`;
    }
      // Initial Load
      updateBundleList();
    });
    document.querySelector(".add-to-cart").addEventListener("click", function () {
          let items = [];
          document.querySelectorAll(".added-item").forEach(item => {
              let variantId = item.getAttribute("data-id");
              let quantity = parseInt(item.querySelector(".quantity-input").value);
              items.push({
                  id: variantId,
                  quantity: quantity
              });
          });
          if (items.length > 0) {
              fetch('/cart/add.js', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ items: items })
              })
              .then(response => response.json())
              .then(data => {
                  console.log("Added to cart:", data);
                  window.location.href = '/cart'; // Redirect to cart page
              })
              .catch(error => console.error("Error adding to cart:", error));
          }
      });
