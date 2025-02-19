class BundleManager extends HTMLElement {
  constructor() {
    super();
    this.BUNDLE_LIMIT = 3;
    this.currencySymbol = window.currencySymbol || "$";
    this.bundleItems = JSON.parse(localStorage.getItem('bundleList')) || [];
    this.bundleListElem = this.querySelector('#bundle-items');
    this.totalPriceDiv = this.querySelector('#bundle-total');
    this.itemRangeDiv = this.querySelector('#item-range');
    this.addToCartButton = this.querySelector(".add-to-cart");

    this.renderBundleList();
    this.updateItemRange();

    this.addToCartButton.addEventListener("click", () => this.handleAddToCart());
  }

  connectedCallback() {
    document.addEventListener('click', (event) => {
      if (event.target.classList.contains('add-to-bundle')) {
        this.handleAddToBundle(event.target);
      }
    });
  }

  handleAddToBundle(button) {
    if (button.getAttribute('data-disabled') === 'true') return;

    const productElem = button.closest('.product');
    const productId = productElem.querySelector('.product-variant-id').value;
    const productTitle = productElem.dataset.title;
    const productPrice = parseFloat(productElem.querySelector('.product-price').textContent.replace(/[^0-9.-]+/g, ""));
    const productImage = productElem.querySelector('.featured-image')?.src;
    const variantGroups = productElem.querySelectorAll('.variant-group');
    let selectedVariants = [];

    variantGroups.forEach((group) => {
      const groupName = group.querySelector('.variant-group-name').textContent.trim();
      const selectedOption = group.querySelector('input:checked');
      if (selectedOption) {
        const selectedValue = selectedOption.value;
        selectedVariants.push(`${groupName} ${selectedValue}`);
      }
    });

    const quantityInput = productElem.querySelector('.quantity-input');
    const quantity = quantityInput ? parseInt(quantityInput.value, 10) : 1;

    const bundleItem = {
      id: productId,
      title: productTitle,
      price: productPrice,
      image: productImage,
      quantity: quantity,
      selectedVariants: selectedVariants,
    };

    this.bundleItems.push(bundleItem);
    this.saveBundleToLocalStorage();
    this.renderBundleList();
    this.updateItemRange();

    button.disabled = true;
    button.classList.add('disabled');
    button.setAttribute('data-disabled', 'true');
  }

  removeItem(itemId) {
    this.bundleItems = this.bundleItems.filter(item => item.id !== itemId);
    this.saveBundleToLocalStorage();
    this.renderBundleList();
    this.updateItemRange();

    const addButtons = document.querySelectorAll('.add-to-bundle');
    addButtons.forEach(button => {
      const productElem = button.closest('.product');
      const productId = productElem.querySelector('.product-variant-id').value;
      if (productId === itemId) {
        button.classList.remove('disabled');
        button.removeAttribute('data-disabled');
        button.disabled = false;
      }
    });
  }

  updateQuantity(itemId, quantity) {
    const itemIndex = this.bundleItems.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
      this.bundleItems[itemIndex].quantity = quantity;
      this.saveBundleToLocalStorage();
      this.renderBundleList();
      this.updateItemRange();
    }
  }

  calculateTotalPrice() {
    return this.bundleItems.reduce((total, item) => total + item.quantity * item.price, 0);
  }

  saveBundleToLocalStorage() {
    localStorage.setItem('bundleList', JSON.stringify(this.bundleItems));
  }

  renderBundleList() {
    this.addToCartButton.disabled = this.bundleItems.length < this.BUNDLE_LIMIT;
    this.bundleListElem.innerHTML = '';

    this.bundleItems.forEach(item => {
      const listItemHTML = `
        <li class="flex added-item" data-id="${item.id}">
          <div class="item-thumb"><img src="${item.image}" alt="${item.title}"></div>
          <div class="item-product-info">
            <h5 class="item-title">${item.title}</h5>
            ${item.selectedVariants.map(variant => `<p class="selected-variants">${variant}</p>`).join('')}
            <p>${this.currencySymbol + item.price.toFixed(2)}</p>
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
      this.bundleListElem.insertAdjacentHTML('beforeend', listItemHTML);

      const listItem = this.bundleListElem.lastElementChild;
      const minusButton = listItem.querySelector('.minus-btn');
      const plusButton = listItem.querySelector('.plus-btn');
      const quantityInput = listItem.querySelector('.quantity-input');
      const removeButton = listItem.querySelector('.remove-btn');

      minusButton.addEventListener('click', () => {
        if (item.quantity > 1) {
          this.updateQuantity(item.id, --item.quantity);
        }
      });

      plusButton.addEventListener('click', () => {
        this.updateQuantity(item.id, ++item.quantity);
      });

      quantityInput.addEventListener('change', () => {
        const newQuantity = parseInt(quantityInput.value, 10);
        if (!isNaN(newQuantity) && newQuantity > 0) {
          this.updateQuantity(item.id, newQuantity);
        }
      });

      removeButton.addEventListener('click', () => {
        this.removeItem(item.id);
      });
    });

    const placeholdersNeeded = this.BUNDLE_LIMIT - this.bundleItems.length;
    for (let i = 0; i < placeholdersNeeded; i++) {
      const placeholderHTML = `
        <li class="flex align-items-center">
          <div class="item-thumb placeholder"><span class="activity"></span></div>
          <div class="item-product-info">
            <div class="placeholder"><span class="activity"></span></div>
            <div class="placeholder"><span class="activity"></span></div>
          </div>
        </li>
      `;
      this.bundleListElem.insertAdjacentHTML('beforeend', placeholderHTML);
    }

    const addButtons = document.querySelectorAll('.add-to-bundle');
    addButtons.forEach(button => {
      const productElem = button.closest('.product');
      const productId = productElem.querySelector('.product-variant-id').value;
      const isDisabled = this.bundleItems.length >= this.BUNDLE_LIMIT || this.bundleItems.some(item => item.id === productId);
      button.classList.toggle('disabled', isDisabled);
      button.setAttribute('data-disabled', isDisabled);
      button.disabled = isDisabled;
    });

    this.totalPriceDiv.textContent = `${this.currencySymbol + this.calculateTotalPrice().toFixed(2)}`;
  }

  updateItemRange() {
    const itemRangeValue = (this.bundleItems.length / this.BUNDLE_LIMIT) * 100;
    this.itemRangeDiv.style.setProperty('--item-range', `${itemRangeValue}%`);
  }

  handleAddToCart() {
    const items = this.bundleItems.map(item => ({ id: item.id, quantity: item.quantity }));
    if (items.length > 0) {
      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: items })
      })
      .then(response => response.json())
      .then(data => {
        console.log("Added to cart:", data);
        window.location.href = '/cart';
      })
      .catch(error => console.error("Error adding to cart:", error));
    }
  }
}

customElements.define('bundle-manager', BundleManager);