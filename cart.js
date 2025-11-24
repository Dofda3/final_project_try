// ========================================
// SHOPPING CART PAGE - JavaScript File
// Purpose: Display cart, manage quantities, and handle checkout
// ========================================

/**
 * Initialize the shopping cart page
 * - Load and display cart items from localStorage
 * - Add event listeners to action buttons
 */
document.addEventListener('DOMContentLoaded', function() {
    // Render the cart items on page load
    renderCart();
    
    // Add event listeners to action buttons
    const deleteAllBtn = document.getElementById('delete-all-btn');
    const buyNowBtn = document.getElementById('buy-now-btn');
    
    if (deleteAllBtn) {
        deleteAllBtn.addEventListener('click', handleDeleteAll);
    }
    
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', handleBuyNow);
    }
});

/**
 * Render the shopping cart by displaying all items in the table
 */
function renderCart() {
    const cartBody = document.getElementById('cart-body');
    const cart = getCart();
    
    // Clear existing table rows
    cartBody.innerHTML = '';
    
    // Check if cart is empty
    if (cart.length === 0) {
        cartBody.innerHTML = '<tr><td colspan="6" class="empty-cart">Your cart is empty</td></tr>';
        updateCartSummary();
        return;
    }
    
    // Create a table row for each product in the cart
    cart.forEach(product => {
        const row = createCartRow(product);
        cartBody.appendChild(row);
    });
    
    // Update the cart summary
    updateCartSummary();
}

/**
 * Create a table row for a single product
 * @param {Object} product - The product object
 * @returns {HTMLElement} - A table row element
 */
function createCartRow(product) {
    const row = document.createElement('tr');
    
    // Calculate total price for this product
    const totalPrice = product.price * product.quantity;
    
    // Create table cells
    row.innerHTML = `
        <td>${product.name}</td>
        <td><img src="${product.image}" alt="${product.name}"></td>
        <td>$${product.price}</td>
        <td>
            <input type="number" 
                   class="quantity-input" 
                   value="${product.quantity}" 
                   min="1" 
                   data-product-id="${product.id}">
        </td>
        <td>$${totalPrice}</td>
        <td>
            <button class="delete-btn" data-product-id="${product.id}">Delete</button>
        </td>
    `;
    
    // Add event listeners to quantity input and delete button
    const quantityInput = row.querySelector('.quantity-input');
    const deleteBtn = row.querySelector('.delete-btn');
    
    quantityInput.addEventListener('change', handleQuantityChange);
    deleteBtn.addEventListener('click', handleDeleteProduct);
    
    return row;
}

/**
 * Handle quantity change for a product
 * @param {Event} event - The change event from quantity input
 */
function handleQuantityChange(event) {
    const input = event.target;
    const productId = input.getAttribute('data-product-id');
    const newQuantity = parseInt(input.value);
    
    // Validate quantity (must be at least 1)
    if (newQuantity < 1) {
        input.value = 1;
        return;
    }
    
    // Update cart with new quantity
    let cart = getCart();
    const product = cart.find(item => item.id === productId);
    
    if (product) {
        product.quantity = newQuantity;
        saveCart(cart);
        renderCart(); // Re-render to update all calculations
    }
}

/**
 * Handle deletion of a single product
 * @param {Event} event - The click event from delete button
 */
function handleDeleteProduct(event) {
    const button = event.target;
    const productId = button.getAttribute('data-product-id');
    
    // Remove product from cart
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    
    // Save updated cart
    saveCart(cart);
    
    // Re-render cart
    renderCart();
}

/**
 * Handle "Delete All" button click
 * Clears the entire cart after user confirmation
 */
function handleDeleteAll() {
    // Confirm with user before deleting all items
    if (confirm('Are you sure you want to delete all items from your cart?')) {
        // Clear cart
        saveCart([]);
        
        // Re-render cart
        renderCart();
    }
}

/**
 * Handle "Buy Now" button click
 * Clears the cart after user confirmation
 */
function handleBuyNow() {
    const cart = getCart();
    
    // Check if cart is empty
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items before checkout.');
        return;
    }
    
    // Calculate total for confirmation message
    const total = calculateTotal(cart);
    
    // Confirm purchase with user
    if (confirm(`Complete purchase? Total: $${total}\n\nThis will clear your cart.`)) {
        // Clear cart
        saveCart([]);
        
        // Show success message
        alert('Thank you for your purchase! Your order has been confirmed.');
        
        // Re-render cart
        renderCart();
    }
}

/**
 * Update the cart summary (total items and total price)
 */
function updateCartSummary() {
    const cart = getCart();
    
    // Calculate total items and total price
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = calculateTotal(cart);
    
    // Update summary display
    const totalItemsElement = document.getElementById('total-items');
    const totalPriceElement = document.getElementById('total-price');
    
    if (totalItemsElement) {
        totalItemsElement.textContent = totalItems;
    }
    
    if (totalPriceElement) {
        totalPriceElement.textContent = totalPrice;
    }
    
    // Enable/disable buy button based on cart status
    const buyNowBtn = document.getElementById('buy-now-btn');
    if (buyNowBtn) {
        buyNowBtn.disabled = cart.length === 0;
    }
}

/**
 * Calculate the total price of all items in the cart
 * @param {Array} cart - Array of product objects
 * @returns {number} - Total price
 */
function calculateTotal(cart) {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

/**
 * Get the shopping cart from localStorage
 * @returns {Array} - Array of product objects in the cart
 */
function getCart() {
    const cartData = localStorage.getItem('cart');
    // Return parsed cart data or empty array if nothing exists
    return cartData ? JSON.parse(cartData) : [];
}

/**
 * Save the shopping cart to localStorage
 * @param {Array} cart - Array of product objects to save
 */
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}
